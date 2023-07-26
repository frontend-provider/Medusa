import { StoreService } from "../../../../services"
import { EntityManager } from "typeorm"

/**
 * @oas [delete] /admin/store/currencies/{code}
 * operationId: "DeleteStoreCurrenciesCode"
 * summary: "Remove a Currency"
 * description: "Remove a Currency Code from the available currencies in a store. This does not completely delete the currency and it can be added again later to the store."
 * x-authenticated: true
 * parameters:
 *   - in: path
 *     name: code
 *     required: true
 *     description: The 3 character ISO currency code.
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *         description: See a list of codes.
 * x-codegen:
 *   method: deleteCurrency
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.store.deleteCurrency("eur")
 *       .then(({ store }) => {
 *         console.log(store.currencies);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE 'https://medusa-url.com/admin/store/currencies/{currency_code}' \
 *       -H 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Store
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminStoresRes"
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
export default async (req, res) => {
  const { currency_code } = req.params

  const storeService: StoreService = req.scope.resolve("storeService")
  const manager: EntityManager = req.scope.resolve("manager")
  const data = await manager.transaction(async (transactionManager) => {
    return await storeService
      .withTransaction(transactionManager)
      .removeCurrency(currency_code)
  })

  res.status(200).json({ store: data })
}
