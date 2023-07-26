/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Region } from "./Region"

export interface StoreRegionsListRes {
  /**
   * An array of regions details.
   */
  regions: Array<
    SetRelation<
      Region,
      "countries" | "payment_providers" | "fulfillment_providers"
    >
  >
  /**
   * The total number of items available
   */
  count?: number
  /**
   * The number of regions skipped when retrieving the regions.
   */
  offset?: number
  /**
   * The number of items per page
   */
  limit?: number
}
