import { defaultAdminGiftCardFields, defaultAdminGiftCardRelations } from "./"

/**
 * @oas [get] /gift-cards/{id}
 * operationId: "GetGiftCardsGiftCard"
 * summary: "Get a Gift Card"
 * description: "Retrieves a Gift Card."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Gift Card.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.giftCards.retrieve(gift_card_id)
 *       .then(({ gift_card }) => {
 *         console.log(gift_card.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/gift-cards/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Gift Card
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             gift_card:
 *               $ref: "#/components/schemas/gift_card"
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
  const { id } = req.params

  const giftCardService = req.scope.resolve("giftCardService")
  const giftCard = await giftCardService.retrieve(id, {
    select: defaultAdminGiftCardFields,
    relations: defaultAdminGiftCardRelations,
  })

  res.status(200).json({ gift_card: giftCard })
}
