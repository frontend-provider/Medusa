/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostStockLocationsReqAddress {
  /**
   * Stock location address
   */
  address_1: string
  /**
   * Stock location address' complement
   */
  address_2?: string
  /**
   * Stock location address' company
   */
  company?: string
  /**
   * Stock location address' city
   */
  city?: string
  /**
   * The 2 character ISO code for the country.
   */
  country_code: string
  /**
   * Stock location address' phone number
   */
  phone?: string
  /**
   * Stock location address' postal code
   */
  postal_code?: string
  /**
   * Stock location address' province
   */
  province?: string
}
