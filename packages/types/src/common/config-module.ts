import { LoggerOptions } from "typeorm"
import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
} from "../modules-sdk"

type SessionOptions = {
  name?: string
  resave?: boolean
  rolling?: boolean
  saveUninitialized?: boolean
  secret?: string
  ttl?: number
}

export type HttpCompressionOptions = {
  enabled?: boolean
  level?: number
  memLevel?: number
  threshold?: number | string
}

export type ProjectConfigOptions = {
  redis_url?: string

  session_options?: SessionOptions

  jwt_secret?: string
  cookie_secret?: string

  database_url?: string
  database_type: string
  database_database?: string
  database_schema?: string
  database_logging: LoggerOptions

  http_compression?: HttpCompressionOptions

  database_extra?: Record<string, unknown> & {
    ssl: { rejectUnauthorized: false }
  }
  store_cors?: string
  admin_cors?: string
}

export type ConfigModule = {
  projectConfig: ProjectConfigOptions
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
