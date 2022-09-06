import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."

import { AddressPayload } from "../../../../types/common"
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /customers/me/addresses/{address_id}
 * operationId: PostCustomersCustomerAddressesAddress
 * summary: "Update a Shipping Address"
 * description: "Updates a Customer's saved Shipping Address."
 * x-authenticated: true
 * parameters:
 *   - (path) address_id=* {String} The id of the Address to update.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         anyOf:
 *           - $ref: "#/components/schemas/address"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged
 *       medusa.customers.addresses.updateAddress(address_id, {
 *         first_name: 'Gina'
 *       })
 *       .then(({ customer }) => {
 *         console.log(customer.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/customers/me/addresses/{address_id}' \
 *       --header 'Cookie: connect.sid={sid}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "first_name": "Gina"
 *       }'
 * security:
 *   - cookie_auth: []
 * tags:
 *   - Customer
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            customer:
 *              $ref: "#/components/schemas/customer"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const id = req.user.customer_id
  const { address_id } = req.params

  const validated = await validator(
    StorePostCustomersCustomerAddressesAddressReq,
    req.body
  )

  const customerService: CustomerService = req.scope.resolve(
    "customerService"
  ) as CustomerService

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await customerService
      .withTransaction(transactionManager)
      .updateAddress(id, address_id, validated)
  })

  const customer = await customerService.retrieve(id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })

  res.json({ customer })
}

export class StorePostCustomersCustomerAddressesAddressReq extends AddressPayload {}
