import "reflect-metadata"
import { Router } from "express"

import { Cart, Order, Swap } from "../../../../"
import { FindParams } from "../../../../types/common"
import middlewares, {
  transformBody,
  transformStoreQuery,
} from "../../../middlewares"
import { StorePostCartsCartReq } from "./update-cart"
import { StorePostCartReq } from "./create-cart"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { extendRequestParams } from "../../../middlewares/publishable-api-key/extend-request-params"
import { validateSalesChannelParam } from "../../../middlewares/publishable-api-key/validate-sales-channel-param"
import { StorePostCartsCartShippingMethodReq } from "./add-shipping-method"
import { StorePostCartsCartPaymentSessionReq } from "./set-payment-session"
import { StorePostCartsCartLineItemsItemReq } from "./update-line-item"
import { StorePostCartsCartPaymentSessionUpdateReq } from "./update-payment-session"

const route = Router()

export default (app, container) => {
  const middlewareService = container.resolve("middlewareService")
  const featureFlagRouter = container.resolve("featureFlagRouter")

  app.use("/carts", route)

  if (featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)) {
    defaultStoreCartRelations.push("sales_channel")
  }

  // Inject plugin routes
  const routers = middlewareService.getRouters("store/carts")
  for (const router of routers) {
    route.use("/", router)
  }

  route.get(
    "/:id",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-cart").default)
  )

  const createMiddlewares = [
    middlewareService.usePreCartCreation(),
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    transformBody(StorePostCartReq),
    extendRequestParams,
    validateSalesChannelParam,
  ]

  route.post(
    "/",
    ...createMiddlewares,
    middlewares.wrap(require("./create-cart").default)
  )

  route.post(
    "/:id",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    transformBody(StorePostCartsCartReq),
    middlewares.wrap(require("./update-cart").default)
  )

  route.post(
    "/:id/complete",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    middlewares.wrap(require("./complete-cart").default)
  )

  // DEPRECATION
  route.post(
    "/:id/complete-cart",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    middlewares.wrap(require("./complete-cart").default)
  )

  // Line items
  route.post(
    "/:id/line-items",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    middlewares.wrap(require("./create-line-item").default)
  )
  route.post(
    "/:id/line-items/:line_id",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    transformBody(StorePostCartsCartLineItemsItemReq),
    middlewares.wrap(require("./update-line-item").default)
  )
  route.delete(
    "/:id/line-items/:line_id",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    middlewares.wrap(require("./delete-line-item").default)
  )

  route.delete(
    "/:id/discounts/:code",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    middlewares.wrap(require("./delete-discount").default)
  )

  // Payment sessions
  route.post(
    "/:id/payment-sessions",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    middlewares.wrap(require("./create-payment-sessions").default)
  )

  route.post(
    "/:id/payment-sessions/:provider_id",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    transformBody(StorePostCartsCartPaymentSessionUpdateReq),
    middlewares.wrap(require("./update-payment-session").default)
  )

  route.delete(
    "/:id/payment-sessions/:provider_id",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    middlewares.wrap(require("./delete-payment-session").default)
  )

  route.post(
    "/:id/payment-sessions/:provider_id/refresh",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    middlewares.wrap(require("./refresh-payment-session").default)
  )

  route.post(
    "/:id/payment-session",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    transformBody(StorePostCartsCartPaymentSessionReq),
    middlewares.wrap(require("./set-payment-session").default)
  )

  // Shipping Options
  route.post(
    "/:id/shipping-methods",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    transformBody(StorePostCartsCartShippingMethodReq),
    middlewares.wrap(require("./add-shipping-method").default)
  )

  // Taxes
  route.post(
    "/:id/taxes",
    transformStoreQuery(FindParams, {
      defaultRelations: defaultStoreCartRelations,
      defaultFields: defaultStoreCartFields,
      isList: false,
    }),
    middlewares.wrap(require("./calculate-taxes").default)
  )

  return app
}

export const defaultStoreCartFields: (keyof Cart)[] = []

export const defaultStoreCartRelations = [
  "gift_cards",
  "region",
  "items",
  "items.variant",
  "items.adjustments",
  "payment",
  "shipping_address",
  "billing_address",
  "region.countries",
  "region.payment_providers",
  "shipping_methods",
  "payment_sessions",
  "shipping_methods.shipping_option",
  "discounts",
  "discounts.rule",
]

/**
 * @schema StoreCartsRes
 * type: object
 * x-expanded-relations:
 *   field: cart
 *   relations:
 *     - billing_address
 *     - discounts
 *     - discounts.rule
 *     - gift_cards
 *     - items
 *     - items.adjustments
 *     - items.variant
 *     - payment
 *     - payment_sessions
 *     - region
 *     - region.countries
 *     - region.payment_providers
 *     - shipping_address
 *     - shipping_methods
 *   eager:
 *     - region.fulfillment_providers
 *     - region.payment_providers
 *     - shipping_methods.shipping_option
 *   implicit:
 *      - items
 *      - items.variant
 *      - items.variant.product
 *      - items.tax_lines
 *      - items.adjustments
 *      - gift_cards
 *      - discounts
 *      - discounts.rule
 *      - shipping_methods
 *      - shipping_methods.tax_lines
 *      - shipping_address
 *      - region
 *      - region.tax_rates
 *   totals:
 *     - discount_total
 *     - gift_card_tax_total
 *     - gift_card_total
 *     - item_tax_total
 *     - refundable_amount
 *     - refunded_total
 *     - shipping_tax_total
 *     - shipping_total
 *     - subtotal
 *     - tax_total
 *     - total
 *     - items.discount_total
 *     - items.gift_card_total
 *     - items.original_tax_total
 *     - items.original_total
 *     - items.refundable
 *     - items.subtotal
 *     - items.tax_total
 *     - items.total
 * required:
 *   - cart
 * properties:
 *   cart:
 *     $ref: "#/components/schemas/Cart"
 */
export type StoreCartsRes = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

/**
 * @schema StoreCompleteCartRes
 * type: object
 * required:
 *   - type
 *   - data
 * properties:
 *   type:
 *     type: string
 *     description: The type of the data property.
 *     enum: [order, cart, swap]
 *   data:
 *     type: object
 *     description: The data of the result object. Its type depends on the type field.
 *     oneOf:
 *       - type: object
 *         allOf:
 *           - description: Cart was successfully authorized and order was placed successfully.
 *           - $ref: "#/components/schemas/Order"
 *       - type: object
 *         allOf:
 *           - description: Cart was successfully authorized but requires further actions.
 *           - $ref: "#/components/schemas/Cart"
 *       - type: object
 *         allOf:
 *           - description: When cart is used for a swap and it has been completed successfully.
 *           - $ref: "#/components/schemas/Swap"
 */
export type StoreCompleteCartRes =
  | {
      type: "cart"
      data: Cart
    }
  | {
      type: "order"
      data: Order
    }
  | {
      type: "swap"
      data: Swap
    }

export * from "./add-shipping-method"
export * from "./create-cart"
export * from "./create-line-item"
export * from "./create-payment-sessions"
export * from "./set-payment-session"
export * from "./update-cart"
export * from "./update-line-item"
export * from "./update-payment-session"
