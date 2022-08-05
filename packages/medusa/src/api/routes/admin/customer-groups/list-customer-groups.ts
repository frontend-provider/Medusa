import { IsNumber, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"

import { CustomerGroupService } from "../../../../services"
import { FilterableCustomerGroupProps } from "../../../../types/customer-groups"
import { Type } from "class-transformer"

/**
 * @oas [get] /customer-groups
 * operationId: "GetCustomerGroups"
 * summary: "Retrieve a list of customer groups"
 * description: "Retrieve a list of customer groups."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching customer group names.
 *   - (query) offset=0 {integer} How many groups to skip in the result.
 *   - (query) order {string} the field used to order the customer groups.
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
 *           description: multiple customer group IDs
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
 *       description: multiple customer group names
 *       items:
 *         type: string
 *         description: customer group name
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting customer groups were created.
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
 *     description: Date comparison for when resulting customer groups were updated.
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
 *   - (query) limit=10 {integer} Limit the number of customer groups returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each customer groups of the result.

 * tags:
 *   - Customer Group
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer_groups:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/customer_group"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
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
