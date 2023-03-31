import {
  moduleHelper,
  moduleLoader,
  registerModules,
} from "@medusajs/modules-sdk"
import { asValue, createContainer } from "awilix"
import express from "express"
import jwt from "jsonwebtoken"
import { MockManager } from "medusa-test-utils"
import querystring from "querystring"
import "reflect-metadata"
import supertest from "supertest"
import apiLoader from "../loaders/api"
import featureFlagLoader, { featureFlagRouter } from "../loaders/feature-flags"
import models from "../loaders/models"
import passportLoader from "../loaders/passport"
import repositories from "../loaders/repositories"
import servicesLoader from "../loaders/services"
import strategiesLoader from "../loaders/strategies"

const adminSessionOpts = {
  cookieName: "session",
  secret: "test",
}
export { adminSessionOpts }
export { clientSessionOpts }

const clientSessionOpts = {
  cookieName: "session",
  secret: "test",
}

const moduleResolutions = registerModules({})
const config = {
  projectConfig: {
    jwt_secret: "supersecret",
    cookie_secret: "superSecret",
    admin_cors: "",
    store_cors: "",
  },
}

const testApp = express()

function asArray(resolvers) {
  return {
    resolve: (container) =>
      resolvers.map((resolver) => container.build(resolver)),
  }
}

const container = createContainer()

// TODO: remove once the util is merged in master
container.registerAdd = function (name, registration) {
  const storeKey = name + "_STORE"

  if (this.registrations[storeKey] === undefined) {
    this.register(storeKey, asValue([]))
  }
  const store = this.resolve(storeKey)

  if (this.registrations[name] === undefined) {
    this.register(name, asArray(store))
  }
  store.unshift(registration)

  return this
}.bind(container)

container.register("featureFlagRouter", asValue(featureFlagRouter))
container.register("modulesHelper", asValue(moduleHelper))
container.register("configModule", asValue(config))
container.register({
  logger: asValue({
    error: () => {},
  }),
  manager: asValue(MockManager),
})

testApp.set("trust proxy", 1)
testApp.use((req, res, next) => {
  req.session = {}
  const data = req.get("Cookie")
  if (data) {
    req.session = {
      ...req.session,
      ...JSON.parse(data),
    }
  }
  next()
})

featureFlagLoader(config)
models({ container, configModule: config, isTest: true })
repositories({ container, isTest: true })
servicesLoader({ container, configModule: config })
strategiesLoader({ container, configModule: config })
passportLoader({ app: testApp, container, configModule: config })
moduleLoader({ container, moduleResolutions })

testApp.use((req, res, next) => {
  req.scope = container.createScope()
  next()
})

apiLoader({ container, app: testApp, configModule: config })

const supertestRequest = supertest(testApp)

export async function request(method, url, opts = {}) {
  const { payload, query, headers = {}, flags = [] } = opts

  flags.forEach((flag) => {
    featureFlagRouter.setFlag(flag.key, true)
  })

  const queryParams = query && querystring.stringify(query)
  const req = supertestRequest[method.toLowerCase()](
    `${url}${queryParams ? "?" + queryParams : ""}`
  )
  headers.Cookie = headers.Cookie || ""
  if (opts.adminSession) {
    const adminSession = { ...opts.adminSession }

    if (adminSession.jwt) {
      adminSession.jwt = jwt.sign(
        adminSession.jwt,
        config.projectConfig.jwt_secret,
        {
          expiresIn: "30m",
        }
      )
    }
    headers.Cookie = JSON.stringify(adminSession) || ""
  }
  if (opts.clientSession) {
    if (opts.clientSession.jwt) {
      opts.clientSession.jwt_store = jwt.sign(
        opts.clientSession.jwt,
        config.projectConfig.jwt_secret,
        {
          expiresIn: "30d",
        }
      )
    }

    headers.Cookie = JSON.stringify(opts.clientSession) || ""
  }

  for (const name in headers) {
    if ({}.hasOwnProperty.call(headers, name)) {
      req.set(name, headers[name])
    }
  }

  if (payload && !req.get("content-type")) {
    req.set("Content-Type", "application/json")
  }

  if (!req.get("accept")) {
    req.set("Accept", "application/json")
  }

  req.set("Host", "localhost")

  let res
  try {
    res = await req.send(JSON.stringify(payload))
  } catch (e) {
    if (e.response) {
      res = e.response
    } else {
      throw e
    }
  }

  // let c =
  //  res.headers["set-cookie"] && cookie.parse(res.headers["set-cookie"][0])
  // res.adminSession =
  //  c &&
  //  c[adminSessionOpts.cookieName] &&
  //  sessions.util.decode(adminSessionOpts, c[adminSessionOpts.cookieName])
  //    .content
  // res.clientSession =
  //  c &&
  //  c[clientSessionOpts.cookieName] &&
  //  sessions.util.decode(clientSessionOpts, c[clientSessionOpts.cookieName])
  //    .content
  return res
}
