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
import { PricingService, ProductService } from "../../../../services"
import {
  ProductSalesChannelReq,
  ProductTagReq,
  ProductTypeReq,
} from "../../../../types/product"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."

import { EntityManager } from "typeorm"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { ProductStatus } from "../../../../models"
import { ProductVariantPricesUpdateReq } from "../../../../types/product-variant"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

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
 *         properties:
 *           title:
 *             description: "The title of the Product"
 *             type: string
 *           subtitle:
 *             description: "The subtitle of the Product"
 *             type: string
 *           description:
 *             description: "A description of the Product."
 *             type: string
 *           discountable:
 *             description: A flag to indicate if discounts can be applied to the LineItems generated from this Product
 *             type: boolean
 *           images:
 *             description: Images of the Product.
 *             type: array
 *             items:
 *               type: string
 *           thumbnail:
 *             description: The thumbnail to use for the Product.
 *             type: string
 *           handle:
 *             description: A unique handle to identify the Product by.
 *             type: string
 *           status:
 *             description: The status of the product.
 *             type: string
 *             enum: [draft, proposed, published, rejected]
 *           type:
 *             description: The Product Type to associate the Product with.
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               id:
 *                 description: The ID of the Product Type.
 *                 type: string
 *               value:
 *                 description: The value of the Product Type.
 *                 type: string
 *           collection_id:
 *             description: The ID of the Collection the Product should belong to.
 *             type: string
 *           tags:
 *             description: Tags to associate the Product with.
 *             type: array
 *             items:
 *               required:
 *                 - value
 *               properties:
 *                 id:
 *                   description: The ID of an existing Tag.
 *                   type: string
 *                 value:
 *                   description: The value of the Tag, these will be upserted.
 *                   type: string
 *           sales_channels:
 *             description: "[EXPERIMENTAL] Sales channels to associate the Product with."
 *             type: array
 *             items:
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   description: The ID of an existing Sales channel.
 *                   type: string
 *           variants:
 *             description: A list of Product Variants to create with the Product.
 *             type: array
 *             items:
 *               properties:
 *                 id:
 *                   description: The ID of the Product Variant.
 *                   type: string
 *                 title:
 *                   description: The title to identify the Product Variant by.
 *                   type: string
 *                 sku:
 *                   description: The unique SKU for the Product Variant.
 *                   type: string
 *                 ean:
 *                   description: The EAN number of the item.
 *                   type: string
 *                 upc:
 *                   description: The UPC number of the item.
 *                   type: string
 *                 barcode:
 *                   description: A generic GTIN field for the Product Variant.
 *                   type: string
 *                 hs_code:
 *                   description: The Harmonized System code for the Product Variant.
 *                   type: string
 *                 inventory_quantity:
 *                   description: The amount of stock kept for the Product Variant.
 *                   type: integer
 *                 allow_backorder:
 *                   description: Whether the Product Variant can be purchased when out of stock.
 *                   type: boolean
 *                 manage_inventory:
 *                   description: Whether Medusa should keep track of the inventory for this Product Variant.
 *                   type: boolean
 *                 weight:
 *                   description: The wieght of the Product Variant.
 *                   type: number
 *                 length:
 *                   description: The length of the Product Variant.
 *                   type: number
 *                 height:
 *                   description: The height of the Product Variant.
 *                   type: number
 *                 width:
 *                   description: The width of the Product Variant.
 *                   type: number
 *                 origin_country:
 *                   description: The country of origin of the Product Variant.
 *                   type: string
 *                 mid_code:
 *                   description: The Manufacturer Identification code for the Product Variant.
 *                   type: string
 *                 material:
 *                   description: The material composition of the Product Variant.
 *                   type: string
 *                 metadata:
 *                   description: An optional set of key-value pairs with additional information.
 *                   type: object
 *                 prices:
 *                   type: array
 *                   items:
 *                     required:
 *                       - amount
 *                     properties:
 *                       id:
 *                         description: The ID of the Price.
 *                         type: string
 *                       region_id:
 *                         description: The ID of the Region for which the price is used. Only required if currency_code is not provided.
 *                         type: string
 *                       currency_code:
 *                         description: The 3 character ISO currency code for which the price will be used. Only required if region_id is not provided.
 *                         type: string
 *                         externalDocs:
 *                           url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *                           description: See a list of codes.
 *                       amount:
 *                         description: The amount to charge for the Product Variant.
 *                         type: integer
 *                       min_quantity:
 *                         description: The minimum quantity for which the price will be used.
 *                         type: integer
 *                       max_quantity:
 *                         description: The maximum quantity for which the price will be used.
 *                         type: integer
 *                 options:
 *                   type: array
 *                   items:
 *                     required:
 *                       - option_id
 *                       - value
 *                     properties:
 *                       option_id:
 *                         description: The ID of the Option.
 *                         type: string
 *                       value:
 *                         description: The value to give for the Product Option at the same index in the Product's `options` field.
 *                         type: string
 *           weight:
 *             description: The wieght of the Product.
 *             type: number
 *           length:
 *             description: The length of the Product.
 *             type: number
 *           height:
 *             description: The height of the Product.
 *             type: number
 *           width:
 *             description: The width of the Product.
 *             type: number
 *           origin_country:
 *             description: The country of origin of the Product.
 *             type: string
 *           mid_code:
 *             description: The Manufacturer Identification code for the Product.
 *             type: string
 *           material:
 *             description: The material composition of the Product.
 *             type: string
 *           metadata:
 *             description: An optional set of key-value pairs with additional information.
 *             type: object
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(AdminPostProductsProductReq, req.body)

  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await productService
      .withTransaction(transactionManager)
      .update(id, validated)
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
  prices: ProductVariantPricesUpdateReq[]

  @IsOptional()
  @Type(() => ProductVariantOptionReq)
  @ValidateNested({ each: true })
  @IsArray()
  options?: ProductVariantOptionReq[] = []
}

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
  images: string[]

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
  sales_channels: ProductSalesChannelReq[] | null

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
