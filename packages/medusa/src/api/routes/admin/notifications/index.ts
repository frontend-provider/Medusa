import { Notification } from "./../../../../"
import { PaginatedResponse } from "@medusajs/types"
import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/notifications", route)

  /**
   * List notifications
   */
  route.get("/", middlewares.wrap(require("./list-notifications").default))

  /**
   * Resend a notification
   */
  route.post(
    "/:id/resend",
    middlewares.wrap(require("./resend-notification").default)
  )

  return app
}

export const defaultAdminNotificationsRelations = ["resends"]

export const defaultAdminNotificationsFields = [
  "id",
  "resource_type",
  "resource_id",
  "event_name",
  "to",
  "provider_id",
  "created_at",
  "updated_at",
]

/**
 * @schema AdminNotificationsListRes
 * type: object
 * x-expanded-relations:
 *   field: notifications
 *   relations:
 *     - resends
 * required:
 *   - notifications
 * properties:
 *   notifications:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Notification"
 *   count:
 *     type: integer
 *     description: The total number of notifications
 *   offset:
 *     type: integer
 *     description: The number of notifications skipped before these notifications
 *   limit:
 *     type: integer
 *     description: The number of notifications per page
 */
export type AdminNotificationsListRes = PaginatedResponse & {
  notifications: Notification[]
}

/**
 * @schema AdminNotificationsRes
 * type: object
 * x-expanded-relations:
 *   field: notification
 *   relations:
 *     - resends
 * required:
 *   - notification
 * properties:
 *   notification:
 *     $ref: "#/components/schemas/Notification"
 */
export type AdminNotificationsRes = {
  notification: Notification
}

export * from "./list-notifications"
export * from "./resend-notification"
