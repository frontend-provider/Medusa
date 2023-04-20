import "reflect-metadata"

import { FindParams, PaginatedResponse } from "../../../../types/common"
import { Product, ProductTag, ProductType, ProductVariant } from "../../../.."
import middlewares, { transformQuery } from "../../../middlewares"

import { AdminGetProductsParams } from "./list-products"
import { FlagRouter } from "../../../../utils/flag-router"
import { Router } from "express"
import { validateSalesChannelsExist } from "../../../middlewares/validators/sales-channel-existence"
import { PricedProduct } from "../../../../types/pricing"

const route = Router()

export default (app, featureFlagRouter: FlagRouter) => {
  app.use("/products", route)

  if (featureFlagRouter.isFeatureEnabled("sales_channels")) {
    defaultAdminProductRelations.push("sales_channels")
  }

  if (featureFlagRouter.isFeatureEnabled("product_categories")) {
    defaultAdminProductRelations.push("categories")
  }

  route.post(
    "/",
    validateSalesChannelsExist((req) => req.body?.sales_channels),
    middlewares.wrap(require("./create-product").default)
  )
  route.post(
    "/:id",
    validateSalesChannelsExist((req) => req.body?.sales_channels),
    middlewares.wrap(require("./update-product").default)
  )
  route.get("/types", middlewares.wrap(require("./list-types").default))
  route.get(
    "/tag-usage",
    middlewares.wrap(require("./list-tag-usage-count").default)
  )

  route.get(
    "/:id/variants",
    middlewares.normalizeQuery(),
    middlewares.wrap(require("./list-variants").default)
  )
  route.post(
    "/:id/variants",
    middlewares.wrap(require("./create-variant").default)
  )

  route.post(
    "/:id/variants/:variant_id",
    middlewares.wrap(require("./update-variant").default)
  )

  route.post(
    "/:id/options/:option_id",
    middlewares.wrap(require("./update-option").default)
  )
  route.post("/:id/options", middlewares.wrap(require("./add-option").default))

  route.delete(
    "/:id/variants/:variant_id",
    middlewares.wrap(require("./delete-variant").default)
  )
  route.delete("/:id", middlewares.wrap(require("./delete-product").default))
  route.delete(
    "/:id/options/:option_id",
    middlewares.wrap(require("./delete-option").default)
  )

  route.post(
    "/:id/metadata",
    middlewares.wrap(require("./set-metadata").default)
  )
  route.get(
    "/:id",
    transformQuery(FindParams, {
      defaultRelations: defaultAdminProductRelations,
      defaultFields: defaultAdminProductFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-product").default)
  )

  route.get(
    "/",
    transformQuery(AdminGetProductsParams, {
      defaultRelations: defaultAdminProductRelations,
      defaultFields: defaultAdminProductFields,
      isList: true,
    }),
    middlewares.wrap(require("./list-products").default)
  )

  return app
}

export const defaultAdminProductRelations = [
  "variants",
  "variants.prices",
  "variants.options",
  "images",
  "options",
  "tags",
  "type",
  "collection",
]

export const defaultAdminProductFields: (keyof Product)[] = [
  "id",
  "title",
  "subtitle",
  "status",
  "external_id",
  "description",
  "handle",
  "is_giftcard",
  "discountable",
  "thumbnail",
  "profile_id",
  "collection_id",
  "type_id",
  "weight",
  "length",
  "height",
  "width",
  "hs_code",
  "origin_country",
  "mid_code",
  "material",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const defaultAdminGetProductsVariantsFields = ["id", "product_id"]

/**
 * @schema AdminProductsDeleteOptionRes
 * type: object
 * x-expanded-relations:
 *   field: product
 *   relations:
 *     - collection
 *     - images
 *     - options
 *     - tags
 *     - type
 *     - variants
 *     - variants.options
 *     - variants.prices
 * required:
 *   - option_id
 *   - object
 *   - deleted
 *   - product
 * properties:
 *   option_id:
 *     type: string
 *     description: The ID of the deleted Product Option
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: option
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 *   product:
 *     $ref: "#/components/schemas/PricedProduct"
 */
export type AdminProductsDeleteOptionRes = {
  option_id: string
  object: "option"
  deleted: boolean
  product: Product
}

/**
 * @schema AdminProductsDeleteVariantRes
 * type: object
 * x-expanded-relations:
 *   field: product
 *   relations:
 *     - collection
 *     - images
 *     - options
 *     - tags
 *     - type
 *     - variants
 *     - variants.options
 *     - variants.prices
 * required:
 *   - variant_id
 *   - object
 *   - deleted
 *   - product
 * properties:
 *   variant_id:
 *     type: string
 *     description: The ID of the deleted Product Variant.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: product-variant
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 *   product:
 *     $ref: "#/components/schemas/PricedProduct"
 */
export type AdminProductsDeleteVariantRes = {
  variant_id: string
  object: "product-variant"
  deleted: boolean
  product: Product
}

/**
 * @schema AdminProductsDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Product.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: product
 *   deleted:
 *     type: boolean
 *     description: Whether or not the items were deleted.
 *     default: true
 */
export type AdminProductsDeleteRes = {
  id: string
  object: "product"
  deleted: boolean
}

/**
 * @schema AdminProductsListRes
 * type: object
 * x-expanded-relations:
 *   field: products
 *   relations:
 *     - collection
 *     - images
 *     - options
 *     - tags
 *     - type
 *     - variants
 *     - variants.options
 *     - variants.prices
 *   totals:
 *     - variants.purchasable
 * required:
 *   - products
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   products:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/PricedProduct"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminProductsListRes = PaginatedResponse & {
  products: (PricedProduct | Product)[]
}

/**
 * @schema AdminProductsListVariantsRes
 * type: object
 * required:
 *   - variants
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   variants:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ProductVariant"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminProductsListVariantsRes = PaginatedResponse & {
  variants: ProductVariant[]
}

/**
 * @schema AdminProductsListTypesRes
 * type: object
 * required:
 *   - types
 * properties:
 *   types:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ProductType"
 */
export type AdminProductsListTypesRes = {
  types: ProductType[]
}

/**
 * @schema AdminProductsListTagsRes
 * type: object
 * required:
 *   - tags
 * properties:
 *   tags:
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - id
 *         - usage_count
 *         - value
 *       properties:
 *         id:
 *           description: The ID of the tag.
 *           type: string
 *         usage_count:
 *           description: The number of products that use this tag.
 *           type: string
 *         value:
 *           description: The value of the tag.
 *           type: string
 */
export type AdminProductsListTagsRes = {
  tags: Array<
    Pick<ProductTag, "id" | "value"> & {
      usage_count: number
    }
  >
}

/**
 * @schema AdminProductsRes
 * type: object
 * x-expanded-relations:
 *   field: product
 *   relations:
 *     - collection
 *     - images
 *     - options
 *     - tags
 *     - type
 *     - variants
 *     - variants.options
 *     - variants.prices
 * required:
 *   - product
 * properties:
 *   product:
 *     $ref: "#/components/schemas/PricedProduct"
 */
export type AdminProductsRes = {
  product: Product
}

export * from "./add-option"
export * from "./create-product"
export * from "./create-variant"
export * from "./delete-option"
export * from "./delete-product"
export * from "./delete-variant"
export * from "./get-product"
export * from "./list-products"
export * from "./list-tag-usage-count"
export * from "./list-types"
export * from "./list-variants"
export * from "./set-metadata"
export * from "./update-option"
export * from "./update-product"
export * from "./update-variant"
