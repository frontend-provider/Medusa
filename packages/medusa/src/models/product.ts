import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { FeatureFlagDecorators } from "../utils/feature-flag-decorators"
import { Image } from "./image"
import { ProductCollection } from "./product-collection"
import { ProductOption } from "./product-option"
import { ProductTag } from "./product-tag"
import { ProductType } from "./product-type"
import { ProductVariant } from "./product-variant"
import { SalesChannel } from "./sales-channel"
import { ShippingProfile } from "./shipping-profile"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import _ from "lodash"
import { generateEntityId } from "../utils/generate-entity-id"

export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

@Entity()
export class Product extends SoftDeletableEntity {
  @Column()
  title: string

  @Column({ type: "text", nullable: true })
  subtitle: string | null

  @Column({ type: "text", nullable: true })
  description: string | null

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column({ type: "text", nullable: true })
  handle: string | null

  @Column({ default: false })
  is_giftcard: boolean

  @DbAwareColumn({ type: "enum", enum: ProductStatus, default: "draft" })
  status: ProductStatus

  @ManyToMany(() => Image, { cascade: ["insert"] })
  @JoinTable({
    name: "product_images",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "image_id",
      referencedColumnName: "id",
    },
  })
  images: Image[]

  @Column({ type: "text", nullable: true })
  thumbnail: string | null

  @OneToMany(() => ProductOption, (productOption) => productOption.product)
  options: ProductOption[]

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[]

  @Index()
  @Column()
  profile_id: string

  @ManyToOne(() => ShippingProfile)
  @JoinColumn({ name: "profile_id" })
  profile: ShippingProfile

  @Column({ type: "int", nullable: true })
  weight: number | null

  @Column({ type: "int", nullable: true })
  length: number | null

  @Column({ type: "int", nullable: true })
  height: number | null

  @Column({ type: "int", nullable: true })
  width: number | null

  @Column({ type: "text", nullable: true })
  hs_code: string | null

  @Column({ type: "text", nullable: true })
  origin_country: string | null

  @Column({ type: "text", nullable: true })
  mid_code: string | null

  @Column({ type: "text", nullable: true })
  material: string | null

  @Column({ type: "text", nullable: true })
  collection_id: string | null

  @ManyToOne(() => ProductCollection)
  @JoinColumn({ name: "collection_id" })
  collection: ProductCollection

  @Column({ type: "text", nullable: true })
  type_id: string | null

  @ManyToOne(() => ProductType)
  @JoinColumn({ name: "type_id" })
  type: ProductType

  @ManyToMany(() => ProductTag)
  @JoinTable({
    name: "product_tags",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_tag_id",
      referencedColumnName: "id",
    },
  })
  tags: ProductTag[]

  @Column({ default: true })
  discountable: boolean

  @Column({ type: "text", nullable: true })
  external_id: string | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @FeatureFlagDecorators("sales_channels", [
    ManyToMany(() => SalesChannel, { cascade: ["remove", "soft-remove"] }),
    JoinTable({
      name: "product_sales_channel",
      joinColumn: {
        name: "product_id",
        referencedColumnName: "id",
      },
      inverseJoinColumn: {
        name: "sales_channel_id",
        referencedColumnName: "id",
      },
    }),
  ])
  sales_channels: SalesChannel[]

  @BeforeInsert()
  private beforeInsert(): void {
    if (this.id) return

    this.id = generateEntityId(this.id, "prod")
    if (!this.handle) {
      this.handle = _.kebabCase(this.title)
    }
  }
}

/**
 * @schema product
 * title: "Product"
 * description: "Products are a grouping of Product Variants that have common properties such as images and descriptions. Products can have multiple options which define the properties that Product Variants differ by."
 * x-resourceId: product
 * required:
 *   - title
 *   - profile_id
 * properties:
 *   id:
 *     type: string
 *     description: The product's ID
 *     example: prod_01G1G5V2MBA328390B5AXJ610F
 *   title:
 *     description: "A title that can be displayed for easy identification of the Product."
 *     type: string
 *     example: Medusa Coffee Mug
 *   subtitle:
 *     description: "An optional subtitle that can be used to further specify the Product."
 *     type: string
 *   description:
 *     description: "A short description of the Product."
 *     type: string
 *     example: Every programmer's best friend.
 *   handle:
 *     description: "A unique identifier for the Product (e.g. for slug structure)."
 *     type: string
 *     example: coffee-mug
 *   is_giftcard:
 *     description: "Whether the Product represents a Gift Card. Products that represent Gift Cards will automatically generate a redeemable Gift Card code once they are purchased."
 *     type: boolean
 *     default: false
 *   status:
 *     description: The status of the product
 *     type: string
 *     enum:
 *       - draft
 *       - proposed
 *       - published
 *       - rejected
 *     default: draft
 *   images:
 *     description: Images of the Product. Available if the relation `images` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/image"
 *   thumbnail:
 *     description: "A URL to an image file that can be used to identify the Product."
 *     type: string
 *     format: uri
 *   options:
 *     description: The Product Options that are defined for the Product. Product Variants of the Product will have a unique combination of Product Option Values. Available if the relation `options` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product_option"
 *   variants:
 *     description: The Product Variants that belong to the Product. Each will have a unique combination of Product Option Values. Available if the relation `variants` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product_variant"
 *   profile_id:
 *     description: "The ID of the Shipping Profile that the Product belongs to. Shipping Profiles have a set of defined Shipping Options that can be used to Fulfill a given set of Products."
 *     type: string
 *     example: sp_01G1G5V239ENSZ5MV4JAR737BM
 *   profile:
 *     description: Available if the relation `profile` is expanded.
 *     $ref: "#/components/schemas/shipping_profile"
 *   weight:
 *     description: "The weight of the Product Variant. May be used in shipping rate calculations."
 *     type: number
 *     example: null
 *   height:
 *     description: "The height of the Product Variant. May be used in shipping rate calculations."
 *     type: number
 *     example: null
 *   width:
 *     description: "The width of the Product Variant. May be used in shipping rate calculations."
 *     type: number
 *     example: null
 *   length:
 *     description: "The length of the Product Variant. May be used in shipping rate calculations."
 *     type: number
 *     example: null
 *   hs_code:
 *     description: "The Harmonized System code of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *     example: null
 *   origin_country:
 *     description: "The country in which the Product Variant was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *     example: null
 *   mid_code:
 *     description: "The Manufacturers Identification code that identifies the manufacturer of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *     example: null
 *   material:
 *     description: "The material and composition that the Product Variant is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers."
 *     type: string
 *     example: null
 *   collection_id:
 *     type: string
 *     description: The Product Collection that the Product belongs to
 *     example: pcol_01F0YESBFAZ0DV6V831JXWH0BG
 *   collection:
 *     description: A product collection object. Available if the relation `collection` is expanded.
 *     type: object
 *   type_id:
 *     type: string
 *     description: The Product type that the Product belongs to
 *     example: ptyp_01G8X9A7ESKAJXG2H0E6F1MW7A
 *   type:
 *     description: Available if the relation `type` is expanded.
 *     $ref: "#/components/schemas/product_type"
 *   tags:
 *     description: The Product Tags assigned to the Product. Available if the relation `tags` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product_tag"
 *   discountable:
 *     description: "Whether the Product can be discounted. Discounts will not apply to Line Items of this Product when this flag is set to `false`."
 *     type: boolean
 *     default: true
 *   external_id:
 *     description: The external ID of the product
 *     type: string
 *     example: null
 *   sales_channels:
 *     description: The sales channels the product is associated with. Available if the relation `sales_channels` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: A sales channel object.
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
