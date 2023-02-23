import { IsObject, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"

import { CustomerGroupService } from "../../../../services"
import { EntityManager } from "typeorm"
import { FindParams } from "../../../../types/common"
import { defaultAdminCustomerGroupsRelations } from "."
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/customer-groups/{id}
 * operationId: "PostCustomerGroupsGroup"
 * summary: "Update a Customer Group"
 * description: "Update a CustomerGroup."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the customer group.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostCustomerGroupsGroupReq"
 * x-codegen:
 *   method: update
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.customerGroups.update(customer_group_id, {
 *         name: 'VIP'
 *       })
 *       .then(({ customer_group }) => {
 *         console.log(customer_group.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/customer-groups/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "VIP"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Customer Groups
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCustomerGroupsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const validatedBody = await validator(
    AdminPostCustomerGroupsGroupReq,
    req.body
  )
  const validatedQuery = await validator(FindParams, req.query)

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await customerGroupService
      .withTransaction(transactionManager)
      .update(id, validatedBody)
  })

  let expandFields: string[] = []
  if (validatedQuery.expand) {
    expandFields = validatedQuery.expand.split(",")
  }

  const findConfig = {
    relations: expandFields.length
      ? expandFields
      : defaultAdminCustomerGroupsRelations,
  }

  const customerGroup = await customerGroupService.retrieve(id, findConfig)

  res.json({ customer_group: customerGroup })
}

/**
 * @schema AdminPostCustomerGroupsGroupReq
 * type: object
 * properties:
 *   name:
 *     description: "Name of the customer group"
 *     type: string
 *   metadata:
 *     description: "Metadata for the customer."
 *     type: object
 */
export class AdminPostCustomerGroupsGroupReq {
  @IsString()
  @IsOptional()
  name?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
