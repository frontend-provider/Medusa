import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"
import { Transform, Type } from "class-transformer"

import BatchJobService from "../../../../services/batch-job"
import { DateComparisonOperator } from "../../../../types/common"
import { IsType } from "../../../../utils/validators/is-type"
import { Request } from "express"
import { pickBy } from "lodash"

/**
 * @oas [get] /batch-jobs
 * operationId: "GetBatchJobs"
 * summary: "List Batch Jobs"
 * description: "Retrieve a list of Batch Jobs."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {integer} The number of batch jobs to return.
 *   - (query) offset=0 {integer} The number of batch jobs to skip before results.
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by the batch ID
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: batch job ID
 *         - type: array
 *           description: multiple batch job IDs
 *           items:
 *             type: string
 *   - in: query
 *     name: type
 *     style: form
 *     explode: false
 *     description: Filter by the batch type
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *   - in: query
 *     name: confirmed_at
 *     style: form
 *     explode: false
 *     description: Date comparison for when resulting collections was confirmed, i.e. less than, greater than etc.
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
 *     name: pre_processed_at
 *     style: form
 *     explode: false
 *     description: Date comparison for when resulting collections was pre processed, i.e. less than, greater than etc.
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
 *     name: completed_at
 *     style: form
 *     explode: false
 *     description: Date comparison for when resulting collections was completed, i.e. less than, greater than etc.
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
 *     name: failed_at
 *     style: form
 *     explode: false
 *     description: Date comparison for when resulting collections was failed, i.e. less than, greater than etc.
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
 *     name: canceled_at
 *     style: form
 *     explode: false
 *     description: Date comparison for when resulting collections was canceled, i.e. less than, greater than etc.
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
 *   - (query) order {string} Field used to order retrieved batch jobs
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each order of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each order of the result.
 *   - in: query
 *     name: created_at
 *     style: form
 *     explode: false
 *     description: Date comparison for when resulting collections was created, i.e. less than, greater than etc.
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
 *     style: form
 *     explode: false
 *     description: Date comparison for when resulting collections was updated, i.e. less than, greater than etc.
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
 *   - Batch Job
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            batch_jobs:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/batch_job"
 *            count:
 *               type: integer
 *               description: The total number of items available
 *            offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *            limit:
 *               type: integer
 *               description: The number of items per page
 */
export default async (req: Request, res) => {
  const batchService: BatchJobService = req.scope.resolve("batchJobService")

  const created_by = req.user?.id || req.user?.userId

  const [jobs, count] = await batchService.listAndCount(
    pickBy(
      { created_by, ...(req.filterableFields ?? {}) },
      (val) => typeof val !== "undefined"
    ),
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery
  res.status(200).json({
    batch_jobs: jobs,
    count,
    offset,
    limit,
  })
}

export class AdminGetBatchPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string

  @IsString()
  @IsOptional()
  order?: string
}

export class AdminGetBatchParams extends AdminGetBatchPaginationParams {
  @IsOptional()
  @IsArray()
  @IsType([String, [String]])
  id?: string | string[]

  @IsArray()
  @IsOptional()
  type?: string[]

  @IsOptional()
  @Transform(({ value }) => (value === "null" ? null : value))
  @Type(() => DateComparisonOperator)
  confirmed_at?: DateComparisonOperator | null

  @IsOptional()
  @Transform(({ value }) => (value === "null" ? null : value))
  @Type(() => DateComparisonOperator)
  pre_processed_at?: DateComparisonOperator | null

  @IsOptional()
  @Transform(({ value }) => (value === "null" ? null : value))
  @Type(() => DateComparisonOperator)
  completed_at?: DateComparisonOperator | null

  @IsOptional()
  @Transform(({ value }) => (value === "null" ? null : value))
  @Type(() => DateComparisonOperator)
  failed_at?: DateComparisonOperator | null

  @IsOptional()
  @Transform(({ value }) => (value === "null" ? null : value))
  @Type(() => DateComparisonOperator)
  canceled_at?: DateComparisonOperator | null

  @IsType([DateComparisonOperator])
  @IsOptional()
  created_at?: DateComparisonOperator

  @IsOptional()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator
}
