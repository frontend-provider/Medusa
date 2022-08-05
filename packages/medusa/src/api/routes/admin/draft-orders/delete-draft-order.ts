import { DraftOrderService } from "../../../../services"
import { EntityManager } from "typeorm"
/**
 * @oas [delete] /draft-orders/{id}
 * operationId: DeleteDraftOrdersDraftOrder
 * summary: Delete a Draft Order
 * description: "Deletes a Draft Order"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Draft Order.
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted Draft Order.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: draft-order
 *             deleted:
 *               type: boolean
 *               description: Whether the draft order was deleted successfully or not.
 *               default: true
 */
export default async (req, res) => {
  const { id } = req.params

  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await draftOrderService
      .withTransaction(transactionManager)
      .delete(id)
  })

  res.json({
    id,
    object: "draft-order",
    deleted: true,
  })
}
