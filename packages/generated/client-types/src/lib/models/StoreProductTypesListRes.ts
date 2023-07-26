/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductType } from "./ProductType"

export interface StoreProductTypesListRes {
  /**
   * An array of product types details.
   */
  product_types: Array<ProductType>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of product types skipped when retrieving the product types.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
