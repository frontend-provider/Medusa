import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"
import _, { identity } from "lodash"

import { DateComparisonOperator } from "../../../../types/common"
import ProductCollectionService from "../../../../services/product-collection"
import { Type } from "class-transformer"

/**
 * @oas [get] /collections
 * operationId: "GetCollections"
 * summary: "List Product Collections"
 * description: "Retrieve a list of Product Collection."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=10 {integer} The number of collections to return.
 *   - (query) offset=0 {integer} The number of collections to skip before the results.
 *   - (query) title {string} The title of collections to return.
 *   - (query) handle {string} The handle of collections to return.
 *   - (query) q {string} a search term to search titles and handles.
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting collections were created.
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
 *     description: Date comparison for when resulting collections were updated.
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
 *     name: deleted_at
 *     description: Date comparison for when resulting collections were deleted.
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
 *   - Collection
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            collections:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product_collection"
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
export default async (req: Request, res: Response) => {
  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const {
    validatedQuery: { limit, offset },
    filterableFields,
    listConfig
  } = req

  const [collections, count] = await productCollectionService.listAndCount(
    _.pickBy(filterableFields, identity),
    listConfig
  )

  res.status(200).json({
    collections,
    count,
    offset,
    limit,
  })
}

export class AdminGetCollectionsPaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0
}

export class AdminGetCollectionsParams extends AdminGetCollectionsPaginationParams {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  handle?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator

  @IsString()
  @IsOptional()
  q?: string
}
