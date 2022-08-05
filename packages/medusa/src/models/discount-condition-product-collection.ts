import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { DiscountCondition } from "./discount-condition"
import { ProductCollection } from "./product-collection"

@Entity()
export class DiscountConditionProductCollection {
  @PrimaryColumn()
  product_collection_id: string

  @PrimaryColumn()
  condition_id: string

  @ManyToOne(() => ProductCollection, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_collection_id" })
  product_collection?: ProductCollection

  @ManyToOne(() => DiscountCondition, { onDelete: "CASCADE" })
  @JoinColumn({ name: "condition_id" })
  discount_condition?: DiscountCondition

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>
}

/**
 * @schema discount_condition_product_collection
 * title: "Product Collection Discount Condition"
 * description: "Associates a discount condition with a product collection"
 * x-resourceId: discount_condition_product_collection
 * required:
 *   - product_collection_id
 *   - condition_id
 * properties:
 *   product_collection_id:
 *     description: "The ID of the Product Collection"
 *     type: string
 *     example: pcol_01F0YESBFAZ0DV6V831JXWH0BG
 *   condition_id:
 *     description: "The ID of the Discount Condition"
 *     type: string
 *     example: discon_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   product_collection:
 *     description: Available if the relation `product_collection` is expanded.
 *     $ref: "#/components/schemas/product_collection"
 *   discount_condition:
 *     description: Available if the relation `discount_condition` is expanded.
 *     $ref: "#/components/schemas/discount_condition"
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
