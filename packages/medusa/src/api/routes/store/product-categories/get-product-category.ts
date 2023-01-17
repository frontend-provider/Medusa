import { Request, Response } from "express"

import ProductCategoryService from "../../../../services/product-category"
import { FindParams } from "../../../../types/common"
import { transformTreeNodesWithConfig } from "../../../../utils/transformers/tree"
import { defaultStoreScope } from "."

/**
 * @oas [get] /product-categories/{id}
 * operationId: "GetProductCategoriesCategory"
 * summary: "Get a Product Category"
 * description: "Retrieves a Product Category."
 * x-authenticated: false
 * parameters:
 *   - (path) id=* {string} The ID of the Product Category
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each product category.
 *   - (query) fields {string} (Comma separated) Which fields should be retrieved in each product category.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.productCategories.retrieve("pcat-id")
 *       .then(({ productCategory }) => {
 *         console.log(productCategory.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/product-categories/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Category
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/StoreGetProductCategoryRes"
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
  const { retrieveConfig } = req

  const productCategoryService: ProductCategoryService = req.scope.resolve(
    "productCategoryService"
  )

  const productCategory = await productCategoryService.retrieve(
    id,
    retrieveConfig,
    defaultStoreScope
  )

  res.status(200).json({
    // TODO: When we implement custom queries for tree paths in medusa, remove the transformer
    // Adding this here since typeorm tree repo doesn't allow configs to be passed
    // onto its children nodes. As an alternative, we are transforming the data post query.
    product_category: transformTreeNodesWithConfig(
      productCategory,
      retrieveConfig,
      defaultStoreScope
    ),
  })
}

export class StoreGetProductCategoryParams extends FindParams {}
