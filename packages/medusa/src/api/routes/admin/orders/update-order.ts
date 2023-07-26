import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"

import { AddressPayload, FindParams } from "../../../../types/common"
import { EntityManager } from "typeorm"
import { OrderService } from "../../../../services"
import { Type } from "class-transformer"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /admin/orders/{id}
 * operationId: "PostOrdersOrder"
 * summary: "Update an Order"
 * description: "Update and order's details."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned order.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrdersOrderReq"
 * x-codegen:
 *   method: update
 *   params: AdminPostOrdersOrderParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.update(orderId, {
 *         email: "user@example.com"
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST 'https://medusa-url.com/admin/orders/adasda' \
 *       -H 'Authorization: Bearer {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Orders
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrdersRes"
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

  const orderService: OrderService = req.scope.resolve("orderService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await orderService
      .withTransaction(transactionManager)
      .update(id, req.validatedBody)
  })

  const order = await orderService.retrieveWithTotals(id, req.retrieveConfig, {
    includes: req.includes,
  })

  res.status(200).json({ order: cleanResponseData(order, []) })
}

/**
 * @schema AdminPostOrdersOrderReq
 * type: object
 * properties:
 *   email:
 *     description: the email associated with the order
 *     type: string
 *   billing_address:
 *     description: The order's billing address
 *     $ref: "#/components/schemas/AddressPayload"
 *   shipping_address:
 *     description: The order's shipping address
 *     $ref: "#/components/schemas/AddressPayload"
 *   items:
 *     description: The line items of the order
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/LineItem"
 *   region:
 *     description: ID of the region that the order is associated with.
 *     type: string
 *   discounts:
 *     description: The discounts applied to the order
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Discount"
 *   customer_id:
 *     description: The ID of the customer associated with the order.
 *     type: string
 *   payment_method:
 *     description: The payment method chosen for the order.
 *     type: object
 *     properties:
 *       provider_id:
 *         type: string
 *         description: The ID of the payment provider.
 *       data:
 *         description: Any data relevant for the given payment method.
 *         type: object
 *   shipping_method:
 *     description: The Shipping Method used for shipping the order.
 *     type: object
 *     properties:
 *       provider_id:
 *         type: string
 *         description: The ID of the shipping provider.
 *       profile_id:
 *         type: string
 *         description: The ID of the shipping profile.
 *       price:
 *         type: integer
 *         description: The price of the shipping.
 *       data:
 *         type: object
 *         description: Any data relevant to the specific shipping method.
 *       items:
 *         type: array
 *         items:
 *           $ref: "#/components/schemas/LineItem"
 *         description: Items to ship
 *   no_notification:
 *     description: If set to `true`, no notification will be sent to the customer related to this order.
 *     type: boolean
 */
export class AdminPostOrdersOrderReq {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressPayload)
  billing_address?: AddressPayload

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressPayload)
  shipping_address?: AddressPayload

  @IsArray()
  @IsOptional()
  items?: Record<string, unknown>[]

  @IsString()
  @IsOptional()
  region?: string

  @IsArray()
  @IsOptional()
  discounts?: Record<string, unknown>[]

  @IsString()
  @IsOptional()
  customer_id?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentMethod)
  payment_method?: PaymentMethod

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ShippingMethod)
  shipping_method?: ShippingMethod[]

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean
}

class PaymentMethod {
  @IsString()
  @IsOptional()
  provider_id?: string

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>
}

class ShippingMethod {
  @IsString()
  @IsOptional()
  provider_id?: string

  @IsString()
  @IsOptional()
  profile_id?: string

  @IsInt()
  @IsOptional()
  price?: number

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>

  @IsArray()
  @IsOptional()
  items?: Record<string, unknown>[]
}

export class AdminPostOrdersOrderParams extends FindParams {}
