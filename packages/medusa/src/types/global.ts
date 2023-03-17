import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
} from "@medusajs/modules-sdk"
import { Request } from "express"
import { MedusaContainer as coreMedusaContainer } from "medusa-core-utils"
import { LoggerOptions } from "typeorm"
import { Logger as _Logger } from "winston"
import { Customer, User } from "../models"
import { EmitOptions } from "../services/event-bus"
import { FindConfig, RequestQueryFields } from "./common"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: (User | Customer) & { customer_id?: string; userId?: string }
      scope: MedusaContainer
      validatedQuery: RequestQueryFields & Record<string, unknown>
      validatedBody: unknown
      listConfig: FindConfig<unknown>
      retrieveConfig: FindConfig<unknown>
      filterableFields: Record<string, unknown>
      allowedProperties: string[]
      includes?: Record<string, boolean>
      errors: string[]
    }
  }
}

export type ExtendedRequest<TEntity> = Request & { resource: TEntity }

export type ClassConstructor<T> = {
  new (...args: unknown[]): T
}

export type MedusaContainer = coreMedusaContainer

export type Logger = _Logger & {
  progress: (activityId: string, msg: string) => void
  info: (msg: string) => void
  warn: (msg: string) => void
}

export type Constructor<T> = new (...args: any[]) => T

type SessionOptions = {
  name?: string
  resave?: boolean
  rolling?: boolean
  saveUninitialized?: boolean
  secret?: string
  ttl?: number
}

export type ConfigModule = {
  projectConfig: {
    redis_url?: string

    /**
     * Global options passed to all `EventBusService.emit` in the core as well as your own emitters. The options are forwarded to Bull's `Queue.add` method.
     *
     * The global options can be overridden by passing options to `EventBusService.emit` directly.
     *
     * Note: This will be deprecated as we move to Event Bus module in 1.8
     *
     *
     * Example
     * ```js
     * {
     *    removeOnComplete: { age: 10 },
     * }
     * ```
     *
     * @see https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd
     */
    event_options?: Record<string, unknown> & EmitOptions

    session_options?: SessionOptions

    jwt_secret?: string
    cookie_secret?: string

    database_url?: string
    database_type: string
    database_database?: string
    database_schema?: string
    database_logging: LoggerOptions

    database_extra?: Record<string, unknown> & {
      ssl: { rejectUnauthorized: false }
    }
    store_cors?: string
    admin_cors?: string
  }
  featureFlags: Record<string, boolean | string>
  modules?: Record<
    string,
    | false
    | string
    | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
  >
  plugins: (
    | {
        resolve: string
        options: Record<string, unknown>
      }
    | string
  )[]
}
