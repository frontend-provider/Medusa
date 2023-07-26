import {
  DateComparisonOperator,
  FindPaginationParams,
  StringComparisonOperator,
} from "../../../../types/common"
import { IsOptional, IsString } from "class-validator"

import { IsType } from "../../../../utils/validators/is-type"
import ProductTypeService from "../../../../services/product-type"

/**
 * @oas [get] /store/product-types
 * operationId: "GetProductTypes"
 * summary: "List Product Types"
 * description: "Retrieve a list of product types. The product types can be filtered by fields such as `value` or `q`. The product types can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=20 {integer} Limit the number of product types returned.
 *   - (query) offset=0 {integer} The number of product types to skip when retrieving the product types.
 *   - (query) order {string} A product-type field to sort-order the retrieved product types by.
 *   - (query) discount_condition_id {string} Filter by the ID of a discount condition. When provided, only types that the discount condition applies for will be retrieved.
 *   - in: query
 *     name: value
 *     style: form
 *     explode: false
 *     description: Filter by type values.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by IDs.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - (query) q {string} term to search product type's value.
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
 * x-codegen:
 *   method: list
 *   queryParams: StoreGetProductTypesParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.productTypes.list()
 *       .then(({ product_types }) => {
 *         console.log(product_types.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl 'https://medusa-url.com/store/product-types'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Types
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/StoreProductTypesListRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const typeService: ProductTypeService =
    req.scope.resolve("productTypeService")

  const { listConfig, filterableFields } = req
  const { skip, take } = req.listConfig

  const [types, count] = await typeService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    product_types: types,
    count,
    offset: skip,
    limit: take,
  })
}

// eslint-disable-next-line max-len
export class StoreGetProductTypesParams extends FindPaginationParams {
  @IsType([String, [String], StringComparisonOperator])
  @IsOptional()
  id?: string | string[] | StringComparisonOperator

  @IsString()
  @IsOptional()
  q?: string

  @IsType([String, [String], StringComparisonOperator])
  @IsOptional()
  value?: string | string[] | StringComparisonOperator

  @IsType([DateComparisonOperator])
  @IsOptional()
  created_at?: DateComparisonOperator

  @IsType([DateComparisonOperator])
  @IsOptional()
  updated_at?: DateComparisonOperator

  @IsString()
  @IsOptional()
  order?: string

  @IsString()
  @IsOptional()
  discount_condition_id?: string
}
