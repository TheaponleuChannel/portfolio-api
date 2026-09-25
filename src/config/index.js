/**
 * Configuration module
 * Centralizes all environment-based configuration.
 *
 * Env file chosen by NODE_ENV (set in the npm scripts):
 *   development -> .env.development
 *   production  -> .env.production
 */

const path = require("path");
const nodeEnv = process.env.NODE_ENV || "development";

require("dotenv").config({ path: path.join(__dirname, "..", "..", `.env.${nodeEnv}`) });

const config = {
  nodeEnv,
  port: process.env.PORT || 3000,
  mongo: {
    uri: process.env.MONGODB_URI,
  },
  apiVersion: "/api/v1",
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED !== "false",
  },
  logging: {
    // dev: concise; production: Apache combined-style access logs
    format: process.env.LOG_FORMAT || (nodeEnv === "production" ? "combined" : "dev"),
  },
};

module.exports = config;
