import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  NotEquals,
  ValidateIf,
  ValidateNested,
} from "class-validator"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import {
  PricingService,
  ProductService,
  ProductVariantInventoryService,
  ProductVariantService,
} from "../../../../services"
import {
  ProductSalesChannelReq,
  ProductTagReq,
  ProductTypeReq,
  ProductProductCategoryReq,
} from "../../../../types/product"

import { Type } from "class-transformer"
import { EntityManager } from "typeorm"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { ProductStatus, ProductVariant } from "../../../../models"
import {
  CreateProductVariantInput,
  ProductVariantPricesUpdateReq,
} from "../../../../types/product-variant"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { validator } from "../../../../utils/validator"
import { MedusaError } from "medusa-core-utils"
import { DistributedTransaction } from "../../../../utils/transaction"
import {
  createVariantTransaction,
  revertVariantTransaction,
} from "./transaction/create-product-variant"
import { IInventoryService } from "../../../../interfaces"
import { Logger } from "../../../../types/global"

/**
 * @oas [post] /products/{id}
 * operationId: "PostProductsProduct"
 * summary: "Update a Product"
 * description: "Updates a Product"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductsProductReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.update(product_id, {
 *         title: 'Shirt',
 *         images: []
 *       })
 *       .then(({ product }) => {
 *         console.log(product.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/products/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "title": "Size"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(AdminPostProductsProductReq, req.body)

  const logger: Logger = req.scope.resolve("logger")
  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const inventoryService: IInventoryService | undefined =
    req.scope.resolve("inventoryService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    const { variants } = validated
    delete validated.variants

    await productService
      .withTransaction(transactionManager)
      .update(id, validated)

    if (!variants) {
      return
    }

    const product = await productService
      .withTransaction(transactionManager)
      .retrieve(id, {
        relations: ["variants"],
      })

    // Iterate product variants and update their properties accordingly
    for (const variant of product.variants) {
      const exists = variants.find((v) => v.id && variant.id === v.id)
      if (!exists) {
        await productVariantService
          .withTransaction(transactionManager)
          .delete(variant.id)
      }
    }

    const allVariantTransactions: DistributedTransaction[] = []
    const transactionDependencies = {
      manager: transactionManager,
      inventoryService,
      productVariantInventoryService,
      productVariantService,
    }

    for (const [index, newVariant] of variants.entries()) {
      const variantRank = index

      if (newVariant.id) {
        const variant = product.variants.find((v) => v.id === newVariant.id)

        if (!variant) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Variant with id: ${newVariant.id} is not associated with this product`
          )
        }

        await productVariantService
          .withTransaction(transactionManager)
          .update(variant, {
            ...newVariant,
            variant_rank: variantRank,
            product_id: variant.product_id,
          })
      } else {
        // If the provided variant does not have an id, we assume that it
        // should be created

        try {
          const input = {
            ...newVariant,
            variant_rank: variantRank,
            options: newVariant.options || [],
            prices: newVariant.prices || [],
          }

          const varTransation = await createVariantTransaction(
            transactionDependencies,
            product.id,
            input as CreateProductVariantInput
          )
          allVariantTransactions.push(varTransation)
        } catch (e) {
          await Promise.all(
            allVariantTransactions.map(async (transaction) => {
              await revertVariantTransaction(
                transactionDependencies,
                transaction
              ).catch(() => logger.warn("Transaction couldn't be reverted."))
            })
          )

          throw e
        }
      }
    }
  })

  const rawProduct = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  const [product] = await pricingService.setProductPrices([rawProduct])

  res.json({ product })
}

class ProductVariantOptionReq {
  @IsString()
  value: string

  @IsString()
  option_id: string
}

class ProductVariantReq {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  sku?: string

  @IsString()
  @IsOptional()
  ean?: string

  @IsString()
  @IsOptional()
  upc?: string

  @IsString()
  @IsOptional()
  barcode?: string

  @IsString()
  @IsOptional()
  hs_code?: string

  @IsInt()
  @IsOptional()
  inventory_quantity?: number

  @IsBoolean()
  @IsOptional()
  allow_backorder?: boolean

  @IsBoolean()
  @IsOptional()
  manage_inventory?: boolean

  @IsNumber()
  @IsOptional()
  weight?: number

  @IsNumber()
  @IsOptional()
  length?: number

  @IsNumber()
  @IsOptional()
  height?: number

  @IsNumber()
  @IsOptional()
  width?: number

  @IsString()
  @IsOptional()
  origin_country?: string

  @IsString()
  @IsOptional()
  mid_code?: string

  @IsString()
  @IsOptional()
  material?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantPricesUpdateReq)
  prices?: ProductVariantPricesUpdateReq[]

  @IsOptional()
  @Type(() => ProductVariantOptionReq)
  @ValidateNested({ each: true })
  @IsArray()
  options?: ProductVariantOptionReq[] = []
}

/**
 * @schema AdminPostProductsProductReq
 * type: object
 * properties:
 *   title:
 *     description: "The title of the Product"
 *     type: string
 *   subtitle:
 *     description: "The subtitle of the Product"
 *     type: string
 *   description:
 *     description: "A description of the Product."
 *     type: string
 *   discountable:
 *     description: A flag to indicate if discounts can be applied to the LineItems generated from this Product
 *     type: boolean
 *   images:
 *     description: Images of the Product.
 *     type: array
 *     items:
 *       type: string
 *   thumbnail:
 *     description: The thumbnail to use for the Product.
 *     type: string
 *   handle:
 *     description: A unique handle to identify the Product by.
 *     type: string
 *   status:
 *     description: The status of the product.
 *     type: string
 *     enum: [draft, proposed, published, rejected]
 *   type:
 *     description: The Product Type to associate the Product with.
 *     type: object
 *     required:
 *       - value
 *     properties:
 *       id:
 *         description: The ID of the Product Type.
 *         type: string
 *       value:
 *         description: The value of the Product Type.
 *         type: string
 *   collection_id:
 *     description: The ID of the Collection the Product should belong to.
 *     type: string
 *   tags:
 *     description: Tags to associate the Product with.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - value
 *       properties:
 *         id:
 *           description: The ID of an existing Tag.
 *           type: string
 *         value:
 *           description: The value of the Tag, these will be upserted.
 *           type: string
 *   sales_channels:
 *     description: "[EXPERIMENTAL] Sales channels to associate the Product with."
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: The ID of an existing Sales channel.
 *           type: string
 *   categories:
 *     description: "Categories to add the Product to."
 *     type: array
 *     items:
 *       required:
 *         - id
 *       properties:
 *         id:
 *           description: The ID of a Product Category.
 *           type: string
 *   variants:
 *     description: A list of Product Variants to create with the Product.
 *     type: array
 *     items:
 *       type: object
 *       properties:
 *         id:
 *           description: The ID of the Product Variant.
 *           type: string
 *         title:
 *           description: The title to identify the Product Variant by.
 *           type: string
 *         sku:
 *           description: The unique SKU for the Product Variant.
 *           type: string
 *         ean:
 *           description: The EAN number of the item.
 *           type: string
 *         upc:
 *           description: The UPC number of the item.
 *           type: string
 *         barcode:
 *           description: A generic GTIN field for the Product Variant.
 *           type: string
 *         hs_code:
 *           description: The Harmonized System code for the Product Variant.
 *           type: string
 *         inventory_quantity:
 *           description: The amount of stock kept for the Product Variant.
 *           type: integer
 *         allow_backorder:
 *           description: Whether the Product Variant can be purchased when out of stock.
 *           type: boolean
 *         manage_inventory:
 *           description: Whether Medusa should keep track of the inventory for this Product Variant.
 *           type: boolean
 *         weight:
 *           description: The wieght of the Product Variant.
 *           type: number
 *         length:
 *           description: The length of the Product Variant.
 *           type: number
 *         height:
 *           description: The height of the Product Variant.
 *           type: number
 *         width:
 *           description: The width of the Product Variant.
 *           type: number
 *         origin_country:
 *           description: The country of origin of the Product Variant.
 *           type: string
 *         mid_code:
 *           description: The Manufacturer Identification code for the Product Variant.
 *           type: string
 *         material:
 *           description: The material composition of the Product Variant.
 *           type: string
 *         metadata:
 *           description: An optional set of key-value pairs with additional information.
 *           type: object
 *         prices:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               id:
 *                 description: The ID of the Price.
 *                 type: string
 *               region_id:
 *                 description: The ID of the Region for which the price is used. Only required if currency_code is not provided.
 *                 type: string
 *               currency_code:
 *                 description: The 3 character ISO currency code for which the price will be used. Only required if region_id is not provided.
 *                 type: string
 *                 externalDocs:
 *                   url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *                   description: See a list of codes.
 *               amount:
 *                 description: The amount to charge for the Product Variant.
 *                 type: integer
 *               min_quantity:
 *                 description: The minimum quantity for which the price will be used.
 *                 type: integer
 *               max_quantity:
 *                 description: The maximum quantity for which the price will be used.
 *                 type: integer
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - option_id
 *               - value
 *             properties:
 *               option_id:
 *                 description: The ID of the Option.
 *                 type: string
 *               value:
 *                 description: The value to give for the Product Option at the same index in the Product's `options` field.
 *                 type: string
 *   weight:
 *     description: The wieght of the Product.
 *     type: number
 *   length:
 *     description: The length of the Product.
 *     type: number
 *   height:
 *     description: The height of the Product.
 *     type: number
 *   width:
 *     description: The width of the Product.
 *     type: number
 *   origin_country:
 *     description: The country of origin of the Product.
 *     type: string
 *   mid_code:
 *     description: The Manufacturer Identification code for the Product.
 *     type: string
 *   material:
 *     description: The material composition of the Product.
 *     type: string
 *   metadata:
 *     description: An optional set of key-value pairs with additional information.
 *     type: object
 */
export class AdminPostProductsProductReq {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  subtitle?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsBoolean()
  @IsOptional()
  discountable?: boolean

  @IsArray()
  @IsOptional()
  images?: string[]

  @IsString()
  @IsOptional()
  thumbnail?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsEnum(ProductStatus)
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  status?: ProductStatus

  @IsOptional()
  @Type(() => ProductTypeReq)
  @ValidateNested()
  type?: ProductTypeReq

  @IsOptional()
  @IsString()
  collection_id?: string

  @IsOptional()
  @Type(() => ProductTagReq)
  @ValidateNested({ each: true })
  @IsArray()
  tags?: ProductTagReq[]

  @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [
    IsOptional(),
    Type(() => ProductSalesChannelReq),
    ValidateNested({ each: true }),
    IsArray(),
  ])
  sales_channels?: ProductSalesChannelReq[] | null

  @IsOptional()
  @Type(() => ProductProductCategoryReq)
  @ValidateNested({ each: true })
  @IsArray()
  categories?: ProductProductCategoryReq[]

  @IsOptional()
  @Type(() => ProductVariantReq)
  @ValidateNested({ each: true })
  @IsArray()
  variants?: ProductVariantReq[]

  @IsNumber()
  @IsOptional()
  weight?: number

  @IsNumber()
  @IsOptional()
  length?: number

  @IsNumber()
  @IsOptional()
  height?: number

  @IsNumber()
  @IsOptional()
  width?: number

  @IsString()
  @IsOptional()
  hs_code?: string

  @IsString()
  @IsOptional()
  origin_country?: string

  @IsString()
  @IsOptional()
  mid_code?: string

  @IsString()
  @IsOptional()
  material?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
