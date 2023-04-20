import {
  MoneyAmount,
  ProductOptionValue,
  ProductVariant,
} from "@medusajs/medusa"

import { Connection } from "typeorm"
import faker from "faker"

export type ProductVariantFactoryData = {
  product_id: string
  id?: string
  is_giftcard?: boolean
  inventory_quantity?: number
  title?: string
  allow_backorder?: boolean
  manage_inventory?: boolean
  options?: { option_id: string; value: string }[]
  prices?: { currency: string; amount: number }[]
}

export const simpleProductVariantFactory = async (
  connection: Connection,
  data: ProductVariantFactoryData,
  seed?: number
): Promise<ProductVariant> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  const id = data.id || `simple-variant-${Math.random() * 1000}`
  const toSave = manager.create(ProductVariant, {
    id,
    product_id: data.product_id,
    allow_backorder: data.allow_backorder || false,
    manage_inventory: typeof data.manage_inventory !== 'undefined' ? data.manage_inventory : true,
    inventory_quantity:
      typeof data.inventory_quantity !== "undefined"
        ? data.inventory_quantity
        : 10,
    title: data.title || faker.commerce.productName(),
  })

  const variant = await manager.save(toSave)

  const options = data.options || [{ option_id: "test-option", value: "Large" }]
  for (const o of options) {
    await manager.insert(ProductOptionValue, {
      id: `${o.value}-${o.option_id}`,
      value: o.value,
      variant_id: id,
      option_id: o.option_id,
    })
  }

  const prices = data.prices || [{ currency: "usd", amount: 100 }]
  for (const p of prices) {
    await manager.insert(MoneyAmount, {
      id: `${p.currency}-${p.amount}-${Math.random()}`,
      variant_id: id,
      currency_code: p.currency,
      amount: p.amount,
    })
  }

  return variant
}
