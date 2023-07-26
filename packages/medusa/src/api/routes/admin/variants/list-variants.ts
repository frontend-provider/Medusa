import {
  CartService,
  PricingService,
  ProductVariantInventoryService,
  RegionService,
  SalesChannelService,
} from "../../../../services"
import { IsInt, IsOptional, IsString } from "class-validator"

import { AdminPriceSelectionParams } from "../../../../types/price-selection"
import { IInventoryService } from "@medusajs/types"
import { IsType } from "../../../../utils/validators/is-type"
import { NumericalComparisonOperator } from "../../../../types/common"
import { PricedVariant } from "../../../../types/pricing"
import ProductVariantService from "../../../../services/product-variant"
import { Type } from "class-transformer"
import { omit } from "lodash"

/**
 * @oas [get] /admin/variants
 * operationId: "GetVariants"
 * summary: "List Product Variants"
 * description: "Retrieve a list of Product Variants. The product variant can be filtered by fields such as `id` or `title`. The product variant can also be paginated."
 * x-authenticated: true
 * parameters:
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by product variant IDs.
 *     schema:
 *       oneOf:
 *        - type: string
 *          description: A product variant ID.
 *        - type: array
 *          description: An array of product variant IDs.
 *          items:
 *            type: string
 *   - (query) expand {string} "Comma-separated relations that should be expanded in the returned product variants."
 *   - (query) fields {string} "Comma-separated fields that should be included in the returned product variants."
 *   - (query) offset=0 {number} The number of product variants to skip when retrieving the product variants.
 *   - (query) limit=100 {number} Limit the number of product variants returned.
 *   - in: query
 *     name: cart_id
 *     style: form
 *     explode: false
 *     description: The ID of the cart to use for the price selection context.
 *     schema:
 *       type: string
 *   - in: query
 *     name: region_id
 *     style: form
 *     explode: false
 *     description: The ID of the region to use for the price selection context.
 *     schema:
 *       type: string
 *       externalDocs:
 *         description: "Price selection context overview"
 *         url: "https://docs.medusajs.com/modules/price-lists/price-selection-strategy#context-object"
 *   - in: query
 *     name: currency_code
 *     style: form
 *     explode: false
 *     description: The 3 character ISO currency code to use for the price selection context.
 *     schema:
 *       type: string
 *       externalDocs:
 *         description: "Price selection context overview"
 *         url: "https://docs.medusajs.com/modules/price-lists/price-selection-strategy#context-object"
 *   - in: query
 *     name: customer_id
 *     style: form
 *     explode: false
 *     description: The ID of the customer to use for the price selection context.
 *     schema:
 *       type: string
 *       externalDocs:
 *         description: "Price selection context overview"
 *         url: "https://docs.medusajs.com/modules/price-lists/price-selection-strategy#context-object"
 *   - in: query
 *     name: title
 *     style: form
 *     explode: false
 *     description: Filter by title.
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: a single title to filter by
 *         - type: array
 *           description: multiple titles to filter by
 *           items:
 *             type: string
 *   - in: query
 *     name: inventory_quantity
 *     description: Filter by available inventory quantity
 *     schema:
 *       oneOf:
 *         - type: number
 *           description: a specific number to filter by.
 *         - type: object
 *           description: filter using less and greater than comparisons.
 *           properties:
 *             lt:
 *               type: number
 *               description: filter by inventory quantity less than this number
 *             gt:
 *               type: number
 *               description: filter by inventory quantity greater than this number
 *             lte:
 *               type: number
 *               description: filter by inventory quantity less than or equal to this number
 *             gte:
 *               type: number
 *               description: filter by inventory quantity greater than or equal to this number
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetVariantsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.variants.list()
 *       .then(({ variants, limit, offset, count }) => {
 *         console.log(variants.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl 'https://medusa-url.com/admin/variants' \
 *       -H 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Variants
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminVariantsListRes"
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
  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  const pricingService: PricingService = req.scope.resolve("pricingService")
  const cartService: CartService = req.scope.resolve("cartService")
  const regionService: RegionService = req.scope.resolve("regionService")

  // We need to remove the price selection params from the array of fields
  const cleanFilterableFields = omit(req.filterableFields, [
    "cart_id",
    "region_id",
    "currency_code",
    "customer_id",
  ])

  const [rawVariants, count] = await variantService.listAndCount(
    cleanFilterableFields,
    req.listConfig
  )

  let regionId = req.validatedQuery.region_id
  let currencyCode = req.validatedQuery.currency_code
  if (req.validatedQuery.cart_id) {
    const cart = await cartService.retrieve(req.validatedQuery.cart_id, {
      select: ["id", "region_id"],
    })
    const region = await regionService.retrieve(cart.region_id, {
      select: ["id", "currency_code"],
    })
    regionId = region.id
    currencyCode = region.currency_code
  }

  let variants = await pricingService.setVariantPrices(rawVariants, {
    cart_id: req.validatedQuery.cart_id,
    region_id: regionId,
    currency_code: currencyCode,
    customer_id: req.validatedQuery.customer_id,
    include_discount_prices: true,
    ignore_cache: true,
  })

  const inventoryService: IInventoryService | undefined =
    req.scope.resolve("inventoryService")

  const salesChannelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  if (inventoryService) {
    const [salesChannelsIds] = await salesChannelService.listAndCount(
      {},
      { select: ["id"] }
    )

    variants = (await productVariantInventoryService.setVariantAvailability(
      variants,
      salesChannelsIds.map((salesChannel) => salesChannel.id)
    )) as PricedVariant[]
  }

  res.json({
    variants,
    count,
    offset: req.listConfig.offset,
    limit: req.listConfig.limit,
  })
}

export class AdminGetVariantsParams extends AdminPriceSelectionParams {
  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 20

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = 0

  @IsOptional()
  @IsString()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string

  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsOptional()
  @IsType([String, [String]])
  title?: string | string[]

  @IsOptional()
  @IsType([Number, NumericalComparisonOperator])
  inventory_quantity?: number | NumericalComparisonOperator
}
