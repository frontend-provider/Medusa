import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { BaseEntity } from "../interfaces/models/base-entity"
import { Customer } from "./customer"
import { DbAwareColumn } from "../utils/db-aware-column"
import { NotificationProvider } from "./notification-provider"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class Notification extends BaseEntity {
  @Column({ nullable: true })
  event_name: string

  @Index()
  @Column()
  resource_type: string

  @Index()
  @Column()
  resource_id: string

  @Index()
  @Column({ nullable: true })
  customer_id: string | null

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column()
  to: string

  @DbAwareColumn({ type: "jsonb" })
  data: Record<string, unknown>

  @Column({ nullable: true })
  parent_id: string

  @ManyToOne(() => Notification)
  @JoinColumn({ name: "parent_id" })
  parent_notification: Notification

  @OneToMany(() => Notification, (noti) => noti.parent_notification)
  resends: Notification[]

  @Column({ nullable: true })
  provider_id: string

  @ManyToOne(() => NotificationProvider)
  @JoinColumn({ name: "provider_id" })
  provider: NotificationProvider

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "noti")
  }
}

/**
 * @schema notification
 * title: "Notification"
 * description: "Notifications a communications sent via Notification Providers as a reaction to internal events such as `order.placed`. Notifications can be used to show a chronological timeline for communications sent to a Customer regarding an Order, and enables resends."
 * x-resourceId: notification
 * required:
 *   - resource_type
 *   - resource_id
 *   - to
 * properties:
 *   id:
 *     type: string
 *     description: The notification's ID
 *     example: noti_01G53V9Y6CKMCGBM1P0X7C28RX
 *   event_name:
 *     description: "The name of the event that the notification was sent for."
 *     type: string
 *     example: order.placed
 *   resource_type:
 *     description: "The type of resource that the Notification refers to."
 *     type: string
 *     example: order
 *   resource_id:
 *     description: "The ID of the resource that the Notification refers to."
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   customer_id:
 *     description: "The ID of the Customer that the Notification was sent to."
 *     type: string
 *     example: cus_01G2SG30J8C85S4A5CHM2S1NS2
 *   customer:
 *     description: A customer object. Available if the relation `customer` is expanded.
 *     type: object
 *   to:
 *     description: "The address that the Notification was sent to. This will usually be an email address, but represent other addresses such as a chat bot user id"
 *     type: string
 *     example: "user@example.com"
 *   data:
 *     description: "The data that the Notification was sent with. This contains all the data necessary for the Notification Provider to initiate a resend."
 *     type: object
 *     example: {}
 *   resends:
 *     description: "The resends that have been completed after the original Notification."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/notification_resend"
 *   provider_id:
 *     description: "The id of the Notification Provider that handles the Notification."
 *     type: string
 *     example: sengrid
 *   provider:
 *     description: Available if the relation `provider` is expanded.
 *     $ref: "#/components/schemas/notification_provider"
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 */

/**
 * @schema notification_resend
 * title: "Notification Resend"
 * description: "A resend of a Notification."
 * x-resourceId: notification_resend
 * properties:
 *   id:
 *     description: The notification resend's ID
 *     type: string
 *     example: noti_01F0YET45G9NHP08Z66CE4QKBS
 *   event_name:
 *     description: "The name of the event that the notification was sent for."
 *     type: string
 *     example: order.placed
 *   resource_type:
 *     description: "The type of resource that the Notification refers to."
 *     type: string
 *     example: order
 *   resource_id:
 *     description: "The ID of the resource that the Notification refers to."
 *     type: string
 *     example: order_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   customer_id:
 *     description: "The ID of the Customer that the Notification was sent to."
 *     type: string
 *     example: cus_01G2SG30J8C85S4A5CHM2S1NS2
 *   customer:
 *     description: A customer object. Available if the relation `customer` is expanded.
 *     type: object
 *   to:
 *     description: "The address that the Notification was sent to. This will usually be an email address, but represent other addresses such as a chat bot user id"
 *     type: string
 *     example: "user@example.com"
 *   data:
 *     description: "The data that the Notification was sent with. This contains all the data necessary for the Notification Provider to initiate a resend."
 *     type: object
 *     example: {}
 *   parent_id:
 *     description: "The ID of the Notification that was originally sent."
 *     type: string
 *     example: noti_01G53V9Y6CKMCGBM1P0X7C28RX
 *   parent_notification:
 *     description: Available if the relation `parent_notification` is expanded.
 *     $ref: "#/components/schemas/notification"
 *   provider_id:
 *     description: "The ID of the Notification Provider that handles the Notification."
 *     type: string
 *     example: sengrid
 *   provider:
 *     description: Available if the relation `provider` is expanded.
 *     $ref: "#/components/schemas/notification_provider"
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 */
