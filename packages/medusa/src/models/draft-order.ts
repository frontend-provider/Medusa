import {
  BeforeInsert,
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  OneToOne,
} from "typeorm"
import {
  DbAwareColumn,
  resolveDbGenerationStrategy,
  resolveDbType,
} from "../utils/db-aware-column"

import { BaseEntity } from "../interfaces/models/base-entity"
import { Cart } from "./cart"
import { Order } from "./order"
import { generateEntityId } from "../utils/generate-entity-id"
import { manualAutoIncrement } from "../utils/manual-auto-increment"

export enum DraftOrderStatus {
  OPEN = "open",
  COMPLETED = "completed",
}

@Entity()
export class DraftOrder extends BaseEntity {
  @DbAwareColumn({ type: "enum", enum: DraftOrderStatus, default: "open" })
  status: DraftOrderStatus

  @Index()
  @Column()
  @Generated(resolveDbGenerationStrategy("increment"))
  display_id: number

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @OneToOne(() => Cart, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @Index()
  @Column({ nullable: true })
  order_id: string

  @OneToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column({ nullable: true, type: resolveDbType("timestamptz") })
  canceled_at: Date

  @Column({ type: resolveDbType("timestamptz"), nullable: true })
  completed_at: Date

  @Column({ nullable: true })
  no_notification_order: boolean

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private async beforeInsert(): Promise<void> {
    this.id = generateEntityId(this.id, "dorder")

    if (process.env.NODE_ENV === "development" && !this.display_id) {
      const disId = await manualAutoIncrement("draft_order")

      if (disId) {
        this.display_id = disId
      }
    }
  }
}

/**
 * @schema draft-order
 * title: "DraftOrder"
 * description: "Represents a draft order"
 * x-resourceId: draft-order
 * properties:
 *   id:
 *     type: string
 *     description: The draft order's ID
 *     example: dorder_01G8TJFKBG38YYFQ035MSVG03C
 *   status:
 *     type: string
 *     description: The status of the draft order
 *     enum:
 *       - open
 *       - completed
 *     default: open
 *   display_id:
 *     type: string
 *     description: The draft order's display ID
 *     example: 2
 *   cart_id:
 *     type: string
 *     description: "The ID of the cart associated with the draft order."
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: A cart object. Available if the relation `cart` is expanded.
 *     type: object
 *   order_id:
 *     type: string
 *     description: "The ID of the order associated with the draft order."
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   order:
 *     description: An order object. Available if the relation `order` is expanded.
 *     type: object
 *   canceled_at:
 *     type: string
 *     description: The date the draft order was canceled at.
 *     format: date-time
 *   completed_at:
 *     type: string
 *     description: The date the draft order was completed at.
 *     format: date-time
 *   no_notification_order:
 *     type: boolean
 *     description: Whether to send the customer notifications regarding order updates.
 *     example: false
 *   idempotency_key:
 *     type: string
 *     description: Randomly generated key used to continue the completion of the cart associated with the draft order in case of failure.
 *     externalDocs:
 *       url: https://docs.medusajs.com/advanced/backend/payment/overview#idempotency-key
 *       description: Learn more how to use the idempotency key.
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
