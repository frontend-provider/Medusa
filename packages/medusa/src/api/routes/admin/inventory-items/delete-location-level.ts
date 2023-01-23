import { Request, Response } from "express"
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { IInventoryService } from "../../../../interfaces"

/**
 * @oas [delete] /inventory-items/{id}/location-levels/{location_id}
 * operationId: "DeleteInventoryItemsInventoryIteLocationLevelsLocation"
 * summary: "Delete a location level of an Inventory Item."
 * description: "Delete a location level of an Inventory Item."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Inventory Item.
 *   - (path) location_id=* {string} The ID of the location.
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.inventoryItems.deleteLocationLevel(inventoryItemId, locationId)
 *       .then(({ inventory_item }) => {
 *         console.log(inventory_item.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/inventory-items/{id}/location-levels/{location_id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Inventory Items
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminInventoryItemsRes"
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
export default async (req: Request, res: Response) => {
  const { id, location_id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")
  const manager: EntityManager = req.scope.resolve("manager")

  const reservedQuantity = await inventoryService.retrieveReservedQuantity(id, [
    location_id,
  ])

  if (reservedQuantity > 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `Cannot remove Inventory Level ${id} at Location ${location_id} because there are reserved items.`
    )
  }

  await manager.transaction(async (transactionManager) => {
    await inventoryService
      .withTransaction(transactionManager)
      .deleteInventoryLevel(id, location_id)
  })

  const inventoryItem = await inventoryService.retrieveInventoryItem(
    id,
    req.retrieveConfig
  )

  res.status(200).json({ inventory_item: inventoryItem })
}
