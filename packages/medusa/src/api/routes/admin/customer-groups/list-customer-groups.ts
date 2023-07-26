import { IsNumber, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"

import { CustomerGroupService } from "../../../../services"
import { FilterableCustomerGroupProps } from "../../../../types/customer-groups"
import { Type } from "class-transformer"

/**
 * @oas [get] /admin/customer-groups
 * operationId: "GetCustomerGroups"
 * summary: "List Customer Groups"
 * description: "Retrieve a list of customer groups. The customer groups can be filtered by fields such as `name` or `id. The customer groups can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} term to search customer groups by name.
 *   - (query) offset=0 {integer} The number of customer groups to skip when retrieving the customer groups.
 *   - (query) order {string} A field to sort order the retrieved customer groups by.
 *   - (query) discount_condition_id {string} Filter by discount condition ID.
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by the customer group ID
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: customer group ID
 *         - type: array
 *           description: an array of customer group IDs
 *           items:
 *             type: string
 *         - type: object
 *           properties:
 *             lt:
 *               type: string
 *               description: filter by IDs less than this ID
 *             gt:
 *               type: string
 *               description: filter by IDs greater than this ID
 *             lte:
 *               type: string
 *               description: filter by IDs less than or equal to this ID
 *             gte:
 *               type: string
 *               description: filter by IDs greater than or equal to this ID
 *   - in: query
 *     name: name
 *     style: form
 *     explode: false
 *     description: Filter by the customer group name
 *     schema:
 *       type: array
 *       description: an array of customer group names
 *       items:
 *         type: string
 *         description: customer group name
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
 *   - (query) limit=10 {integer} The number of customer groups to return.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned customer groups.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetCustomerGroupsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.customerGroups.list()
 *       .then(({ customer_groups, limit, offset, count }) => {
 *         console.log(customer_groups.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl 'https://medusa-url.com/admin/customer-groups' \
 *       -H 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Customer Groups
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCustomerGroupsListRes"
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
export default async (req: Request, res: Response) => {
  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const [data, count] = await customerGroupService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery
  res.json({
    count,
    customer_groups: data,
    offset,
    limit,
  })
}

export class AdminGetCustomerGroupsParams extends FilterableCustomerGroupProps {
  @IsString()
  @IsOptional()
  order?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10

  @IsString()
  @IsOptional()
  expand?: string
}
