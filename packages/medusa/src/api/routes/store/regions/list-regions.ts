import { IsInt, IsOptional, ValidateNested } from "class-validator"

import { DateComparisonOperator } from "../../../../types/common"
import RegionService from "../../../../services/region"
import { Type } from "class-transformer"
import { omit } from "lodash"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /regions
 * operationId: GetRegions
 * summary: List Regions
 * description: "Retrieves a list of Regions."
 * parameters:
 *   - (query) offset=0 {integer} How many regions to skip in the result.
 *   - (query) limit=100 {integer} Limit the number of regions returned.
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting regions were created.
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
 *     description: Date comparison for when resulting regions were updated.
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
 * tags:
 *   - Region
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             regions:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/region"
 */
export default async (req, res) => {
  const validated = await validator(StoreGetRegionsParams, req.query)
  const { limit, offset } = validated

  const regionService: RegionService = req.scope.resolve("regionService")

  const filterableFields = omit(validated, ["limit", "offset"])

  const listConfig = {
    relations: ["countries", "payment_providers", "fulfillment_providers"],
    skip: offset,
    take: limit,
  }

  const regions = await regionService.list(filterableFields, listConfig)

  res.json({ regions })
}

export class StoreGetRegionsParams {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 100

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = 0

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}
