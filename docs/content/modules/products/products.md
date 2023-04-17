---
description: 'Learn what product categories are and how they work in a Medusa backend. Product categories can be used to organize products using nested collections.'
---

# Products Architecture Overview

In this document, you’ll learn about Products in Medusa and their relation to other entities.

## Overview

Products are items that a business sells to customers. Each product can have options and variants. Options are the different available attributes of a product, and variants are the salable combinations of these options.

For example, a product can have a “Color” option with values blue and green. You can then create two product variants from these options: one using the option value blue, and the other using the value green. This is just a simple example, as you can have multiple options and have variants combine values from each of these options.

Products can be associated with categories, collections, types, and more. This allows merchants to better organize products either internally or for their customers.

---

## Product Entity Overview

The `Product` entity has many useful attributes, including:

- `title`: The name of the product.
- `handle`: A slug representation of the product’s title. This can be used in the storefront to generate human-readable URLs for products, which can be beneficial for Search Engine Optimization (SEO) purposes.
- `status`: A string indicating the status of the product. Its values can be `draft`, `proposed`, `published`, and `rejected`.
- `external_id`: A string that can be used to store an ID of the product on an external system. This is useful if you’re migrating the product from an ecommerce platform to Medusa, or if you’re connecting Medusa’s products to an external service.

Other attributes of the `Product` entity are explored in the next sections.

### Customizing the Product Entity

It’s common for developers to customize the `Product` entity, as there can be different use cases for each type of businesses.

In some simple cases, you might just need to store additional values within the entity without fully customizing it. For those cases, you can use the `metadata` attribute. This is an object stored in the database as a JSONB type in the database. You can store inside it key-value data that is useful for your case:

```tsx
metadata = {
  "someKey": "someValue",
}
```

In more complex scenarios, you may need to add columns or relations to your `Product` entity. You can then [extend the entity](../../development/entities/extend-entity.md) to make your customizations.

---

## Product Option Overview

Each product is expected to have at least one option. Options are used to specify the different available properties of that product. Some examples of options are colors, sizes, or material.

Product Options are represented by the `ProductOption` entity. The entity has the attribute `title` indicating the name of the option (for example, Color). The entity is associated with the `Product` entity through the `product_id` attribute and the `product` relation. You can also access the options of a product from the `Product` entity using the `options` relation.

The available values of each option are represented by the `ProductOptionValue` entity. The entity has the attribute `value` which is a string holding the value of the option (for example, Blue).

The `ProductOptionValue` entity is associated with the `ProductOption` through the `option_id` attribute and the `option` relation. You can also access the values of an option from the `ProductOption` entity using the `values` relation.

The `ProductOptionValue` entity is also associated with a product variant using the `variant_id` attribute and the `variant` relation.

---

## Product Variant Overview

Product variants are the actual salable item in your store. Each variant is a combination of the different option values available on the product. For example, if you have a color option and a size option, here are some variants that you might have:

- Variant A: Color blue and size large
- Variant B: Color green and size large
- Variant C: Color blue and size small
- Variant D: Color green and size small

And the list can go on.

:::note

You can’t have two product variants with the same values. For example, you can’t have another Variant E having the same option values as Variant B.

:::

![Product Diagram](https://res.cloudinary.com/dza7lstvk/image/upload/v1681731289/Medusa%20Docs/Diagrams/product_m0zb7u.jpg)

Product variants are represented by the `ProductVariant` entity. The entity’s attributes include:

- `title`: A string title of the product variant. This is different from the title in the `Product` entity.
- `product_id`: A string indicating which product this variant belongs to. You can also access the product through the `product` relation if it’s expanded.
- `sku`: A string indicating the Stock Keeping Unit (SKU) of the variant. This, along with other attributes like `barcode` or `upc`  are useful to store inventory-related information.
- `inventory_quantity`: A number indicating the available inventory of the variant. This is only useful if you have `manage_inventory` disabled.
- `manage_inventory`: A boolean value indicating whether Medusa should handle the management of the product variant’s inventory. This would allow you to handle your inventory data more accurately across different locations. You can learn more in [the Inventory Module documentation](../multiwarehouse/inventory-module.md).
- `inventory_items`: A relation that gives you access to the inventory items of a variant when `manage_inventory` is enabled. You can learn more in [the Inventory Module documentation](../multiwarehouse/inventory-module.md).
- `variant_rank`: a number that can be used to decide the sort order of variants in a storefront.

You can also access the option values of a product variant through the `options` relation, which is an array of `ProductOptionValue` items.

### Product Variant Pricing

As the product variant is the salable item in your store, the price of a product is specific to each product variant.

A product variant can have more than one price for different context. For example, a product variant can have a different price for each currency or region.

The prices of a product variant are available on the `prices` relation, which is an array of `MoneyAmount` items. `MoneyAmount` is an entity used throughout Medusa to store prices in general.

The `MoneyAmount` entity has the following attributes that are useful for a product variant:

- `currency_code`: A string indicating the currency code this price is for. The currency can also be accessed through the `currency` relation.
- `amount`: A number indicating the price.
- `region_id`: An optional string indicating the ID of the region this price is for. The region can also be accessed through the `region` relation.
- `price_list_id`: An optional string indicating the ID of the price list this price is for. The price list can also be accessed through the `price_list` relation.

### Storing the Product Variant’s Price

Although this is no requirement, it’s recommended to store the `amount` as the price multiplied by a hundred. The Medusa admin dashboard and the Next.js storefront expect the price to be of that format, so when prices are displayed they’re divided by a hundred. Also, when you add or update a product variant, its price is sent to the Medusa backend as the price multiplied by a hundred.

### Displaying the Product Variant’s Price

When showing a product’s details to the customer in the storefront, you can pass in your requests query parameters that specify the customer’s context. For example, you can specify the customer’s region. This would retrieve the correct pricing of the product for each customer. You can learn more in [this documentation](./storefront/show-products.mdx#product-pricing-parameters).

---

## Relations to Other Entities

This section explores the relations between the `Product` entity and other entities in your Medusa backend.

### SalesChannel

[Sales channels](../sales-channels/sales-channels.md) define the different channels a business is selling its products in. A product can be available in some or all sales channels.

You can access a product’s sales channels by expanding the `sales_channels` relation and accessing `product.sales_channels`. It’s an array of sales channels the product is available in.

### ProductType

A product can belong to a type, which is represented by the `ProductType` entity.

The ID of the product’s type is stored under the attribute `type_id`. You can access the product’s type by expanding the `type` relation and accessing `product.type`.

### ProductTag

A product can be associated with one or more tags. A tag is represented by the `ProductTag` entity.

You can access the product’s tags by expanding the `tags` relation and accessing `product.tags`, which is an array of product tags.

### ProductCollection

A product can be associated with a collection. A collection is represented by the `ProductCollection` entity.

The ID  You can access the product’s collection by expanding the `collection` relation and accessing `product.collection`.

### ProductCategory

A product can be associated with a category. A [category](./categories.md) is represented by the `ProductCategory` entity.

You can access the product’s categories by expanding the `categories` relation and accessing `product.categories`, which is an array of product categories.

### DiscountConditionProduct

A [discount](../discounts/discounts.md) can be specified for one or more products through discount conditions. The relation between a discount condition and a product is established through the `DiscountConditionProduct` entity which holds the IDs of the product and the discount condition.

---

## See Also

- [How to show products in a storefront](./storefront/show-products.mdx)
