import { CartService } from "../../../../services"
import { EntityManager } from "typeorm"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /store/carts/{id}/payment-sessions/{provider_id}/refresh
 * operationId: PostCartsCartPaymentSessionsSession
 * summary: Refresh a Payment Session
 * description: "Refresh a Payment Session to ensure that it is in sync with the Cart. This is usually not necessary, but is provided for edge cases."
 * parameters:
 *   - (path) id=* {string} The ID of the Cart.
 *   - (path) provider_id=* {string} The ID of the Payment Provider that created the Payment Session to be refreshed.
 * x-codegen:
 *   method: refreshPaymentSession
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.refreshPaymentSession(cartId, "manual")
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST 'https://medusa-url.com/store/carts/{id}/payment-sessions/{provider_id}/refresh'
 * tags:
 *   - Carts
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCartsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
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
  const { id, provider_id } = req.params

  const cartService: CartService = req.scope.resolve("cartService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await cartService
      .withTransaction(transactionManager)
      .refreshPaymentSession(id, provider_id)
  })
  const data = await cartService.retrieveWithTotals(id, {
    relations: [
      "region",
      "region.countries",
      "region.payment_providers",
      "shipping_methods",
      "payment_sessions",
      "shipping_methods.shipping_option",
    ],
  })

  res.status(200).json({ cart: cleanResponseData(data, []) })
}
