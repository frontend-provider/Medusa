import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"

import { ProductType } from "./product-type"
import { TaxRate } from "./tax-rate"

@Entity()
export class ProductTypeTaxRate {
  @PrimaryColumn()
  product_type_id: string

  @PrimaryColumn()
  rate_id: string

  @ManyToOne(() => ProductType, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_type_id" })
  product_type?: ProductType

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
 * @schema product_type_tax_rate
 * title: "Product Type Tax Rate"
 * description: "Associates a tax rate with a product type to indicate that the product type is taxed in a certain way"
 * x-resourceId: product_type_tax_rate
 * required:
 *   - product_type_id
 *   - rate_id
 * properties:
 *   product_type_id:
 *     description: "The ID of the Product type"
 *     type: string
 *     example: ptyp_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   product_type:
 *     description: Available if the relation `product_type` is expanded.
 *     $ref: "#/components/schemas/product_type"
 *   rate_id:
 *     description: "The id of the Tax Rate"
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
