import { IsNumber, IsOptional, IsString } from "class-validator"

import { AdminListOrdersSelector } from "../../../../types/orders"
import { Order } from "../../../../models"
import { OrderService } from "../../../../services"
import { Type } from "class-transformer"
import { pick } from "lodash"

/**
 * @oas [get] /orders
 * operationId: "GetOrders"
 * summary: "List Orders"
 * description: "Retrieves a list of Orders"
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching orders by shipping address first name, orders' email, and orders' display ID
 *   - (query) id {string} ID of the order to search for.
 *   - in: query
 *     name: status
 *     style: form
 *     explode: false
 *     description: Status to search for
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [pending, completed, archived, canceled, requires_action]
 *   - in: query
 *     name: fulfillment_status
 *     style: form
 *     explode: false
 *     description: Fulfillment status to search for.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [not_fulfilled, fulfilled, partially_fulfilled, shipped, partially_shipped, canceled, returned, partially_returned, requires_action]
 *   - in: query
 *     name: payment_status
 *     style: form
 *     explode: false
 *     description: Payment status to search for.
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         enum: [captured, awaiting, not_paid, refunded, partially_refunded, canceled, requires_action]
 *   - (query) display_id {string} Display ID to search for.
 *   - (query) cart_id {string} to search for.
 *   - (query) customer_id {string} to search for.
 *   - (query) email {string} to search for.
 *   - in: query
 *     name: region_id
 *     style: form
 *     explode: false
 *     description: Regions to search orders by
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: ID of a Region.
 *         - type: array
 *           items:
 *             type: string
 *             description: ID of a Region.
 *   - in: query
 *     name: currency_code
 *     style: form
 *     explode: false
 *     description: Currency code to search for
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *         description: See a list of codes.
 *   - (query) tax_rate {string} to search for.
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting orders were created.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Date comparison for when resulting orders were updated.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: canceled_at
 *     description: Date comparison for when resulting orders were canceled.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: sales_channel_id
 *     style: form
 *     explode: false
 *     description: Filter by Sales Channels
 *     schema:
 *       type: array
 *       items:
 *         type: string
 *         description: The ID of a Sales Channel
 *   - (query) offset=0 {integer} How many orders to skip before the results.
 *   - (query) limit=50 {integer} Limit the number of orders returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each order of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each order of the result.
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             orders:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/order"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
 */
export default async (req, res) => {
  const orderService: OrderService = req.scope.resolve("orderService")

  const { skip, take, select, relations } = req.listConfig

  const [orders, count] = await orderService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  let data: Partial<Order>[] = orders

  const fields = [...select, ...relations]
  if (fields.length) {
    data = orders.map((o) => pick(o, fields))
  }

  res.json({ orders: data, count, offset: skip, limit: take })
}

export class AdminGetOrdersParams extends AdminListOrdersSelector {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 50

  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
