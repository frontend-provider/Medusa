import {
  BeforeInsert,
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from "typeorm"

import { SoftDeletableEntity } from "../interfaces"
import OrderEditingFeatureFlag from "../loaders/feature-flags/order-editing"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"
import { generateEntityId } from "../utils"
import { DbAwareColumn } from "../utils/db-aware-column"
import { OrderEdit } from "./order-edit"
import { LineItem } from "./line-item"

export enum OrderEditItemChangeType {
  ITEM_ADD = "item_add",
  ITEM_REMOVE = "item_remove",
  ITEM_UPDATE = "item_update",
}

@FeatureFlagEntity(OrderEditingFeatureFlag.key)
@Unique(["order_edit_id", "original_line_item_id"])
@Unique(["order_edit_id", "line_item_id"])
export class OrderItemChange extends SoftDeletableEntity {
  @DbAwareColumn({
    type: "enum",
    enum: OrderEditItemChangeType,
  })
  type: OrderEditItemChangeType

  @Column()
  order_edit_id: string

  @ManyToOne(() => OrderEdit, (oe) => oe.changes)
  @JoinColumn({ name: "order_edit_id" })
  order_edit: OrderEdit

  @Column({ nullable: true })
  original_line_item_id?: string

  @ManyToOne(() => LineItem, { nullable: true })
  @JoinColumn({ name: "original_line_item_id" })
  original_line_item?: LineItem

  @Column({ nullable: true })
  line_item_id?: string

  @OneToOne(() => LineItem, { nullable: true })
  @JoinColumn({ name: "line_item_id" })
  line_item?: LineItem

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "oic")
  }
}

/**
 * @schema order_item_change
 * title: "Order Item Change"
 * description: "Represents an order edit item change"
 * x-resourceId: order_item_change
 * required:
 *   - type
 *   - order_edit_id
 * properties:
 *   id:
 *     type: string
 *     description: The order item change's ID
 *     example: oic_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   type:
 *     type: string
 *     description: The order's status
 *     enum:
 *       - item_add
 *       - item_remove
 *       - item_update
 *   order_edit_id:
 *     type: string
 *     description: The ID of the order edit
 *     example: oe_01G2SG30J8C85S4A5CHM2S1NS2
 *   order_edit:
 *     description: Order edit object
 *     $ref: "#/components/schemas/order_edit"
 *   original_line_item_id:
 *      type: string
 *      description: The ID of the original line item in the order
 *      example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   original_line_item:
 *      description: Original line item object.
 *      $ref: "#/components/schemas/line_item"
 *   line_item_id:
 *      type: string
 *      description: The ID of the cloned line item.
 *      example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   line_item:
 *      description: Line item object.
 *      $ref: "#/components/schemas/line_item"
 */
