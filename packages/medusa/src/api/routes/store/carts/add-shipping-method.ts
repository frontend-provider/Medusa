import { IsOptional, IsString } from "class-validator"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."

import { CartService } from "../../../../services"
import { EntityManager } from "typeorm"
import { decorateLineItemsWithTotals } from "./decorate-line-items-with-totals"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /carts/{id}/shipping-methods
 * operationId: "PostCartsCartShippingMethod"
 * description: "Adds a Shipping Method to the Cart."
 * summary: "Add a Shipping Method"
 * tags:
 *   - Cart
 * parameters:
 *   - (path) id=* {string} The cart ID.
 *   - (body) option_id=* {string} ID of the shipping option to create the method from
 *   - (body) data {Object} Used to hold any data that the shipping method may need to process the fulfillment of the order. Look at the documentation for your installed fulfillment providers to find out what to send.
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            cart:
 *              $ref: "#/components/schemas/cart"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(
    StorePostCartsCartShippingMethodReq,
    req.body
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const cartService: CartService = req.scope.resolve("cartService")

  await manager.transaction(async (m) => {
    const txCartService = cartService.withTransaction(m)

    await txCartService.addShippingMethod(
      id,
      validated.option_id,
      validated.data
    )

    const updated = await txCartService.retrieve(id, {
      relations: ["payment_sessions"],
    })

    if (updated.payment_sessions?.length) {
      await txCartService.setPaymentSessions(id)
    }
  })

  const updatedCart = await cartService.retrieve(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  const data = await decorateLineItemsWithTotals(updatedCart, req)

  res.status(200).json({ cart: data })
}

export class StorePostCartsCartShippingMethodReq {
  @IsString()
  option_id: string

  @IsOptional()
  data?: Record<string, any> = {}
}
