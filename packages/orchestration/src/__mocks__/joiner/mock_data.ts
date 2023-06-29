import { JoinerServiceConfig } from "@medusajs/types"
import { remoteJoinerData } from "./../../__fixtures__/joiner/data"

export const serviceConfigs: JoinerServiceConfig[] = [
  {
    serviceName: "User",
    primaryKeys: ["id"],
    relationships: [
      {
        foreignKey: "products.product_id",
        serviceName: "Product",
        primaryKey: "id",
        alias: "product",
      },
    ],
    extends: [
      {
        serviceName: "Variant",
        resolve: {
          foreignKey: "user_id",
          serviceName: "User",
          primaryKey: "id",
          alias: "user",
        },
      },
    ],
  },
  {
    serviceName: "Product",
    primaryKeys: ["id", "sku"],
    relationships: [
      {
        foreignKey: "user_id",
        serviceName: "User",
        primaryKey: "id",
        alias: "user",
      },
    ],
  },
  {
    serviceName: "Variant",
    primaryKeys: ["id"],
    relationships: [
      {
        foreignKey: "product_id",
        serviceName: "Product",
        primaryKey: "id",
        alias: "product",
      },
      {
        foreignKey: "variant_id",
        primaryKey: "id",
        serviceName: "Order",
        alias: "orders",
        inverse: true, // In an inverted relationship the foreign key is on Order and the primary key is on variant
      },
    ],
  },
  {
    serviceName: "Order",
    primaryKeys: ["id"],
    relationships: [
      {
        foreignKey: "product_id",
        serviceName: "Product",
        primaryKey: "id",
        alias: "product",
      },
      {
        foreignKey: "products.variant_id,product_id",
        serviceName: "Variant",
        primaryKey: "id,product_id",
        alias: "variant",
      },
      {
        foreignKey: "user_id",
        serviceName: "User",
        primaryKey: "id",
        alias: "user",
      },
    ],
  },
]

export const mockServiceList = (serviceName) => {
  return jest.fn().mockImplementation((data) => {
    const src = {
      userService: remoteJoinerData.user,
      productService: remoteJoinerData.product,
      variantService: remoteJoinerData.variant,
      orderService: remoteJoinerData.order,
    }

    let resultset = JSON.parse(JSON.stringify(src[serviceName]))

    if (
      serviceName === "userService" &&
      !data.fields?.some((field) => field.includes("multiple"))
    ) {
      resultset = resultset.map((item) => {
        delete item.nested.multiple
        return item
      })
    }

    return {
      data: resultset,
      path: serviceName === "productService" ? "rows" : undefined,
    }
  })
}

export const serviceMock = {
  orderService: mockServiceList("orderService"),
  userService: mockServiceList("userService"),
  productService: mockServiceList("productService"),
  variantService: mockServiceList("variantService"),
}
