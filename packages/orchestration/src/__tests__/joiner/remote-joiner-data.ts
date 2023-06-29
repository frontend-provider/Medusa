import { MedusaContainer, RemoteExpandProperty } from "@medusajs/types"
import { lowerCaseFirst, toPascalCase } from "@medusajs/utils"
import { remoteJoinerData } from "../../__fixtures__/joiner/data"
import { serviceConfigs, serviceMock } from "../../__mocks__/joiner/mock_data"
import { RemoteJoiner } from "../../joiner"

const container = {
  resolve: (serviceName) => {
    return {
      list: (...args) => {
        return serviceMock[serviceName].apply(this, args)
      },
      getByVariantId: (options) => {
        if (serviceName !== "orderService") {
          return
        }

        let orderVar = JSON.parse(
          JSON.stringify(remoteJoinerData.order_variant)
        )

        if (options.expands?.order) {
          orderVar = orderVar.map((item) => {
            item.order = JSON.parse(
              JSON.stringify(
                remoteJoinerData.order.find((o) => o.id === item.order_id)
              )
            )
            return item
          })
        }

        return {
          data: orderVar,
        }
      },
    }
  },
} as MedusaContainer

const fetchServiceDataCallback = async (
  expand: RemoteExpandProperty,
  pkField: string,
  ids?: (unknown | unknown[])[],
  relationship?: any
) => {
  const serviceConfig = expand.serviceConfig
  const moduleRegistryName =
    lowerCaseFirst(serviceConfig.serviceName) + "Service"

  const service = container.resolve(moduleRegistryName)
  const methodName = relationship?.inverse
    ? `getBy${toPascalCase(pkField)}`
    : "list"

  return await service[methodName]({
    fields: expand.fields,
    args: expand.args,
    expands: expand.expands,
    options: {
      [pkField]: ids,
    },
  })
}

describe("RemoteJoiner", () => {
  let joiner: RemoteJoiner
  beforeAll(() => {
    joiner = new RemoteJoiner(serviceConfigs, fetchServiceDataCallback)
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Simple query of a service, its id and no fields specified", async () => {
    const query = {
      service: "User",
      args: [
        {
          name: "id",
          value: "1",
        },
      ],
      fields: ["id", "name", "email"],
    }

    const data = await joiner.query(query)

    expect(data).toEqual([
      {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "janedoe@example.com",
      },
      {
        id: 3,
        name: "aaa bbb",
        email: "aaa@example.com",
      },
      {
        id: 4,
        name: "a4444 44 44",
        email: "444444@example.com",
      },
    ])
  })

  it("Simple query of a service where the returned data contains multiple properties", async () => {
    const query = RemoteJoiner.parseQuery(`
      query {
        product {
          id
          name
        }
      }
    `)
    const data = await joiner.query(query)

    expect(data).toEqual({
      rows: [
        {
          id: 101,
          name: "Product 1",
        },
        {
          id: 102,
          name: "Product 2",
        },
        {
          id: 103,
          name: "Product 3",
        },
      ],
      limit: 3,
      skip: 0,
    })
  })

  it("Query of a service, expanding a property and restricting the fields expanded", async () => {
    const query = {
      service: "User",
      args: [
        {
          name: "id",
          value: "1",
        },
      ],
      fields: ["username", "email", "products"],
      expands: [
        {
          property: "products.product",
          fields: ["name"],
        },
      ],
    }

    const data = await joiner.query(query)

    expect(data).toEqual([
      {
        email: "johndoe@example.com",
        products: [
          {
            id: 1,
            product_id: 102,
            product: {
              name: "Product 2",
              id: 102,
            },
          },
        ],
      },
      {
        email: "janedoe@example.com",
        products: [
          {
            id: 2,
            product_id: [101, 102],
            product: [
              {
                name: "Product 1",
                id: 101,
              },
              {
                name: "Product 2",
                id: 102,
              },
            ],
          },
        ],
      },
      {
        email: "aaa@example.com",
      },
      {
        email: "444444@example.com",
        products: [
          {
            id: 4,
            product_id: 103,
            product: {
              name: "Product 3",
              id: 103,
            },
          },
        ],
      },
    ])
  })

  it("Query a service expanding multiple nested properties", async () => {
    const query = {
      service: "Order",
      fields: ["number", "date", "products"],
      expands: [
        {
          property: "products",
          fields: ["product"],
        },
        {
          property: "products.product",
          fields: ["name"],
        },
        {
          property: "user",
          fields: ["fullname", "email", "products"],
        },
        {
          property: "user.products.product",
          fields: ["name"],
        },
      ],
      args: [
        {
          name: "id",
          value: "3",
        },
      ],
    }

    const data = await joiner.query(query)

    expect(data).toEqual([
      {
        number: "ORD-001",
        date: "2023-04-01T12:00:00Z",
        products: [
          {
            product_id: 101,
            product: {
              name: "Product 1",
              id: 101,
            },
          },
          {
            product_id: 101,
            product: {
              name: "Product 1",
              id: 101,
            },
          },
        ],
        user_id: 4,
        user: {
          fullname: "444 Doe full name",
          email: "444444@example.com",
          products: [
            {
              id: 4,
              product_id: 103,
              product: {
                name: "Product 3",
                id: 103,
              },
            },
          ],
          id: 4,
        },
      },
      {
        number: "ORD-202",
        date: "2023-04-01T12:00:00Z",
        products: [
          {
            product_id: [101, 103],
            product: [
              {
                name: "Product 1",
                id: 101,
              },
              {
                name: "Product 3",
                id: 103,
              },
            ],
          },
        ],
        user_id: 1,
        user: {
          fullname: "John Doe full name",
          email: "johndoe@example.com",
          products: [
            {
              id: 1,
              product_id: 102,
              product: {
                name: "Product 2",
                id: 102,
              },
            },
          ],
          id: 1,
        },
      },
    ])
  })

  it("Query a service expanding an inverse relation", async () => {
    const query = RemoteJoiner.parseQuery(`
      query {
        variant {
          id
          name
          orders {
            order {
              number
              products {
                quantity
                product {
                  name
                }
                variant {
                  name
                }
              }
            }
          }
        }
      }
    `)
    const data = await joiner.query(query)

    expect(data).toEqual([
      {
        id: 991,
        name: "Product variant 1",
        orders: {
          order: {
            number: "ORD-001",
            products: [
              {
                product_id: 101,
                variant_id: 991,
                quantity: 1,
                product: {
                  name: "Product 1",
                  id: 101,
                },
                variant: {
                  name: "Product variant 1",
                  id: 991,
                  product_id: 101,
                },
              },
              {
                product_id: 101,
                variant_id: 992,
                quantity: 5,
                product: {
                  name: "Product 1",
                  id: 101,
                },
                variant: {
                  name: "Product variant 2",
                  id: 992,
                  product_id: 101,
                },
              },
            ],
            id: 201,
          },
          variant_id: 991,
          order_id: 201,
        },
      },
      {
        id: 992,
        name: "Product variant 2",
        orders: [
          {
            order: {
              number: "ORD-001",
              products: [
                {
                  product_id: 101,
                  variant_id: 991,
                  quantity: 1,
                  product: {
                    name: "Product 1",
                    id: 101,
                  },
                  variant: {
                    name: "Product variant 1",
                    id: 991,
                    product_id: 101,
                  },
                },
                {
                  product_id: 101,
                  variant_id: 992,
                  quantity: 5,
                  product: {
                    name: "Product 1",
                    id: 101,
                  },
                  variant: {
                    name: "Product variant 2",
                    id: 992,
                    product_id: 101,
                  },
                },
              ],
              id: 201,
            },
            variant_id: 992,
            order_id: 201,
          },
          {
            order: {
              number: "ORD-202",
              products: [
                {
                  product_id: [101, 103],
                  variant_id: 993,
                  quantity: 4,
                  product: [
                    {
                      name: "Product 1",
                      id: 101,
                    },
                    {
                      name: "Product 3",
                      id: 103,
                    },
                  ],
                },
              ],
              id: 205,
            },
            variant_id: 992,
            order_id: 205,
          },
        ],
      },
      {
        id: 993,
        name: "Product variant 33",
        orders: {
          order: {
            number: "ORD-202",
            products: [
              {
                product_id: [101, 103],
                variant_id: 993,
                quantity: 4,
                product: [
                  {
                    name: "Product 1",
                    id: 101,
                  },
                  {
                    name: "Product 3",
                    id: 103,
                  },
                ],
              },
            ],
            id: 205,
          },
          variant_id: 993,
          order_id: 205,
        },
      },
    ])
  })
})
