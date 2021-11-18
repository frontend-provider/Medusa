import { Customer } from "../../../.."
import CustomerService from "../../../../services/customer"
import PaymentProviderService from "../../../../services/payment-provider"
import StoreService from "../../../../services/store"

/**
 * @oas [get] /customers/me/payment-methods
 * operationId: GetCustomersCustomerPaymentMethods
 * summary: Retrieve saved payment methods
 * description: "Retrieves a list of a Customer's saved payment methods. Payment methods are saved with Payment Providers and it is their responsibility to fetch saved methods."
 * x-authenticated: true
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             payment_methods:
 *               type: array
 *               items:
 *                 properties:
 *                   provider_id:
 *                     type: string
 *                     description: The id of the Payment Provider where the payment method is saved.
 *                   data:
 *                     type: object
 *                     description: The data needed for the Payment Provider to use the saved payment method.
 */
export default async (req, res) => {
  const id = req.user.customer_id

  const storeService: StoreService = req.scope.resolve("storeService")

  const paymentProviderService: PaymentProviderService = req.scope.resolve(
    "paymentProviderService"
  )

  const customerService: CustomerService = req.scope.resolve("customerService")

  const customer: Customer = await customerService.retrieve(id)

  const store = await storeService.retrieve(["payment_providers"])

  const methods = await Promise.all(
    store.payment_providers.map(async (next: string) => {
      const provider = paymentProviderService.retrieveProvider(next)

      const pMethods = await provider.retrieveSavedMethods(customer)
      return pMethods.map((m) => ({
        provider_id: next,
        data: m,
      }))
    })
  )

  res.json({
    payment_methods: methods.flat(),
  })
}
