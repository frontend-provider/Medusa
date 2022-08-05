import { IsNumber, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"

import { ProductVariant } from "../../../../models"
import { ProductVariantService } from "../../../../services"
import { Type } from "class-transformer"
import { defaultAdminGetProductsVariantsFields } from "./index"
import { getRetrieveConfig } from "../../../../utils/get-query-config"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /products/{id}/variants
 * operationId: "GetProductsProductVariants"
 * summary: "List a Product's Product Variants"
 * description: "Retrieves a list of the Product Variants associated with a Product."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} ID of the product to search for the variants.
 *   - (query) fields {string} Comma separated string of the column to select.
 *   - (query) expand {string} Comma separated string of the relations to include.
 *   - (query) offset=0 {integer} How many items to skip before the results.
 *   - (query) limit=100 {integer} Limit the number of items returned.
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             variants:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product_variant"
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
  const { id } = req.params

  const { expand, fields, limit, offset } = await validator(
    AdminGetProductsVariantsParams,
    req.query
  )

  const queryConfig = getRetrieveConfig<ProductVariant>(
    defaultAdminGetProductsVariantsFields as (keyof ProductVariant)[],
    [],
    [
      ...new Set([
        ...defaultAdminGetProductsVariantsFields,
        ...(fields?.split(",") ?? []),
      ]),
    ] as (keyof ProductVariant)[],
    expand ? expand?.split(",") : undefined
  )

  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const [variants, count] = await productVariantService.listAndCount(
    {
      product_id: id,
    },
    {
      ...queryConfig,
      skip: offset,
      take: limit,
    }
  )

  res.json({
    count,
    variants,
    offset,
    limit,
  })
}

export class AdminGetProductsVariantsParams {
  @IsString()
  @IsOptional()
  fields?: string

  @IsString()
  @IsOptional()
  expand?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 100
}
