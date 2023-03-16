import { ArrayNotEmpty, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

import ProductCollectionService from "../../../../services/product-collection"
import { defaultAdminCollectionsRelations } from "./index"

/**
 * @oas [post] /admin/collections/{id}/products/batch
 * operationId: "PostProductsToCollection"
 * summary: "Update Products"
 * description: "Updates products associated with a Product Collection"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Collection.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostProductsToCollectionReq"
 * x-codegen:
 *   method: addProducts
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/collections/{id}/products/batch' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "product_ids": [
 *               "prod_01G1G5V2MBA328390B5AXJ610F"
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Collections
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminCollectionsRes"
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
export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminPostProductsToCollectionReq
  }

  const productCollectionService: ProductCollectionService = req.scope.resolve(
    "productCollectionService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const updated = await manager.transaction(async (transactionManager) => {
    return await productCollectionService
      .withTransaction(transactionManager)
      .addProducts(id, validatedBody.product_ids)
  })

  const collection = await productCollectionService.retrieve(updated.id, {
    relations: defaultAdminCollectionsRelations,
  })

  res.status(200).json({ collection })
}

/**
 * @schema AdminPostProductsToCollectionReq
 * type: object
 * required:
 *   - product_ids
 * properties:
 *   product_ids:
 *     description: "An array of Product IDs to add to the Product Collection."
 *     type: array
 *     items:
 *       description: "The ID of a Product to add to the Product Collection."
 *       type: string
 */
export class AdminPostProductsToCollectionReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  product_ids: string[]
}
