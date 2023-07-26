import { IsBoolean, IsObject, IsOptional, IsString } from "class-validator"

import { BatchJob } from "../../../../models"
import BatchJobService from "../../../../services/batch-job"
import { EntityManager } from "typeorm"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /admin/batch-jobs
 * operationId: "PostBatchJobs"
 * summary: "Create a Batch Job"
 * description: "Create a Batch Job to be executed asynchronously in the Medusa backend. If `dry_run` is set to `true`, the batch job will not be executed until the it is confirmed,
 *  which can be done using the Confirm Batch Job endpoint."
 * externalDocs:
 *   description: "How to create a batch job"
 *   url: "https://docs.medusajs.com/development/batch-jobs/create#create-batch-job"
 * x-authenticated: true
 * requestBody:
 *   content:
 *    application/json:
 *      schema:
 *        $ref: "#/components/schemas/AdminPostBatchesReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.batchJobs.create({
 *         type: 'product-export',
 *         context: {},
 *         dry_run: false
 *       }).then((({ batch_job }) => {
 *         console.log(batch_job.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST 'https://medusa-url.com/admin/batch-jobs' \
 *       -H 'Content-Type: application/json' \
 *       -H 'Authorization: Bearer {api_token}' \
 *       --data-raw '{
 *           "type": "product-export",
 *           "context": { }
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Batch Jobs
 * responses:
 *   201:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminBatchJobRes"
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
export default async (req, res) => {
  const validated = await validator(AdminPostBatchesReq, req.body)

  const batchJobService: BatchJobService = req.scope.resolve("batchJobService")

  const userId = req.user.id ?? req.user.userId

  const manager: EntityManager = req.scope.resolve("manager")
  const batch_job = await manager.transaction(async (transactionManager) => {
    const toCreate = await batchJobService
      .withTransaction(transactionManager)
      .prepareBatchJobForProcessing(validated, req)
    return await batchJobService.withTransaction(transactionManager).create({
      ...toCreate,
      created_by: userId,
    })
  })

  res.status(201).json({ batch_job })
}

/**
 * @schema AdminPostBatchesReq
 * type: object
 * required:
 *   - type
 *   - context
 * properties:
 *   type:
 *     type: string
 *     description: The type of batch job to start, which is defined by the `batchType` property of the associated batch job strategy.
 *     example: product-export
 *   context:
 *     type: object
 *     description: Additional infomration regarding the batch to be used for processing.
 *     example:
 *       shape:
 *         prices:
 *           - region: null
 *             currency_code: "eur"
 *         dynamicImageColumnCount: 4
 *         dynamicOptionColumnCount: 2
 *       list_config:
 *         skip: 0
 *         take: 50
 *         order:
 *           created_at: "DESC"
 *         relations:
 *           - variants
 *           - variant.prices
 *           - images
 *   dry_run:
 *     type: boolean
 *     description: Set a batch job in dry_run mode, which would delay executing the batch job until it's confirmed.
 *     default: false
 */
export class AdminPostBatchesReq {
  @IsString()
  type: string

  @IsObject()
  context: BatchJob["context"]

  @IsBoolean()
  @IsOptional()
  dry_run = false
}
