import {
  CartService,
  ProductService,
  ProductVariantInventoryService,
} from "../../../../services"
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Transform, Type } from "class-transformer"

import { DateComparisonOperator } from "../../../../types/common"
import { FeatureFlagDecorators } from "../../../../utils/feature-flag-decorators"
import { IsType } from "../../../../utils/validators/is-type"
import { PriceSelectionParams } from "../../../../types/price-selection"
import PricingService from "../../../../services/pricing"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { defaultStoreCategoryScope } from "../product-categories"
import { optionalBooleanMapper } from "../../../../utils/validators/is-boolean"

/**
 * @oas [get] /store/products
 * operationId: GetProducts
 * summary: List Products
 * description: |
 *   Retrieves a list of products. The products can be filtered by fields such as `id` or `q`. The products can also be sorted or paginated.
 *   This endpoint can also be used to retrieve a product by its handle.
 *
 *   For accurate and correct pricing of the products based on the customer's context, it's highly recommended to pass fields such as
 *   `region_id`, `currency_code`, and `cart_id` when available.
 *
 *   Passing `sales_channel_id` ensures retrieving only products available in the specified sales channel.
 *   You can alternatively use a publishable API key in the request header instead of passing a `sales_channel_id`.
 * externalDocs:
 *   description: "How to retrieve a product by its handle"
 *   url: "https://docs.medusajs.com/modules/products/storefront/show-products#retrieve-product-by-handle"
 * parameters:
 *   - (query) q {string} term used to search products' title, description, variant's title, variant's sku, and collection's title.
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by IDs.
 *     schema:
 *       oneOf:
 *         - type: string
 *         - type: array
 *           items:
 *             type: string
 *   - in: query
 *     name: sales_channel_id
 *     style: form
 *     explode: false
 *     description: "Filter by sales channel IDs. When provided, only products available in the selected sales channels are retrieved. Alternatively, you can pass a
 *      publishable API key in the request header and this will have the same effect."
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: collection_id
 *     style: form
 *     explode: false
 *     description: Filter by product collection IDs. When provided, only products that belong to the specified product collections are retrieved.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: type_id
 *     style: form
 *     explode: false
 *     description: Filter by product type IDs. When provided, only products that belong to the specified product types are retrieved.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: tags
 *     style: form
 *     explode: false
 *     description: Filter by product tag IDs. When provided, only products that belong to the specified product tags are retrieved.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) title {string} Filter by title.
 *   - (query) description {string} Filter by description
 *   - (query) handle {string} Filter by handle.
 *   - (query) is_giftcard {boolean} Whether to retrieve regular products or gift-card products.
 *   - in: query
 *     name: created_at
 *     description: Filter by a creation date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Filter by an update date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: category_id
 *     style: form
 *     explode: false
 *     description: Filter by product category IDs. When provided, only products that belong to the specified product categories are retrieved.
 *     schema:
 *       type: array
 *       x-featureFlag: "product_categories"
 *       items:
 *         type: string
 *   - in: query
 *     name: include_category_children
 *     style: form
 *     explode: false
 *     description: Whether to include child product categories when filtering using the `category_id` field.
 *     schema:
 *       type: boolean
 *       x-featureFlag: "product_categories"
 *   - (query) offset=0 {integer} The number of products to skip when retrieving the products.
 *   - (query) limit=100 {integer} Limit the number of products returned.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned products.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned products.
 *   - (query) order {string} A product field to sort-order the retrieved products by.
 *   - (query) cart_id {string} The ID of the cart. This is useful for accurate pricing based on the cart's context.
 *   - (query) region_id {string} The ID of the region. This is useful for accurate pricing based on the selected region.
 *   - in: query
 *     name: currency_code
 *     style: form
 *     explode: false
 *     description: A 3 character ISO currency code. This is useful for accurate pricing based on the selected currency.
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *         description: See a list of codes.
 * x-codegen:
 *   method: list
 *   queryParams: StoreGetProductsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.products.list()
 *       .then(({ products, limit, offset, count }) => {
 *         console.log(products.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl 'https://medusa-url.com/store/products'
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreProductsListRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
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
  const productService: ProductService = req.scope.resolve("productService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const cartService: CartService = req.scope.resolve("cartService")

  const validated = req.validatedQuery as StoreGetProductsParams

  let {
    cart_id,
    region_id: regionId,
    currency_code: currencyCode,
    ...filterableFields
  } = req.filterableFields

  const listConfig = req.listConfig

  // get only published products for store endpoint
  filterableFields["status"] = ["published"]
  // store APIs only receive active and public categories to query from
  filterableFields["categories"] = {
    ...(filterableFields.categories || {}),
    // Store APIs are only allowed to query active and public categories
    ...defaultStoreCategoryScope,
  }

  if (req.publishableApiKeyScopes?.sales_channel_ids.length) {
    filterableFields.sales_channel_id =
      filterableFields.sales_channel_id ||
      req.publishableApiKeyScopes.sales_channel_ids

    if (!listConfig.relations.includes("listConfig.relations")) {
      listConfig.relations.push("sales_channels")
    }
  }

  const promises: Promise<any>[] = []

  promises.push(productService.listAndCount(filterableFields, listConfig))

  if (validated.cart_id) {
    promises.push(
      cartService.retrieve(validated.cart_id, {
        select: ["id", "region_id"] as any,
        relations: ["region"],
      })
    )
  }

  const [[rawProducts, count], cart] = await Promise.all(promises)

  if (validated.cart_id) {
    regionId = cart.region_id
    currencyCode = cart.region.currency_code
  }

  // Create a new reference just for naming purpose
  const computedProducts = rawProducts

  // We only set prices if variants.prices are requested
  const shouldSetPricing = ["variants", "variants.prices"].every((relation) =>
    listConfig.relations?.includes(relation)
  )

  // We only set availability if variants are requested
  const shouldSetAvailability = listConfig.relations?.includes("variants")

  const decoratePromises: Promise<any>[] = []

  if (shouldSetPricing) {
    decoratePromises.push(
      pricingService.setProductPrices(computedProducts, {
        cart_id: cart_id,
        region_id: regionId,
        currency_code: currencyCode,
        customer_id: req.user?.customer_id,
        include_discount_prices: true,
      })
    )
  }

  if (shouldSetAvailability) {
    decoratePromises.push(
      productVariantInventoryService.setProductAvailability(
        computedProducts,
        filterableFields.sales_channel_id
      )
    )
  }

  // We can run them concurrently as the new properties are assigned to the references
  // of the appropriate entity
  await Promise.all(decoratePromises)

  res.json({
    products: cleanResponseData(computedProducts, req.allowedProperties || []),
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class StoreGetProductsPaginationParams extends PriceSelectionParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 100

  @IsString()
  @IsOptional()
  order?: string
}

export class StoreGetProductsParams extends StoreGetProductsPaginationParams {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsString()
  @IsOptional()
  q?: string

  @IsArray()
  @IsOptional()
  collection_id?: string[]

  @IsArray()
  @IsOptional()
  tags?: string[]

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  is_giftcard?: boolean

  @IsArray()
  @IsOptional()
  type_id?: string[]

  @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [IsOptional(), IsArray()])
  sales_channel_id?: string[]

  @IsArray()
  @IsOptional()
  category_id?: string[]

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  include_category_children?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}
