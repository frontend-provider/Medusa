import { MedusaError } from "medusa-core-utils"
import { IdMap } from "medusa-test-utils"

export const carts = {
  emptyCart: {
    _id: IdMap.getId("emptyCart"),
    items: [],
    region_id: IdMap.getId("testRegion"),
    shipping_options: [
      {
        _id: IdMap.getId("freeShipping"),
        profile_id: "default_profile",
        data: {
          some_data: "yes",
        },
      },
    ],
  },
  regionCart: {
    _id: IdMap.getId("regionCart"),
    name: "Product 1",
    region_id: IdMap.getId("testRegion"),
  },
  frCart: {
    _id: IdMap.getId("fr-cart"),
    title: "test",
    region_id: IdMap.getId("region-france"),
    items: [
      {
        _id: IdMap.getId("line"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: [
          {
            unit_price: 8,
            variant: {
              _id: IdMap.getId("eur-8-us-10"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
          {
            unit_price: 10,
            variant: {
              _id: IdMap.getId("eur-10-us-12"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
        ],
        quantity: 10,
      },
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 10,
          variant: {
            _id: IdMap.getId("eur-10-us-12"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    shipping_methods: [
      {
        _id: IdMap.getId("freeShipping"),
        profile_id: "default_profile",
      },
    ],
    shipping_options: [
      {
        _id: IdMap.getId("freeShipping"),
        profile_id: "default_profile",
      },
    ],
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: "",
  },
  cartWithPaySessions: {
    _id: IdMap.getId("cartWithPaySessions"),
    region_id: IdMap.getId("testRegion"),
    items: [
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            _id: IdMap.getId("can-cover"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    payment_sessions: [
      {
        provider_id: "default_provider",
        data: {
          id: "default_provider_session",
        },
      },
      {
        provider_id: "unregistered",
        data: {
          id: "unregistered_session",
        },
      },
    ],
    shipping_address: {},
    billing_address: {},
    discounts: [],
    customer_id: "",
  },
  discountCart: {
    _id: IdMap.getId("discount-cart"),
    discounts: [],
    region_id: IdMap.getId("region-france"),
    items: [
      {
        _id: IdMap.getId("line"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: [
          {
            unit_price: 8,
            variant: {
              _id: IdMap.getId("eur-8-us-10"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
          {
            unit_price: 10,
            variant: {
              _id: IdMap.getId("eur-10-us-12"),
            },
            product: {
              _id: IdMap.getId("product"),
            },
            quantity: 1,
          },
        ],
        quantity: 10,
      },
      {
        _id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 10,
          variant: {
            _id: IdMap.getId("eur-10-us-12"),
          },
          product: {
            _id: IdMap.getId("product"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
  },
}

export const CartServiceMock = {
  create: jest.fn().mockImplementation(data => {
    if (data.region_id === IdMap.getId("testRegion")) {
      return Promise.resolve(carts.regionCart)
    }
    if (data.region_id === IdMap.getId("fail")) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Region not found")
    }
  }),
  retrieve: jest.fn().mockImplementation(cartId => {
    if (cartId === IdMap.getId("fr-cart")) {
      return Promise.resolve(carts.frCart)
    }
    if (cartId === IdMap.getId("regionCart")) {
      return Promise.resolve(carts.regionCart)
    }
    if (cartId === IdMap.getId("emptyCart")) {
      return Promise.resolve(carts.emptyCart)
    }
    if (cartId === IdMap.getId("cartWithPaySessions")) {
      return Promise.resolve(carts.cartWithPaySessions)
    }
    return Promise.resolve(undefined)
  }),
  addLineItem: jest.fn().mockImplementation((cartId, lineItem) => {
    return Promise.resolve()
  }),
  setPaymentMethod: jest.fn().mockImplementation((cartId, method) => {
    if (method.provider_id === "default_provider") {
      return Promise.resolve()
    }

    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Not allowed")
  }),
  updateLineItem: jest.fn().mockImplementation((cartId, lineItem) => {
    return Promise.resolve()
  }),
  setRegion: jest.fn().mockImplementation((cartId, regionId) => {
    if (regionId === IdMap.getId("fail")) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Region not found")
    }
    return Promise.resolve()
  }),
  updateEmail: jest.fn().mockImplementation((cartId, email) => {
    return Promise.resolve()
  }),
  updateShippingAddress: jest.fn().mockImplementation((cartId, address) => {
    return Promise.resolve()
  }),
  updateBillingAddress: jest.fn().mockImplementation((cartId, address) => {
    return Promise.resolve()
  }),
  applyPromoCode: jest.fn().mockImplementation((cartId, code) => {
    return Promise.resolve()
  }),
  setPaymentSessions: jest.fn().mockImplementation(cartId => {
    return Promise.resolve()
  }),
  setShippingOptions: jest.fn().mockImplementation(cartId => {
    return Promise.resolve()
  }),
  decorate: jest.fn().mockImplementation(cart => {
    cart.decorated = true
    return cart
  }),
  addShippingMethod: jest.fn().mockImplementation(cartId => {
    return Promise.resolve()
  }),
  retrieveShippingOption: jest.fn().mockImplementation((cartId, optionId) => {
    if (optionId === IdMap.getId("freeShipping")) {
      return {
        _id: IdMap.getId("freeShipping"),
        profile_id: "default_profile",
      }
    }
    if (optionId === IdMap.getId("withData")) {
      return {
        _id: IdMap.getId("withData"),
        profile_id: "default_profile",
        data: {
          some_data: "yes",
        },
      }
    }
  }),
  retrievePaymentSession: jest.fn().mockImplementation((cartId, providerId) => {
    if (providerId === "default_provider") {
      return {
        provider_id: "default_provider",
        data: {
          money_id: "success",
        },
      }
    }

    if (providerId === "nono") {
      return {
        provider_id: "nono",
        data: {
          money_id: "fail",
        },
      }
    }
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return CartServiceMock
})

export default mock
