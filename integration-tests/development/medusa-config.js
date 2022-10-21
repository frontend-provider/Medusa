const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

module.exports = {
  plugins: [
    {
      resolve: `./packages/medusa-payment-stripe`,
      options: {
        api_key: "api_key",
        webhook_secret: "api_key",
      },
    },
  ],
  projectConfig: {
    redis_url: process.env.REDIS_URL,
    database_url: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
    database_type: "postgres",
    jwt_secret: "test",
    cookie_secret: "test",
  },
}
