import { loadDatabaseConfig } from "../load-database-config"

describe("loadDatabaseConfig", function () {
  afterEach(() => {
    delete process.env.POSTGRES_URL
    delete process.env.PRODUCT_POSTGRES_URL
  })

  it("should return the local configuration using the environment variable", function () {
    process.env.POSTGRES_URL = "postgres://localhost:5432/medusa"
    let config = loadDatabaseConfig()

    expect(config).toEqual({
      clientUrl: process.env.POSTGRES_URL,
      driverOptions: {
        connection: {
          ssl: false,
        },
      },
      schema: "",
    })

    delete process.env.POSTGRES_URL
    process.env.PRODUCT_POSTGRES_URL = "postgres://localhost:5432/medusa"
    config = loadDatabaseConfig()

    expect(config).toEqual({
      clientUrl: process.env.PRODUCT_POSTGRES_URL,
      driverOptions: {
        connection: {
          ssl: false,
        },
      },
      schema: "",
    })
  })

  it("should return the remote configuration using the environment variable", function () {
    process.env.POSTGRES_URL = "postgres://https://test.com:5432/medusa"
    let config = loadDatabaseConfig()

    expect(config).toEqual({
      clientUrl: process.env.POSTGRES_URL,
      driverOptions: {
        connection: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      },
      schema: "",
    })

    delete process.env.POSTGRES_URL
    process.env.PRODUCT_POSTGRES_URL = "postgres://https://test.com:5432/medusa"
    config = loadDatabaseConfig()

    expect(config).toEqual({
      clientUrl: process.env.PRODUCT_POSTGRES_URL,
      driverOptions: {
        connection: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      },
      schema: "",
    })
  })

  it("should return the local configuration using the options", function () {
    process.env.POSTGRES_URL = "postgres://localhost:5432/medusa"
    const options = {
      database: {
        clientUrl: "postgres://localhost:5432/medusa-test",
      },
    }

    const config = loadDatabaseConfig(options)

    expect(config).toEqual({
      clientUrl: options.database.clientUrl,
      driverOptions: {
        connection: {
          ssl: false,
        },
      },
      schema: "",
    })
  })

  it("should return the remote configuration using the options", function () {
    process.env.POSTGRES_URL = "postgres://localhost:5432/medusa"
    const options = {
      database: {
        clientUrl: "postgres://https://test.com:5432/medusa-test",
      },
    }

    const config = loadDatabaseConfig(options)

    expect(config).toEqual({
      clientUrl: options.database.clientUrl,
      driverOptions: {
        connection: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      },
      schema: "",
    })
  })

  it("should throw if no clientUrl is provided", function () {
    let error
    try {
      loadDatabaseConfig()
    } catch (e) {
      error = e
    }

    expect(error.message).toEqual(
      "No database clientUrl provided. Please provide the clientUrl through the PRODUCT_POSTGRES_URL or POSTGRES_URL environment variable or the options object in the initialize function."
    )
  })
})
