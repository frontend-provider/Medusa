import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from "typeorm"
import {
  FeatureFlagColumn,
  FeatureFlagDecorators,
} from "../utils/feature-flag-decorators"

import { BaseEntity } from "../interfaces/models/base-entity"
import { Currency } from "./currency"
import { DbAwareColumn } from "../utils/db-aware-column"
import { SalesChannel } from "./sales-channel"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class Store extends BaseEntity {
  @Column({ default: "Medusa Store" })
  name: string

  @Column({ default: "usd" })
  default_currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "default_currency_code", referencedColumnName: "code" })
  default_currency: Currency

  @ManyToMany(() => Currency)
  @JoinTable({
    name: "store_currencies",
    joinColumn: {
      name: "store_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "currency_code",
      referencedColumnName: "code",
    },
  })
  currencies: Currency[]

  @Column({ nullable: true, type: "text" })
  swap_link_template: string | null

  @Column({ nullable: true, type: "text" })
  payment_link_template: string | null

  @Column({ nullable: true, type: "text" })
  invite_link_template: string | null

  @Column({ nullable: true })
  default_location_id: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @FeatureFlagColumn("sales_channels", { nullable: true, type: "text" })
  default_sales_channel_id: string | null

  @FeatureFlagDecorators("sales_channels", [
    OneToOne(() => SalesChannel),
    JoinColumn({ name: "default_sales_channel_id" }),
  ])
  default_sales_channel: SalesChannel

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "store")
  }
}

/**
 * @schema Store
 * title: "Store"
 * description: "Holds settings for the Store, such as name, currencies, etc."
 * type: object
 * required:
 *   - created_at
 *   - default_currency_code
 *   - default_location_id
 *   - id
 *   - invite_link_template
 *   - metadata
 *   - name
 *   - payment_link_template
 *   - swap_link_template
 *   - updated_at
 * properties:
 *   id:
 *     description: The store's ID
 *     type: string
 *     example: store_01G1G5V21KADXNGH29BJMAJ4B4
 *   name:
 *     description: The name of the Store - this may be displayed to the Customer.
 *     type: string
 *     example: Medusa Store
 *   default_currency_code:
 *     description: The 3 character currency code that is the default of the store.
 *     type: string
 *     example: usd
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *       description: See a list of codes.
 *   default_currency:
 *     description: Available if the relation `default_currency` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Currency"
 *   currencies:
 *     description: The currencies that are enabled for the Store. Available if the relation `currencies` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Currency"
 *   swap_link_template:
 *     description: A template to generate Swap links from. Use {{cart_id}} to include the Swap's `cart_id` in the link.
 *     nullable: true
 *     type: string
 *     example: null
 *   payment_link_template:
 *     description: A template to generate Payment links from. Use {{cart_id}} to include the payment's `cart_id` in the link.
 *     nullable: true
 *     type: string
 *     example: null
 *   invite_link_template:
 *     description: A template to generate Invite links from
 *     nullable: true
 *     type: string
 *     example: null
 *   default_location_id:
 *     description: The location ID the store is associated with.
 *     nullable: true
 *     type: string
 *     example: null
 *   default_sales_channel_id:
 *     description: The sales channel ID the cart is associated with.
 *     nullable: true
 *     type: string
 *     example: null
 *   default_sales_channel:
 *     description: A sales channel object. Available if the relation `default_sales_channel` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/SalesChannel"
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
 */
