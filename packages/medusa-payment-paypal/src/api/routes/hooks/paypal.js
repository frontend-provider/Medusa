export default async (req, res) => {
  const auth_algo = req.headers["paypal-auth-algo"]
  const cert_url = req.headers["paypal-cert-url"]
  const transmission_id = req.headers["paypal-transmission-id"]
  const transmission_sig = req.headers["paypal-transmission-sig"]
  const transmission_time = req.headers["paypal-transmission-time"]

  const paypalService = req.scope.resolve("paypalProviderService")

  try {
    await paypalService.verifyWebhook({
      auth_algo,
      cert_url,
      transmission_id,
      transmission_sig,
      transmission_time,
      webhook_event: req.body,
    })
  } catch (err) {
    res.sendStatus(401)
    return
  }

  try {
    const body = req.body
    const authId = body.resource.id
    const auth = await paypalService.retrieveAuthorization(authId)

    const order = await paypalService.retrieveOrderFromAuth(auth)

    const purchaseUnit = order.purchase_units[0]
    const cartId = purchaseUnit.custom_id

    if (!cartId) {
      res.sendStatus(200)
      return
    }

    const manager = req.scope.resolve("manager")
    const cartService = req.scope.resolve("cartService")
    const swapService = req.scope.resolve("swapService")
    const orderService = req.scope.resolve("orderService")

    await manager.transaction(async (m) => {
      const cart = await cartService.withTransaction(m).retrieve(cartId)

      switch (cart.type) {
        case "swap": {
          const swap = await swapService
            .withTransaction(m)
            .retrieveByCartId(cartId)
            .catch((_) => undefined)

          if (swap && swap.confirmed_at === null) {
            await cartService
              .withTransaction(m)
              .setPaymentSession(cartId, "paypal")
            await cartService.withTransaction(m).authorizePayment(cartId)
            await swapService.withTransaction(m).registerCartCompletion(swap.id)
          }
          break
        }

        default: {
          const order = await orderService
            .withTransaction(m)
            .retrieveByCartId(cartId)
            .catch((_) => undefined)

          if (!order) {
            await cartService
              .withTransaction(m)
              .setPaymentSession(cartId, "paypal")
            await cartService.withTransaction(m).authorizePayment(cartId)
            await orderService.withTransaction(m).createFromCart(cartId)
          }
          break
        }
      }
    })

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(409)
  }
}
