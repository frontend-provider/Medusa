import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm"

import { LineItem } from "./line-item"
import { TaxLine } from "./tax-line"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
@Unique(["item_id", "code"])
export class LineItemTaxLine extends TaxLine {
  @Index()
  @Column()
  item_id: string

  @ManyToOne(() => LineItem, (li) => li.tax_lines)
  @JoinColumn({ name: "item_id" })
  item: LineItem

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "litl")
  }
}

/**
 * @schema line_item_tax_line
 * title: "Line Item Tax Line"
 * description: "Represents an Line Item Tax Line"
 * x-resourceId: line_item_tax_line
 * required:
 *   - item_id
 *   - rate
 *   - name
 * properties:
 *   id:
 *     type: string
 *     description: The line item tax line's ID
 *     example: litl_01G1G5V2DRX1SK6NQQ8VVX4HQ8
 *   item_id:
 *     type: string
 *     description: The ID of the line item
 *     example: item_01G8ZC9GWT6B2GP5FSXRXNFNGN
 *   item:
 *     description: Available if the relation `item` is expanded.
 *     $ref: "#/components/schemas/line_item"
 *   code:
 *     description: "A code to identify the tax type by"
 *     type: string
 *     example: tax01
 *   name:
 *     description: "A human friendly name for the tax"
 *     type: string
 *     example: Tax Example
 *   rate:
 *     description: "The numeric rate to charge tax by"
 *     type: number
 *     example: 10
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
