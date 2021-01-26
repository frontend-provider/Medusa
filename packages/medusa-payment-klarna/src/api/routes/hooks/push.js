import { MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { klarna_order_id } = req.query

  try {
    const orderService = req.scope.resolve("orderService")
    const klarnaProviderService = req.scope.resolve("pp_klarna")

    const klarnaOrder = await klarnaProviderService.retrieveCompletedOrder(
      klarna_order_id
    )

    const cartId = klarnaOrder.merchant_data
    const order = await orderService.retrieveByCartId(cartId)

    await klarnaProviderService.acknowledgeOrder(klarnaOrder.order_id, order.id)

    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    throw error
  }
}
