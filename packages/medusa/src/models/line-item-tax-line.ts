import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm"
import { ulid } from "ulid"

import { TaxLine } from "./tax-line"
import { LineItem } from "./line-item"

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
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `litl_${id}`
  }
}
