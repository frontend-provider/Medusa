/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ShippingProfile } from "./ShippingProfile"

export interface AdminShippingProfilesListRes {
  /**
   * An array of shipping profiles details.
   */
  shipping_profiles: Array<ShippingProfile>
}
