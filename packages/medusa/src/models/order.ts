import {
  BeforeInsert,
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"
import { FeatureFlagColumn, FeatureFlagDecorators, } from "../utils/feature-flag-decorators"

import { BaseEntity } from "../interfaces/models/base-entity"
import { generateEntityId } from "../utils/generate-entity-id"
import { manualAutoIncrement } from "../utils/manual-auto-increment"
import { Address } from "./address"
import { Cart } from "./cart"
import { ClaimOrder } from "./claim-order"
import { Currency } from "./currency"
import { Customer } from "./customer"
import { Discount } from "./discount"
import { DraftOrder } from "./draft-order"
import { Fulfillment } from "./fulfillment"
import { GiftCard } from "./gift-card"
import { GiftCardTransaction } from "./gift-card-transaction"
import { LineItem } from "./line-item"
import { OrderEdit } from "./order-edit"
import { Payment } from "./payment"
import { Refund } from "./refund"
import { Region } from "./region"
import { Return } from "./return"
import { SalesChannel } from "./sales-channel"
import { ShippingMethod } from "./shipping-method"
import { Swap } from "./swap"

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  ARCHIVED = "archived",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

export enum FulfillmentStatus {
  NOT_FULFILLED = "not_fulfilled",
  PARTIALLY_FULFILLED = "partially_fulfilled",
  FULFILLED = "fulfilled",
  PARTIALLY_SHIPPED = "partially_shipped",
  SHIPPED = "shipped",
  PARTIALLY_RETURNED = "partially_returned",
  RETURNED = "returned",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

export enum PaymentStatus {
  NOT_PAID = "not_paid",
  AWAITING = "awaiting",
  CAPTURED = "captured",
  PARTIALLY_REFUNDED = "partially_refunded",
  REFUNDED = "refunded",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

@Entity()
export class Order extends BaseEntity {
  readonly object = "order"

  @DbAwareColumn({ type: "enum", enum: OrderStatus, default: "pending" })
  status: OrderStatus

  @DbAwareColumn({
    type: "enum",
    enum: FulfillmentStatus,
    default: "not_fulfilled",
  })
  fulfillment_status: FulfillmentStatus

  @DbAwareColumn({ type: "enum", enum: PaymentStatus, default: "not_paid" })
  payment_status: PaymentStatus

  @Index()
  @Column()
  @Generated("increment")
  display_id: number

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column()
  customer_id: string

  @ManyToOne(() => Customer, { cascade: ["insert"] })
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column()
  email: string

  @Index()
  @Column({ nullable: true })
  billing_address_id: string

  @ManyToOne(() => Address, { cascade: ["insert"] })
  @JoinColumn({ name: "billing_address_id" })
  billing_address: Address

  @Index()
  @Column({ nullable: true })
  shipping_address_id: string

  @ManyToOne(() => Address, { cascade: ["insert"] })
  @JoinColumn({ name: "shipping_address_id" })
  shipping_address: Address

  @Index()
  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @Index()
  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency: Currency

  @Column({ type: "real", nullable: true })
  tax_rate: number | null

  @ManyToMany(() => Discount, { cascade: ["insert"] })
  @JoinTable({
    name: "order_discounts",
    joinColumn: {
      name: "order_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "discount_id",
      referencedColumnName: "id",
    },
  })
  discounts: Discount[]

  @ManyToMany(() => GiftCard, { cascade: ["insert"] })
  @JoinTable({
    name: "order_gift_cards",
    joinColumn: {
      name: "order_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "gift_card_id",
      referencedColumnName: "id",
    },
  })
  gift_cards: GiftCard[]

  @OneToMany(() => ShippingMethod, (method) => method.order, {
    cascade: ["insert"],
  })
  shipping_methods: ShippingMethod[]

  @OneToMany(() => Payment, (payment) => payment.order, { cascade: ["insert"] })
  payments: Payment[]

  @OneToMany(() => Fulfillment, (fulfillment) => fulfillment.order, {
    cascade: ["insert"],
  })
  fulfillments: Fulfillment[]

  @OneToMany(() => Return, (ret) => ret.order, { cascade: ["insert"] })
  returns: Return[]

  @OneToMany(() => ClaimOrder, (co) => co.order, { cascade: ["insert"] })
  claims: ClaimOrder[]

  @OneToMany(() => Refund, (ref) => ref.order, { cascade: ["insert"] })
  refunds: Refund[]

  @OneToMany(() => Swap, (swap) => swap.order, { cascade: ["insert"] })
  swaps: Swap[]

  @Column({ nullable: true })
  draft_order_id: string

  @OneToOne(() => DraftOrder)
  @JoinColumn({ name: "draft_order_id" })
  draft_order: DraftOrder

  @OneToMany(() => OrderEdit, (oe) => oe.order)
  edits: OrderEdit[]

  @OneToMany(() => LineItem, (lineItem) => lineItem.order, {
    cascade: ["insert"],
  })
  items: LineItem[]

  @OneToMany(() => GiftCardTransaction, (gc) => gc.order)
  gift_card_transactions: GiftCardTransaction[]

  @Column({ nullable: true, type: resolveDbType("timestamptz") })
  canceled_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @Column({ type: "boolean", nullable: true })
  no_notification: boolean

  @Column({ nullable: true })
  idempotency_key: string

  @Column({ type: "varchar", nullable: true })
  external_id: string | null

  @FeatureFlagColumn("sales_channels", { type: "varchar", nullable: true })
  sales_channel_id: string | null

  @FeatureFlagDecorators("sales_channels", [
    ManyToOne(() => SalesChannel),
    JoinColumn({ name: "sales_channel_id" }),
  ])
  sales_channel: SalesChannel

  // Total fields
  shipping_total: number
  discount_total: number
  raw_discount_total: number
  tax_total: number | null
  refunded_total: number
  total: number
  subtotal: number
  paid_total: number
  refundable_amount: number
  gift_card_total: number
  gift_card_tax_total: number

  returnable_items?: LineItem[]

  @BeforeInsert()
  private async beforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "order")

    if (process.env.NODE_ENV === "development" && !this.display_id) {
      const disId = await manualAutoIncrement("order")

      if (disId) {
        this.display_id = disId
      }
    }
  }
}

/**
 * @schema Order
 * title: "Order"
 * description: "An order is a purchase made by a customer. It holds details about payment and fulfillment of the order. An order may also be created from a draft order, which is created by an admin user."
 * type: object
 * required:
 *   - billing_address_id
 *   - canceled_at
 *   - cart_id
 *   - created_at
 *   - currency_code
 *   - customer_id
 *   - draft_order_id
 *   - display_id
 *   - email
 *   - external_id
 *   - fulfillment_status
 *   - id
 *   - idempotency_key
 *   - metadata
 *   - no_notification
 *   - object
 *   - payment_status
 *   - region_id
 *   - shipping_address_id
 *   - status
 *   - tax_rate
 *   - updated_at
 * properties:
 *   id:
 *     description: The order's ID
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   status:
 *     description: The order's status
 *     type: string
 *     enum:
 *       - pending
 *       - completed
 *       - archived
 *       - canceled
 *       - requires_action
 *     default: pending
 *   fulfillment_status:
 *     description: The order's fulfillment status
 *     type: string
 *     enum:
 *       - not_fulfilled
 *       - partially_fulfilled
 *       - fulfilled
 *       - partially_shipped
 *       - shipped
 *       - partially_returned
 *       - returned
 *       - canceled
 *       - requires_action
 *     default: not_fulfilled
 *   payment_status:
 *     description: The order's payment status
 *     type: string
 *     enum:
 *       - not_paid
 *       - awaiting
 *       - captured
 *       - partially_refunded
 *       - refunded
 *       - canceled
 *       - requires_action
 *     default: not_paid
 *   display_id:
 *     description: The order's display ID
 *     type: integer
 *     example: 2
 *   cart_id:
 *     description: The ID of the cart associated with the order
 *     nullable: true
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: The details of the cart associated with the order.
 *     x-expandable: "cart"
 *     nullable: true
 *     $ref: "#/components/schemas/Cart"
 *   customer_id:
 *     description: The ID of the customer associated with the order
 *     type: string
 *     example: cus_01G2SG30J8C85S4A5CHM2S1NS2
 *   customer:
 *     description: The details of the customer associated with the order.
 *     x-expandable: "customer"
 *     nullable: true
 *     $ref: "#/components/schemas/Customer"
 *   email:
 *     description: The email associated with the order
 *     type: string
 *     format: email
 *   billing_address_id:
 *     description: The ID of the billing address associated with the order
 *     nullable: true
 *     type: string
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   billing_address:
 *     description: The details of the billing address associated with the order.
 *     x-expandable: "billing_address"
 *     nullable: true
 *     $ref: "#/components/schemas/Address"
 *   shipping_address_id:
 *     description: The ID of the shipping address associated with the order
 *     nullable: true
 *     type: string
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   shipping_address:
 *     description: The details of the shipping address associated with the order.
 *     x-expandable: "shipping_address"
 *     nullable: true
 *     $ref: "#/components/schemas/Address"
 *   region_id:
 *     description: The ID of the region this order was created in.
 *     type: string
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: The details of the region this order was created in.
 *     x-expandable: "region"
 *     nullable: true
 *     $ref: "#/components/schemas/Region"
 *   currency_code:
 *     description: The 3 character currency code that is used in the order
 *     type: string
 *     example: usd
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *       description: See a list of codes.
 *   currency:
 *     description: The details of the currency used in the order.
 *     x-expandable: "currency"
 *     nullable: true
 *     $ref: "#/components/schemas/Currency"
 *   tax_rate:
 *     description: The order's tax rate
 *     nullable: true
 *     type: number
 *     example: 0
 *   discounts:
 *     description: The details of the discounts applied on the order.
 *     type: array
 *     x-expandable: "discounts"
 *     items:
 *       $ref: "#/components/schemas/Discount"
 *   gift_cards:
 *     description: The details of the gift card used in the order.
 *     type: array
 *     x-expandable: "gift_cards"
 *     items:
 *       $ref: "#/components/schemas/GiftCard"
 *   shipping_methods:
 *     description: The details of the shipping methods used in the order.
 *     type: array
 *     x-expandable: "shipping_methods"
 *     items:
 *       $ref: "#/components/schemas/ShippingMethod"
 *   payments:
 *     description: The details of the payments used in the order.
 *     type: array
 *     x-expandable: "payments"
 *     items:
 *       $ref: "#/components/schemas/Payment"
 *   fulfillments:
 *     description: The details of the fulfillments created for the order.
 *     type: array
 *     x-expandable: "fulfillments"
 *     items:
 *       $ref: "#/components/schemas/Fulfillment"
 *   returns:
 *     description: The details of the returns created for the order.
 *     type: array
 *     x-expandable: "returns"
 *     items:
 *       $ref: "#/components/schemas/Return"
 *   claims:
 *     description: The details of the claims created for the order.
 *     type: array
 *     x-expandable: "claims"
 *     items:
 *       $ref: "#/components/schemas/ClaimOrder"
 *   refunds:
 *     description: The details of the refunds created for the order.
 *     type: array
 *     x-expandable: "refunds"
 *     items:
 *       $ref: "#/components/schemas/Refund"
 *   swaps:
 *     description: The details of the swaps created for the order.
 *     type: array
 *     x-expandable: "swaps"
 *     items:
 *       $ref: "#/components/schemas/Swap"
 *   draft_order_id:
 *     description: The ID of the draft order this order was created from.
 *     nullable: true
 *     type: string
 *     example: null
 *   draft_order:
 *     description: The details of the draft order this order was created from.
 *     x-expandable: "draft_order"
 *     nullable: true
 *     $ref: "#/components/schemas/DraftOrder"
 *   items:
 *     description: The details of the line items that belong to the order.
 *     x-expandable: "items"
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/LineItem"
 *   edits:
 *     description: The details of the order edits done on the order.
 *     type: array
 *     x-expandable: "edits"
 *     items:
 *       $ref: "#/components/schemas/OrderEdit"
 *   gift_card_transactions:
 *     description: The gift card transactions made in the order.
 *     type: array
 *     x-expandable: "gift_card_transactions"
 *     items:
 *       $ref: "#/components/schemas/GiftCardTransaction"
 *   canceled_at:
 *     description: The date the order was canceled on.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   no_notification:
 *     description: Flag for describing whether or not notifications related to this should be send.
 *     nullable: true
 *     type: boolean
 *     example: false
 *   idempotency_key:
 *     description: Randomly generated key used to continue the processing of the order in case of failure.
 *     nullable: true
 *     type: string
 *     externalDocs:
 *       url: https://docs.medusajs.com/development/idempotency-key/overview.md
 *       description: Learn more how to use the idempotency key.
 *   external_id:
 *     description: The ID of an external order.
 *     nullable: true
 *     type: string
 *     example: null
 *   sales_channel_id:
 *     description: The ID of the sales channel this order belongs to.
 *     nullable: true
 *     type: string
 *     example: null
 *   sales_channel:
 *     description: The details of the sales channel this order belongs to.
 *     x-expandable: "sales_channel"
 *     nullable: true
 *     $ref: "#/components/schemas/SalesChannel"
 *   shipping_total:
 *     type: integer
 *     description: The total of shipping
 *     example: 1000
 *   raw_discount_total:
 *     description: The total of discount
 *     type: integer
 *     example: 800
 *   discount_total:
 *     description: The total of discount rounded
 *     type: integer
 *     example: 800
 *   tax_total:
 *     description: The total of tax
 *     type: integer
 *     example: 0
 *   refunded_total:
 *     description: The total amount refunded if the order is returned.
 *     type: integer
 *     example: 0
 *   total:
 *     description: The total amount of the order
 *     type: integer
 *     example: 8200
 *   subtotal:
 *     description: The subtotal of the order
 *     type: integer
 *     example: 8000
 *   paid_total:
 *     description: The total amount paid
 *     type: integer
 *     example: 8000
 *   refundable_amount:
 *     description: The amount that can be refunded
 *     type: integer
 *     example: 8200
 *   gift_card_total:
 *     description: The total of gift cards
 *     type: integer
 *     example: 0
 *   gift_card_tax_total:
 *     description: The total of gift cards with taxes
 *     type: integer
 *     example: 0
 *   returnable_items:
 *     description: The details of the line items that are returnable as part of the order, swaps, or claims
 *     type: array
 *     x-expandable: "returnable_items"
 *     items:
 *       $ref: "#/components/schemas/LineItem"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
