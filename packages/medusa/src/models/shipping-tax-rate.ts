import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { ShippingOption } from "./shipping-option"
import { TaxRate } from "./tax-rate"

@Entity()
export class ShippingTaxRate {
  @PrimaryColumn()
  shipping_option_id: string

  @PrimaryColumn()
  rate_id: string

  @ManyToOne(() => ShippingOption, { onDelete: "CASCADE" })
  @JoinColumn({ name: "shipping_option_id" })
  shipping_option?: ShippingOption

  @ManyToOne(() => TaxRate, { onDelete: "CASCADE" })
  @JoinColumn({ name: "rate_id" })
  tax_rate?: TaxRate

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>
}

/**
 * @schema shipping_tax_rate
 * title: "Shipping Tax Rate"
 * description: "Associates a tax rate with a shipping option to indicate that the shipping option is taxed in a certain way"
 * x-resourceId: shipping_tax_rate
 * required:
 *   - shipping_option_id
 *   - rate_id
 * properties:
 *   shipping_option_id:
 *     description: "The ID of the Shipping Option"
 *     type: string
 *     example: so_01G1G5V27GYX4QXNARRQCW1N8T
 *   shipping_option:
 *     description: Available if the relation `shipping_option` is expanded.
 *     $ref: "#/components/schemas/shipping_option"
 *   rate_id:
 *     description: "The ID of the Tax Rate"
 *     type: string
 *     example: txr_01G8XDBAWKBHHJRKH0AV02KXBR
 *   tax_rate:
 *     description: Available if the relation `tax_rate` is expanded.
 *     $ref: "#/components/schemas/tax_rate"
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
