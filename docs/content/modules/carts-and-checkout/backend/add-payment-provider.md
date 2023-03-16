---
description: 'Learn how to create a payment provider in the Medusa backend. This guide explains the different methods available in a fulfillment provider.'
addHowToData: true
---

# How to Create a Payment Provider

In this document, you’ll learn how to add a Payment Provider to your Medusa backend. If you’re unfamiliar with the Payment architecture in Medusa, make sure to check out the [overview](../payment.md) first.

## Overview

A Payment Provider is the payment method used to authorize, capture, and refund payment, among other actions. An example of a Payment Provider is Stripe.

By default, Medusa has a [manual payment provider](https://github.com/medusajs/medusa/tree/master/packages/medusa-payment-manual) that has minimal implementation. It can be synonymous with a Cash on Delivery payment method. It allows store operators to manage the payment themselves but still keep track of its different stages on Medusa.

Adding a Payment Provider is as simple as creating a [service](../../../development/services/create-service.md) file in `src/services`. A Payment Provider is essentially a service that extends `AbstractPaymentService` from the core Medusa package `@medusajs/medusa`.

Payment Provider Services must have a static property `identifier`. It's the name that will be used to install and refer to the Payment Provider in the Medusa backend.

:::tip

Payment Providers are loaded and installed at the backend startup.

:::

The Payment Provider service is also required to implement the following methods:

1. `createPayment`: Called when a Payment Session for the Payment Provider is to be created.
2. `retrievePayment`: Used to retrieve payment data from the third-party provider, if there’s any.
3. `getStatus`: Used to get the status of a Payment or Payment Session.
4. `updatePayment`: Used to update the Payment Session whenever the cart and its related data are updated.
5. `updatePaymentData`: Used to update the `data` field of Payment Sessions. Specifically called when a request is sent to the [Update Payment Session](/api/store/#tag/Cart/operation/PostCartsCartPaymentSessionUpdate) endpoint.
6. `deletePayment`: Used to perform any action necessary before a Payment Session is deleted.
7. `authorizePayment`: Used to authorize the payment amount of the cart before the order or swap is created.
8. `getPaymentData`: Used to retrieve the data that should be stored in the `data` field of a new  Payment instance after the payment amount has been authorized.
9. `capturePayment`: Used to capture the payment amount of an order or swap.
10. `refundPayment`: Used to refund a payment amount of an order or swap.
11. `cancelPayment`: Used to perform any necessary action with the third-party payment provider when an order or swap is canceled.

:::note

All these methods must be declared async in the Payment Provider Service.

:::

These methods are used at different points in the Checkout flow as well as when processing the order after it’s placed.

![Checkout Flow - Payment](https://res.cloudinary.com/dza7lstvk/image/upload/v1677770739/Medusa%20Docs/Diagrams/checkout-payment_rouet2.png)

---

## Create a Payment Provider

The first step to create a payment provider is to create a JavaScript or TypeScript file in `src/services`. The file's name should be the name of the payment provider.

For example, create the file `src/services/my-payment.ts` with the following content:

```ts title=src/services/my-payment.ts
import { 
  AbstractPaymentService, PaymentContext, Data, 
  Payment, PaymentSession, PaymentSessionStatus, 
  PaymentSessionData, Cart, PaymentData,
  PaymentSessionResponse } from "@medusajs/medusa"

import { EntityManager } from "typeorm"

class MyPaymentService extends AbstractPaymentService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  async getPaymentData(
    paymentSession: PaymentSession
  ): Promise<Data> {
    throw new Error("Method not implemented.")
  }
  async updatePaymentData(
    paymentSessionData: PaymentSessionData,
    data: Data
  ): Promise<PaymentSessionData> {
    throw new Error("Method not implemented.")
  }
  async createPayment(
    context: Cart & PaymentContext
  ): Promise<PaymentSessionResponse> {
    throw new Error("Method not implemented.")
  }
  async retrievePayment(paymentData: Data): Promise<Data> {
    throw new Error("Method not implemented.")
  }
  async updatePayment(
    paymentSessionData: PaymentSessionData,
    cart: Cart
  ): Promise<PaymentSessionData> {
    throw new Error("Method not implemented.")
  }
  async authorizePayment(
    paymentSession: PaymentSession,
    context: Data
  ): Promise<{ 
    data: PaymentSessionData; 
    status: PaymentSessionStatus 
  }> {
    throw new Error("Method not implemented.")
  }
  async capturePayment(payment: Payment): Promise<PaymentData> {
    throw new Error("Method not implemented.")
  }
  async refundPayment(
    payment: Payment, 
    refundAmount: number
  ): Promise<PaymentData> {
    throw new Error("Method not implemented.")
  }
  async cancelPayment(payment: Payment): Promise<PaymentData> {
    throw new Error("Method not implemented.")
  }
  async deletePayment(
    paymentSession: PaymentSession
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async getStatus(data: Data): Promise<PaymentSessionStatus> {
    throw new Error("Method not implemented.")
  }

}

export default MyPaymentService
```

Where `MyPaymentService` is the name of your Payment Provider service. For example, Stripe’s Payment Provider Service is called `StripeProviderService`.

Payment Providers must extend `AbstractPaymentService` from the core Medusa package `@medusajs/medusa`.

:::tip

Following the naming convention of Services, the name of the file should be the slug name of the Payment Provider, and the name of the class should be the camel case name of the Payment Provider suffixed with “Service”. In the example above, the name of the file should be `my-payment.js`. You can learn more in the [service documentation](../../../development/services/create-service.md).

:::

### Identifier

As mentioned in the overview, Payment Providers should have a static `identifier` property.

The `PaymentProvider` entity has 2 properties: `identifier` and `is_installed`. The value of the `identifier` property in the class will be used when the Payment Provider is created in the database.

The value of this property will also be used to reference the Payment Provider throughout the Medusa backend. For example, the identifier is used when a [Payment Session in a cart is selected on checkout](/api/store/#tag/Cart/operation/PostCartsCartPaymentSession).

### constructor

You can use the `constructor` of your Payment Provider to have access to different services in Medusa through dependency injection.

You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs, you can initialize it in the constructor and use it in other methods in the service.

Additionally, if you’re creating your Payment Provider as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin, you can access it in the constructor. The options are passed as a second parameter:

```ts
class MyPaymentService extends AbstractPaymentService {
  // ...
  constructor(container, options) {
    super(container)
    // you can access options here
  }
  // ...
}
```

### createPayment

This method is called during checkout when [Payment Sessions are initialized](/api/store/#tag/Cart/operation/PostCartsCartPaymentSessions) to present payment options to the customer. It is used to allow you to make any necessary calls to the third-party provider to initialize the payment.

For example, in Stripe this method is used to initialize a Payment Intent for the customer.

The method receives a context object as a first parameter. This object is of type `PaymentContext` and has the following properties:

```ts
type PaymentContext = {
  cart: {
    context: Record<string, unknown>
    id: string
    email: string
    shipping_address: Address | null
    shipping_methods: ShippingMethod[]
  }
  currency_code: string
  amount: number
  resource_id?: string
  customer?: Customer
}
```

:::note

Before v1.7.2, the first parameter was of type `Cart`. This method remains backwards compatible, but will be changed in the future. So, it's recommended to change the type of the first parameter to `PaymentContext`.

:::

This method must return an object of type `PaymentSessionResponse`. It should have the following properties:

```ts
type PaymentSessionResponse = {
  update_requests: {
    customer_metadata: Record<string, unknown>
  }
  session_data: Record<string, unknown>
}
```

Where:

- `session_data` is the data that is going to be stored in the `data` field of the Payment Session to be created. As mentioned in the [Architecture Overview](../payment.md), the `data` field is useful to hold any data required by the third-party provider to process the payment or retrieve its details at a later point.
- `update_requests` is an object that can be used to pass data from the payment provider plugin to the core to update internal resources. Currently, it only has one attribute `customer_metadata` which allows updating the `metadata` field of the customer.

An example of a minimal implementation of `createPayment`:

```ts
import {
  PaymentContext,
  PaymentSessionResponse,
} from "@medusajs/medusa"

class MyPaymentService extends AbstractPaymentService {
  // ...
  async createPayment(
    context: Cart & PaymentContext
  ): Promise<PaymentSessionResponse> {
    // prepare data
    return { 
      session_data,
      update_requests,
    }
  }
}
```

### retrievePayment

This method is used to provide a uniform way of retrieving the payment information from the third-party provider. For example, in Stripe’s Payment Provider Service this method is used to retrieve the payment intent details from Stripe.

This method accepts the `data` field of a Payment Session or a Payment. So, you should make sure to store in the `data` field any necessary data that would allow you to retrieve the payment data from the third-party provider.

This method must return an object containing the data from the third-party provider.

An example of a minimal implementation of `retrievePayment` where you don’t need to interact with the third-party provider:

```ts
import { Data } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async retrievePayment(paymentData: Data): Promise<Data> {
    return {}
  }
}
```

### getStatus

This method is used to get the status of a Payment or a Payment Session. 

Its main usage is in the place order workflow. If the status returned is not `authorized`, then the payment is considered failed, an error will be thrown, and the order will not be placed.

This method accepts the `data` field of the Payment or Payment Session as a parameter. You can use this data to interact with the third-party provider to check the status of the payment if necessary.

This method returns a string that represents the status. The status must be one of the following values:

1. `authorized`: The payment was successfully authorized.
2. `pending`: The payment is still pending. This is the default status of a Payment Session.
3. `requires_more`: The payment requires more actions from the customer. For example, if the customer must complete a 3DS check before the payment is authorized.
4. `error`: If an error occurred with the payment.
5. `canceled`: If the payment was canceled.

An example of a minimal implementation of `getStatus` where you don’t need to interact with the third-party provider:

```ts
import { Data, PaymentSessionStatus } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async getStatus(data: Data): Promise<PaymentSessionStatus> {
    return PaymentSessionStatus.AUTHORIZED
  }
}
```

:::note

This code block assumes the status is stored in the `data` field as demonstrated in the `createPayment` method.

:::

### updatePayment

This method is used to perform any necessary updates on the payment. This method is called whenever the cart or any of its related data is updated. For example, when a [line item is added to the cart](/api/store/#tag/Cart/operation/PostCartsCartLineItems) or when a [shipping method is selected](/api/store/#tag/Cart/operation/PostCartsCartShippingMethod).

:::tip

A line item refers to a product in the cart.

:::

It accepts the `data` field of the Payment Session as the first parameter and a context object as a second parameter. This object is of type `PaymentContext` and has the following properties:

```ts
type PaymentContext = {
  cart: {
    context: Record<string, unknown>
    id: string
    email: string
    shipping_address: Address | null
    shipping_methods: ShippingMethod[]
  }
  currency_code: string
  amount: number
  resource_id?: string
  customer?: Customer
}
```

:::note

Before v1.7.2, the second parameter was of type `Cart`. This method remains backwards compatible, but will be changed in the future. So, it's recommended to change the type of the first parameter to `PaymentContext`.

:::

You can utilize this method to interact with the third-party provider and update any details regarding the payment if necessary.

This method must return an object of type `PaymentSessionResponse`. It should have the following properties:

```ts
type PaymentSessionResponse = {
  update_requests: { 
    customer_metadata: Record<string, unknown>
  }
  session_data: Record<string, unknown>
}
```

Where:

- `session_data` is the data that is going to be stored in the `data` field of the Payment Session to be created. As mentioned in the [Architecture Overview](../payment.md), the `data` field is useful to hold any data required by the third-party provider to process the payment or retrieve its details at a later point.
- `update_requests` is an object that can be used to request from the Medusa core to update internal resources. Currently, it only has one attribute `customer_metadata` which allows updating the `metadata` field of the customer.

An example of a minimal implementation of `updatePayment`:

```ts
import { 
  PaymentSessionData, 
  Cart, 
  PaymentContext, 
  PaymentSessionResponse,
} from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async updatePayment(
    paymentSessionData: PaymentSessionData,
    cart: Cart
  ): Promise<PaymentSessionData> {
    // prepare data
    return {
      session_data,
      update_requests,
    }
  }
}
```

### updatePaymentData

This method is used to update the `data` field of a Payment Session. Particularly, it is called when a request is sent to the [Update Payment Session](/api/store/#tag/Cart/operation/PostCartsCartPaymentSessionUpdate) endpoint. This endpoint receives a `data` object in the body of the request that should be used to update the existing `data` field of the Payment Session.

This method accepts the current `data` field of the Payment Session as the first parameter, and the new `data` field sent in the body request as the second parameter.

You can utilize this method to interact with the third-party provider and make any necessary updates based on the `data` field passed in the body of the request.

This method must return an object that will be stored in the `data` field of the Payment Session.

An example of a minimal implementation of `updatePaymentData` that returns the `updatedData` passed in the body of the request as-is to update the `data` field of the Payment Session.

```ts
import { Data, PaymentSessionData } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async updatePaymentData(
    paymentSessionData: PaymentSessionData,
    data: Data
  ): Promise<PaymentSessionData> {
    return updatedData
  }
}
```

### deletePayment

This method is used to perform any actions necessary before a Payment Session is deleted. The Payment Session is deleted in one of the following cases:

1. When a request is sent to [delete the Payment Session](/api/store/#tag/Cart/operation/DeleteCartsCartPaymentSessionsSession).
2. When the [Payment Session is refreshed](/api/store/#tag/Cart/operation/PostCartsCartPaymentSessionsSession). The Payment Session is deleted so that a newer one is initialized instead.
3. When the Payment Provider is no longer available. This generally happens when the store operator removes it from the available Payment Provider in the admin.
4. When the region of the store is changed based on the cart information and the Payment Provider is not available in the new region.

It accepts the Payment Session as an object for its first parameter.

You can use this method to interact with the third-party provider to delete data related to the Payment Session if necessary.

An example of a minimal implementation of `deletePayment` where no interaction with a third-party provider is required:

```ts
import { PaymentSession } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async deletePayment(
    paymentSession: PaymentSession
  ): Promise<void> {
    return
  }
}
```

### authorizePayment

This method is used to authorize payment using the Payment Session for an order. This is called when the [cart is completed](/api/store/#tag/Cart/operation/PostCartsCartComplete) and before the order is created.

This method is also used for authorizing payments of a swap of an order.

The payment authorization might require additional action from the customer before it is declared authorized. Once that additional action is performed, the `authorizePayment` method will be called again to validate that the payment is now fully authorized. So, you should make sure to implement it for this case as well, if necessary.

Once the payment is authorized successfully and the Payment Session status is set to `authorized`, the order can then be placed.

If the payment authorization fails, then an error will be thrown and the order will not be created.

:::note

The payment authorization status is determined using the `getStatus` method as mentioned earlier. If the status is `requires_more` then it means additional actions are required from the customer. If the workflow process reaches the “Start Create Order” step and the status is not `authorized`, then the payment is considered failed.

:::

This method accepts the Payment Session as an object for its first parameter, and a `context` object as a second parameter. The `context` object contains the following properties:

1. `ip`: The customer’s IP.
2. `idempotency_key`: The [Idempotency Key](../payment.md#idempotency-key) that is associated with the current cart. It is useful when retrying payments, retrying checkout at a failed point, or for payments that require additional actions from the customer.

This method must return an object containing the property `status` which is a string that indicates the current status of the payment, and the property `data` which is an object containing any additional information required to perform additional payment processing such as capturing the payment. The values of both of these properties are stored in the Payment Session’s `status` and `data` fields respectively.

You can utilize this method to interact with the third-party provider and perform any actions necessary to authorize the payment.

An example of a minimal implementation of `authorizePayment` that doesn’t need to interact with any third-party provider:

```ts
import { 
  Data, 
  PaymentSession, 
  PaymentSessionStatus, 
  PaymentSessionData,
} from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async authorizePayment(
    paymentSession: PaymentSession,
    context: Data
  ): Promise<{
    data: PaymentSessionData;
    status: PaymentSessionStatus
  }> {
    return {
      status: PaymentSessionStatus.AUTHORIZED,
      data: {
        id: "test",
      },
    }
  }
}
```

### getPaymentData

After the payment is authorized using `authorizePayment`, a Payment instance will be created. The `data` field of the Payment instance will be set to the value returned from the `getPaymentData` method in the Payment Provider.

This method accepts the Payment Session as an object for its first parameter.

This method must return an object to be stored in the `data` field of the Payment instance. You can either use it as-is or make any changes to it if necessary.

An example of a minimal implementation of `getPaymentData`:

```ts
import { Data, PaymentSession } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async getPaymentData(
    paymentSession: PaymentSession
  ): Promise<Data> {
    return paymentSession.data
  }
}
```

### capturePayment

This method is used to capture the payment amount of an order. This is typically triggered manually by the store operator from the admin.

This method is also used for capturing payments of a swap of an order.

You can utilize this method to interact with the third-party provider and perform any actions necessary to capture the payment.

This method accepts the Payment as an object for its first parameter.

This method must return an object that will be stored in the `data` field of the Payment.

An example of a minimal implementation of `capturePayment` that doesn’t need to interact with a third-party provider:

```ts
import { Data, Payment } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async capturePayment(payment: Payment): Promise<Data> {
    return {
      status: "captured",
    }
  }
}
```

### refundPayment

This method is used to refund an order’s payment. This is typically triggered manually by the store operator from the admin. The refund amount might be the total order amount or part of it.

This method is also used for refunding payments of a swap of an order.

You can utilize this method to interact with the third-party provider and perform any actions necessary to refund the payment.

This method accepts the Payment as an object for its first parameter, and the amount to refund as a second parameter.

This method must return an object that is stored in the `data` field of the Payment.

An example of a minimal implementation of `refundPayment` that doesn’t need to interact with a third-party provider:

```ts
import { Data, Payment } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async refundPayment(
    payment: Payment, 
    refundAmount: number
  ): Promise<Data> {
    return {
      id: "test",
    }
  }
}
```

### cancelPayment

This method is used to cancel an order’s payment. This method is typically triggered by one of the following situations:

1. Before an order is placed and after the payment is authorized, an inventory check is done on products to ensure that products are still available for purchase. If the inventory check fails for any of the products, the payment is canceled.
2. If the store operator cancels the order from the admin.

This method is also used for canceling payments of a swap of an order.

You can utilize this method to interact with the third-party provider and perform any actions necessary to cancel the payment.

This method accepts the Payment as an object for its first parameter.

This method must return an object that is stored in the `data` field of the Payment.

An example of a minimal implementation of `cancelPayment` that doesn’t need to interact with a third-party provider:

```ts
import { Data, Payment } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  async cancelPayment(payment: Payment): Promise<Data> {
    return {
      id: "test",
    }
  }
}
```

---

## Optional Methods

### retrieveSavedMethods

This method can be added to your Payment Provider service if your third-party provider supports saving the customer’s payment methods. Please note that in Medusa there is no way to save payment methods.

This method is called when a request is sent to [Retrieve Saved Payment Methods](/api/store/#tag/Customer/operation/GetCustomersCustomerPaymentMethods).

This method accepts the customer as an object for its first parameter.

This method returns an array of saved payment methods retrieved from the third-party provider. You have the freedom to shape the items in the array as you see fit since they will be returned as-is for the response to the request.

:::note

If you’re using Medusa’s [Next.js](../../../starters/nextjs-medusa-starter.mdx) or [Gatsby](../../../starters/gatsby-medusa-starter.mdx) storefront starters, note that the presentation of this method is not implemented. You’ll need to implement the UI and pages for this method based on your implementation and the provider you are using.

:::

An example of the implementation of `retrieveSavedMethods` taken from Stripe’s Payment Provider:

```ts
import { Customer, Data } from "@medusajs/medusa"
// ...

class MyPaymentService extends AbstractPaymentService {
  // ...
  /**
  * Fetches a customers saved payment methods 
  * if they're saved in Stripe.
  * @param {object} customer - customer to fetch saved cards for
  * @return {Promise<Array<object>>} saved payments methods
  */
  async retrieveSavedMethods(
    customer: Customer
  ): Promise<Data[]> {
    if (customer.metadata && customer.metadata.stripe_id) {
      const methods = await this.stripe_.paymentMethods.list({
        customer: customer.metadata.stripe_id,
        type: "card",
      })

      return methods.data
    }

    return Promise.resolve([])
  }
}
```

---

## See Also

- Implementation Examples: [Stripe](https://github.com/medusajs/medusa/tree/2e6622ec5d0ae19d1782e583e099000f0a93b051/packages/medusa-payment-stripe) and [PayPal](https://github.com/medusajs/medusa/tree/2e6622ec5d0ae19d1782e583e099000f0a93b051/packages/medusa-payment-paypal) payment providers.
