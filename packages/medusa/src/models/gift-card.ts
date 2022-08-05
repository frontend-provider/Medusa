import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { Order } from "./order"
import { Region } from "./region"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class GiftCard extends SoftDeletableEntity {
  @Index({ unique: true })
  @Column()
  code: string

  @Column("int")
  value: number

  @Column("int")
  balance: number

  @Index()
  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column({ default: false })
  is_disabled: boolean

  @Column({
    type: resolveDbType("timestamptz"),
    nullable: true,
  })
  ends_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "gift")
  }
}

/**
 * @schema gift_card
 * title: "Gift Card"
 * description: "Gift Cards are redeemable and represent a value that can be used towards the payment of an Order."
 * x-resourceId: gift_card
 * required:
 *   - code
 *   - value
 *   - balance
 *   - region_id
 * properties:
 *   id:
 *     type: string
 *     description: The cart's ID
 *     example: gift_01G8XKBPBQY2R7RBET4J7E0XQZ
 *   code:
 *     description: "The unique code that identifies the Gift Card. This is used by the Customer to redeem the value of the Gift Card."
 *     type: string
 *     example: 3RFT-MH2C-Y4YZ-XMN4
 *   value:
 *     description: "The value that the Gift Card represents."
 *     type: integer
 *     example: 10
 *   balance:
 *     description: "The remaining value on the Gift Card."
 *     type: integer
 *     example: 10
 *   region_id:
 *     type: string
 *     description: "The id of the Region in which the Gift Card is available."
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: A region object. Available if the relation `region` is expanded.
 *     type: object
 *   order_id:
 *     type: string
 *     description: "The id of the Order that the Gift Card was purchased in."
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: An order object. Available if the relation `order` is expanded.
 *     type: object
 *   is_disabled:
 *     description: "Whether the Gift Card has been disabled. Disabled Gift Cards cannot be applied to carts."
 *     type: boolean
 *     example: false
 *   ends_at:
 *     description: "The time at which the Gift Card can no longer be used."
 *     type: string
 *     format: date-time
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
