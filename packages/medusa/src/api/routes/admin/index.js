import { Router } from "express"
import cors from "cors"

import middlewares from "../../middlewares"
import authRoutes from "./auth"
import productRoutes from "./products"
import userRoutes from "./users"
import regionRoutes from "./regions"
import shippingOptionRoutes from "./shipping-options"
import shippingProfileRoutes from "./shipping-profiles"
import discountRoutes from "./discounts"
import giftCardRoutes from "./gift-cards"
import orderRoutes from "./orders"
import returnReasonRoutes from "./return-reasons"
import storeRoutes from "./store"
import uploadRoutes from "./uploads"
import customerRoutes from "./customers"
import appRoutes from "./apps"
import swapRoutes from "./swaps"
import returnRoutes from "./returns"
import variantRoutes from "./variants"
import draftOrderRoutes from "./draft-orders"
import collectionRoutes from "./collections"
import notificationRoutes from "./notifications"

const route = Router()

export default (app, container, config) => {
  app.use("/admin", route)

  const adminCors = config.admin_cors || ""
  route.use(
    cors({
      origin: adminCors.split(","),
      credentials: true,
    })
  )

  // Unauthenticated routes
  authRoutes(route)

  const middlewareService = container.resolve("middlewareService")
  // Calls all middleware that has been registered to run before authentication.
  middlewareService.usePreAuthentication(app)

  // Authenticated routes
  route.use(middlewares.authenticate())

  // Calls all middleware that has been registered to run after authentication.
  middlewareService.usePostAuthentication(app)

  appRoutes(route)
  productRoutes(route)
  userRoutes(route)
  regionRoutes(route)
  shippingOptionRoutes(route)
  shippingProfileRoutes(route)
  discountRoutes(route)
  giftCardRoutes(route)
  orderRoutes(route)
  storeRoutes(route)
  uploadRoutes(route)
  customerRoutes(route)
  swapRoutes(route)
  returnRoutes(route)
  variantRoutes(route)
  draftOrderRoutes(route)
  collectionRoutes(route)
  notificationRoutes(route)
  returnReasonRoutes(route)

  return app
}
