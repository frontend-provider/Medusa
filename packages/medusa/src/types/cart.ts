import { ValidateNested } from "class-validator"
import { IsType } from "../utils/validators/is-type"
import { CartType } from "../models/cart"
import {
  AddressPayload,
  DateComparisonOperator,
  StringComparisonOperator,
} from "./common"

export class FilterableCartProps {
  @ValidateNested()
  @IsType([String, [String], StringComparisonOperator])
  id?: string | string[] | StringComparisonOperator

  @IsType([DateComparisonOperator])
  created_at?: DateComparisonOperator

  @IsType([DateComparisonOperator])
  updated_at?: DateComparisonOperator
}

// TODO: Probably worth moving to `./line-item` instead
export type LineItemUpdate = {
  title?: string
  unit_price?: number
  quantity?: number
  metadata?: object
  region_id?: string
  variant_id?: string
}

class GiftCard {
  code: string
}

class Discount {
  code: string
}

export type CartCreateProps = {
  region_id: string
  email?: string
  billing_address_id?: string
  billing_address?: Partial<AddressPayload>
  shipping_address_id?: string
  shipping_address?: Partial<AddressPayload>
  gift_cards?: GiftCard[]
  discounts?: Discount[]
  customer_id?: string
  type?: CartType
  context?: object
  metadata?: object
}

export type CartUpdateProps = {
  region_id?: string
  country_code?: string
  email?: string
  shipping_address_id?: string
  billing_address_id?: string
  billing_address?: AddressPayload
  shipping_address?: AddressPayload
  completed_at?: Date
  payment_authorized_at?: Date
  gift_cards?: GiftCard[]
  discounts?: Discount[]
  customer_id?: string
  context?: object
  metadata?: object
}
