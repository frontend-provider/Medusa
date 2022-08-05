import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Transform, Type } from "class-transformer"
import _, { pickBy } from "lodash"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."

import { AdminGetDiscountsDiscountRuleParams } from "../../../../types/discount"
import { Discount } from "../../../.."
import DiscountService from "../../../../services/discount"
import { FindConfig } from "../../../../types/common"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /discounts
 * operationId: "GetDiscounts"
 * summary: "List Discounts"
 * x-authenticated: true
 * description: "Retrieves a list of Discounts"
 * parameters:
 *   - (query) q {string} Search query applied on the code field.
 *   - in: query
 *     name: rule
 *     description: Discount Rules filters to apply on the search
 *     schema:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [fixed, percentage, free_shipping]
 *           description: "The type of the Discount, can be `fixed` for discounts that reduce the price by a fixed amount, `percentage` for percentage reductions or `free_shipping` for shipping vouchers."
 *         allocation:
 *           type: string
 *           enum: [total, item]
 *           description: "The value that the discount represents; this will depend on the type of the discount"
 *   - (query) is_dynamic {boolean} Return only dynamic discounts.
 *   - (query) is_disabled {boolean} Return only disabled discounts.
 *   - (query) limit=20 {number} The number of items in the response
 *   - (query) offset=0 {number} The offset of items in response
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             discounts:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/discount"
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
export default async (req, res) => {
  const validated = await validator(AdminGetDiscountsParams, req.query)

  const discountService: DiscountService = req.scope.resolve("discountService")

  const relations =
    validated.expand?.split(",") ?? defaultAdminDiscountsRelations

  const listConfig: FindConfig<Discount> = {
    select: defaultAdminDiscountsFields,
    relations,
    skip: validated.offset,
    take: validated.limit,
    order: { created_at: "DESC" },
  }

  const filterableFields = _.omit(validated, ["limit", "offset", "expand"])

  const [discounts, count] = await discountService.listAndCount(
    pickBy(filterableFields, (val) => typeof val !== "undefined"),
    listConfig
  )

  res.status(200).json({
    discounts,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetDiscountsParams {
  @ValidateNested()
  @IsOptional()
  @Type(() => AdminGetDiscountsDiscountRuleParams)
  rule?: AdminGetDiscountsDiscountRuleParams

  @IsString()
  @IsOptional()
  q?: string

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  is_dynamic?: boolean

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  is_disabled?: boolean

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit = 20

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsString()
  @IsOptional()
  expand?: string
}
