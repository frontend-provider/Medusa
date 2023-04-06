---
description: 'Learn how to integrate PayPal with the Medusa backend. Learn how to install the PayPal plugin on the Medusa backend and integrate into a storefront.'
addHowToData: true
---

# PayPal

This document guides you through setting up PayPal as a payment processor in your Medusa backend, admin, and storefront using the [PayPal plugin](https://github.com/medusajs/medusa/tree/master/packages/medusa-payment-paypal).

## Overview

[PayPal](https://www.paypal.com) is a payment processor used by millions around the world. It allows customers to purchase orders from your website using their PayPal account rather than the need to enter their card details.

As a developer, you can use PayPal’s SDKs and APIs to integrate PayPal as a payment method into your ecommerce store. You can test out the payment method in sandbox mode before going live with it as a payment method.

Using the `medusa-payment-paypal` plugin, this guide shows you how to set up your Medusa backend with PayPal as a payment processor.

---

## Prerequisites

Before you proceed with this guide, make sure you create a [PayPal account](https://www.paypal.com). You also need a PayPal Developer account and retrieve the Client ID and Client Secret. You can learn more about how to do that in [PayPal’s documentation](https://developer.paypal.com/api/rest/).

In addition, you need to configure a webhook listener on your PayPal Developer Dashboard and obtain the webhook ID. This is necessary for Webhooks to work.

Webhooks are used in scenarios where the customer might leave the page during the authorization and before the checkout flow is fully complete. It will then create the order or swap after the payment is authorized if they weren’t created

Additionally, you need a Medusa backend installed and set up. If not, you can follow the [quickstart guide](../../development/backend/install.mdx) to get started.

You also need [Medusa Admin](../../admin/quickstart.mdx) installed to enable PayPal as a payment processor. You can alternatively use the [REST APIs](/api/admin).

---

## Medusa Backend

### Install the PayPal Plugin

In the root of your Medusa backend, run the following command to install the PayPal plugin:

```bash npm2yarn
npm install medusa-payment-paypal
```

### Configure the PayPal Plugin

Next, you need to add configurations for your PayPal plugin.

In the `.env` file add the following new environment variables:

```bash
PAYPAL_SANDBOX=true
PAYPAL_CLIENT_ID=<CLIENT_ID>
PAYPAL_CLIENT_SECRET=<CLIENT_SECRET>
PAYPAL_AUTH_WEBHOOK_ID=<WEBHOOK_ID>
```

Where `<CLIENT_ID>`, `<CLIENT_SECRET>`, and `<WEBHOOK_ID>` are the keys you retrieved from the PayPal Developer dashboard as explained in the [Prerequisites](#prerequisites) section.

Notice that during development it’s highly recommended to set `PAYPAL_SANDBOX` to `true` and ensure you have [sandbox accounts set up in PayPal](https://developer.paypal.com/api/rest/sandbox/).

Then, in `medusa-config.js`, add the PayPal plugin to the `plugins` array with the configurations necessary:

```jsx title=medusa-config.js
const plugins = [
  // other plugins...
  {
    resolve: `medusa-payment-paypal`,
    options: {
      sandbox: process.env.PAYPAL_SANDBOX,
      client_id: process.env.PAYPAL_CLIENT_ID,
      client_secret: process.env.PAYPAL_CLIENT_SECRET,
      auth_webhook_id: process.env.PAYPAL_AUTH_WEBHOOK_ID,
    },
  },
]
```

That’s all you need to install PayPal on your Medusa backend!

---

## Admin Setup

This section will guide you through adding PayPal as a payment processor in a region using your Medusa admin dashboard.

This step is required for you to be able to use PayPal as a payment processor in your storefront.

### Admin Prerequisites

If you don’t have a Medusa admin installed, make sure to follow along with [the guide on how to install it](../../admin/quickstart.mdx) before continuing with this section.

### Add PayPal to Regions

You can refer to [this documentation in the user guide](../../user-guide/regions/providers.mdx#manage-payment-providers) to learn how to add a payment processor like PayPal to a region.

---

## Storefront Setup

This section will take you through the steps to add PayPal as a payment method on the storefront. It includes the steps necessary when using one of Medusa’s official storefronts as well as your own custom React-based storefront.

### Storefront Prerequisites

All storefronts require that you obtain your PayPal Client ID. You can retrieve it from your PayPal developer dashboard.

### Process Overview

Aside from the Next.js Storefront, you need to add the implementation with PayPal manually.

:::note

It is recommended to read through the [Frontend Checkout Flow](../../modules/carts-and-checkout/storefront/implement-checkout-flow.mdx) first to fully understand how payment is implemented on the storefront.

:::

Although the next sections have different implementations to add PayPal into your storefront, they essentially follow the same process:

1. Show PayPal’s button if the PayPal processor is available for the current cart.
2. When the button is clicked, open PayPal’s payment portal and wait for the customer to authorize the payment.
3. If the payment is authorized successfully, set PayPal’s [Payment Session](../../modules/carts-and-checkout/payment.md#payment-session) as the session used to perform the payment for the current cart, then update the Payment Session on the backend with the data received from PayPal’s payment portal. This data is essential to the backend to verify the authorization and perform additional payment processing later such as capturing payment.
4. Complete the cart to create the order.

:::info

In Medusa, by default, payments are authorized during checkout, but the payment is not captured right away. The payment should be manually [captured from the Medusa Admin](#capture-payment).

:::

### Add to Next.js Storefront

Medusa has a Next.js storefront that you can easily use with your Medusa backend. If you don’t have the storefront installed, you can follow [this quickstart guide](../../starters/nextjs-medusa-starter.mdx).

In your `.env.local` file (or the file you’re using for your environment variables), add the following variable:

```bash title=.env.local
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<YOUR_CLIENT_ID>
```

Make sure to replace `<YOUR_CLIENT_ID>` with your PayPal Client ID.

Now, if you run your Medusa backend and your storefront, on checkout you’ll be able to use PayPal].

![PayPal Button](https://res.cloudinary.com/dza7lstvk/image/upload/v1668000463/Medusa%20Docs/PayPal/F8OvsOJ_v3ctol.png)

You can test out the payment with PayPal using your sandbox account.

### Add to Custom Storefront

This section guides you to add PayPal into a React-based framework. The instructions are general instructions that you can use in your storefront.

In your storefront, you need to install the [PayPal React components library](https://www.npmjs.com/package/@paypal/react-paypal-js) and the [Medusa JS Client library](https://www.npmjs.com/package/@medusajs/medusa-js):

```bash npm2yarn
npm install @paypal/react-paypal-js @medusajs/medusa-js
```

Then, add the Client ID as an environment variable based on the framework you’re using.

Next, create the file that will hold the PayPal component with the following content:

```jsx
import { 
  PayPalButtons, 
  PayPalScriptProcessor,
} from "@paypal/react-paypal-js"
import { useEffect, useState } from "react"

import Medusa from "@medusajs/medusa-js"

function Paypal() {
  const client = new Medusa()
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [processing, setProcessing] = useState(false)
  const cart = "..." // TODO retrieve the cart here

  const handlePayment = (data, actions) => {
    actions.order.authorize().then(async (authorization) => {
      if (authorization.status !== "COMPLETED") {
        setErrorMessage(
          `An error occurred, status: ${authorization.status}`
        )
        setProcessing(false)
        return
      }

      const response = await client
        .carts
        .setPaymentSession(cart.id, {
          "processor_id": "paypal",
        })

      if (!response.cart) {
        setProcessing(false)
        return
      }

      await client
        .carts
        .updatePaymentSession(cart.id, "paypal", {
        data: {
          data: {
            ...authorization,
          },
        },
      })

      const { data } = await client.carts.complete(cart.id)

      if (!data || data.object !== "order") {
        setProcessing(false)
        return
      }
      
      // order successful
      alert("success")
    })
  }

  return (
    <div style={{ marginTop: "10px", marginLeft: "10px" }}>
      {cart !== undefined && (
        <PayPalScriptProcessor options={{ 
          "client-id": "<CLIENT_ID>",
          "currency": "EUR",
          "intent": "authorize",
        }}>
            {errorMessage && (
              <span className="text-rose-500 mt-4">
                {errorMessage}
              </span>
            )}
            <PayPalButtons 
              style={{ layout: "horizontal" }}
              onApprove={handlePayment}
              disabled={processing}
            />
        </PayPalScriptProcessor>
      )}
    </div>
  )
}

export default Paypal
```

Here’s briefly what this code snippet does:

1. At the beginning of the component, the Medusa client is initialized using the JS Client you installed.
2. You also need to retrieve the cart. Ideally, the cart should be managed through a context. So, every time the cart has been updated the cart should be updated in the context to be accessed from all components.
3. This component renders a PayPal button to initialize the payment using PayPal. You use the components from the PayPal React components library to render the button and you pass the `PayPalScriptProcessor` component the Client ID. Make sure to replace `<CLIENT_ID>` with the environment variable you added.
4. When the button is clicked, the `handlePayment` function is executed. In this method, you initialize the payment authorization using `actions.order.authorize()`. It takes the customer to another page to log in with PayPal and authorize the payment.
5. After the payment is authorized successfully on PayPal’s portal, the fulfillment function passed to `actions.order.authorize().then` will be executed.
6. In the fulfillment function, you first ensure that the payment session for the PayPal payment processor is set as the [selected Payment Session in the cart](/api/store/#tag/Cart/operation/PostCartsCartPaymentSession). Then, you send a request to the backend to [update the payment session](/api/store/#tag/Cart/operation/PostCartsCartPaymentSessionUpdate) data with the authorization data received from PayPal.
7. You then [complete the cart and place the order](/api/store/#tag/Cart/operation/PostCartsCartComplete). If that is done successfully, you just show a success alert. You can change this based on the behavior you want in your storefront.

You can then import this component where you want to show it in your storefront.

If you run the Medusa backend and the storefront backend, you should see the PayPal button on checkout.

![PayPal Button](https://res.cloudinary.com/dza7lstvk/image/upload/v1668000492/Medusa%20Docs/PayPal/PsibgPY_xtqdli.png)

---

## Capture Payments

After the customer places an order, you can see the order on the admin panel. In the payment information under the “Payment” section, you should see a “Capture” button.

![Capture Payment](https://res.cloudinary.com/dza7lstvk/image/upload/v1668000502/Medusa%20Docs/PayPal/Mx357yY_xsandw.png)

Clicking this button lets you capture the payment for an order. You can also refund payments if an order has captured payments.

Refunding or Capturing payments is reflected in your PayPal dashboard as well.

---

## See Also

- Check out [more plugins](../overview.mdx) you can add to your store.
