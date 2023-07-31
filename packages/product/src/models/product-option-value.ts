import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { ProductOption, ProductVariant } from "./index"
import { DALUtils, generateEntityId } from "@medusajs/utils"

type OptionalFields =
  | "created_at"
  | "updated_at"
  | "allow_backorder"
  | "manage_inventory"
  | "option_id"
  | "variant_id"
type OptionalRelations = "product" | "option" | "variant"

@Entity({ tableName: "product_option_value" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
class ProductOptionValue {
  [OptionalProps]?: OptionalFields | OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  value: string

  @Property({ columnType: "text", nullable: true })
  option_id!: string

  @ManyToOne(() => ProductOption, {
    index: "IDX_product_option_value_option_id",
    fieldName: "option_id",
  })
  option: ProductOption

  @Property({ columnType: "text", nullable: true })
  variant_id!: string

  @ManyToOne(() => ProductVariant, {
    onDelete: "cascade",
    index: "IDX_product_option_value_variant_id",
    fieldName: "variant_id",
  })
  variant: ProductVariant

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

  @Index({ name: "IDX_product_option_value_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "optval")
  }
}

export default ProductOptionValue
