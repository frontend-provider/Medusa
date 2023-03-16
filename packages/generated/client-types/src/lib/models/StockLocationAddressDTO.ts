/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Represents a Stock Location Address
 */
export interface StockLocationAddressDTO {
  /**
   * The stock location address' ID
   */
  id?: string
  /**
   * Stock location address
   */
  address_1: string
  /**
   * Stock location address' complement
   */
  address_2?: string
  /**
   * Stock location company' name
   */
  company?: string
  /**
   * Stock location address' city
   */
  city?: string
  /**
   * Stock location address' country
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
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at?: string
  /**
   * An optional key-value map with additional details
   */
  metadata?: Record<string, any>
}
