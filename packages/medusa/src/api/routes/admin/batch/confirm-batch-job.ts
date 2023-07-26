import { BatchJobService } from "../../../../services"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /admin/batch-jobs/{id}/confirm
 * operationId: "PostBatchJobsBatchJobConfirmProcessing"
 * summary: "Confirm a Batch Job"
 * description: "When a batch job is created, it is not executed automatically if `dry_run` is set to `true`. This endpoint confirms that the batch job should be executed."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the batch job.
 * x-codegen:
 *   method: confirm
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.batchJobs.confirm(batchJobId)
 *       .then(({ batch_job }) => {
 *         console.log(batch_job.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST 'https://medusa-url.com/admin/batch-jobs/{id}/confirm' \
 *       -H 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Batch Jobs
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/AdminBatchJobRes"
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
  let batch_job = req.batch_job

  const batchJobService: BatchJobService = req.scope.resolve("batchJobService")
  const manager: EntityManager = req.scope.resolve("manager")
  batch_job = await manager.transaction(async (transactionManager) => {
    return await batchJobService
      .withTransaction(transactionManager)
      .confirm(batch_job)
  })

  res.json({ batch_job })
}
