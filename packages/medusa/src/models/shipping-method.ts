import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm"

import { Cart } from "./cart"
import { ClaimOrder } from "./claim-order"
import { DbAwareColumn } from "../utils/db-aware-column"
import { Order } from "./order"
import { Return } from "./return"
import { ShippingMethodTaxLine } from "./shipping-method-tax-line"
import { ShippingOption } from "./shipping-option"
import { Swap } from "./swap"
import { generateEntityId } from "../utils/generate-entity-id"

@Check(
  `"claim_order_id" IS NOT NULL OR "order_id" IS NOT NULL OR "cart_id" IS NOT NULL OR "swap_id" IS NOT NULL OR "return_id" IS NOT NULL`
)
@Check(`"price" >= 0`)
@Entity()
export class ShippingMethod {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  shipping_option_id: string

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Index()
  @Column({ nullable: true })
  claim_order_id: string | null

  @ManyToOne(() => ClaimOrder)
  @JoinColumn({ name: "claim_order_id" })
  claim_order: ClaimOrder

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @ManyToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  swap_id: string

  @ManyToOne(() => Swap)
  @JoinColumn({ name: "swap_id" })
  swap: Swap

  @Index()
  @Column({ nullable: true })
  return_id: string

  @OneToOne(() => Return, (ret) => ret.shipping_method)
  @JoinColumn({ name: "return_id" })
  return_order: Return

  @ManyToOne(() => ShippingOption, { eager: true })
  @JoinColumn({ name: "shipping_option_id" })
  shipping_option: ShippingOption

  @OneToMany(() => ShippingMethodTaxLine, (tl) => tl.shipping_method, {
    cascade: ["insert"],
  })
  tax_lines: ShippingMethodTaxLine[]

  @Column({ type: "int" })
  price: number

  @DbAwareColumn({ type: "jsonb" })
  data: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sm")
  }
}

/**
 * @schema shipping_method
 * title: "Shipping Method"
 * description: "Shipping Methods represent a way in which an Order or Return can be shipped. Shipping Methods are built from a Shipping Option, but may contain additional details, that can be necessary for the Fulfillment Provider to handle the shipment."
 * x-resourceId: shipping_method
 * required:
 *   - shipping_option_id
 *   - price
 * properties:
 *   id:
 *     type: string
 *     description: The shipping method's ID
 *     example: sm_01F0YET7DR2E7CYVSDHM593QG2
 *   shipping_option_id:
 *     description: "The id of the Shipping Option that the Shipping Method is built from."
 *     type: string
 *     example: so_01G1G5V27GYX4QXNARRQCW1N8T
 *   shipping_option:
 *     description: Available if the relation `shipping_option` is expanded.
 *     $ref: "#/components/schemas/shipping_option"
 *   order_id:
 *     description: "The id of the Order that the Shipping Method is used on."
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: An order object. Available if the relation `order` is expanded.
 *     type: object
 *   return_id:
 *     description: "The id of the Return that the Shipping Method is used on."
 *     type: string
 *     example: null
 *   return_order:
 *     description: A return object. Available if the relation `return_order` is expanded.
 *     type: object
 *   swap_id:
 *     description: "The id of the Swap that the Shipping Method is used on."
 *     type: string
 *     example: null
 *   swap:
 *     description: A swap object. Available if the relation `swap` is expanded.
 *     type: object
 *   cart_id:
 *     description: "The id of the Cart that the Shipping Method is used on."
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: A cart object. Available if the relation `cart` is expanded.
 *     type: object
 *   claim_order_id:
 *     description: "The id of the Claim that the Shipping Method is used on."
 *     type: string
 *     example: null
 *   claim_order:
 *     description: A claim order object. Available if the relation `claim_order` is expanded.
 *     type: object
 *   tax_lines:
 *     type: array
 *     description: Available if the relation `tax_lines` is expanded.
 *     items:
 *       $ref: "#/components/schemas/tax_line"
 *   price:
 *     description: "The amount to charge for the Shipping Method. The currency of the price is defined by the Region that the Order that the Shipping Method belongs to is a part of."
 *     type: integer
 *     example: 200
 *   data:
 *     description: "Additional data that the Fulfillment Provider needs to fulfill the shipment. This is used in combination with the Shipping Options data, and may contain information such as a drop point id."
 *     type: object
 *     example: {}
 */
