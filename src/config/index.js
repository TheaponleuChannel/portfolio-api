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
  // Public base URL of the API (Render URL in production, localhost in dev).
  // Override with PUBLIC_URL if the app is served behind a custom domain.
  appUrl: process.env.PUBLIC_URL || (nodeEnv === "production" ? "https://portfolio-api-jgpt.onrender.com" : `http://localhost:${process.env.PORT || 3000}`),
  mongo: {
    uri: process.env.MONGODB_URI,
  },
  apiVersion: "/api/v1",
  cors: {
    // Comma-separated origins (e.g. "https://mysite.com,https://www.mysite.com")
    origin: (process.env.CORS_ORIGIN || "*").split(",").map((o) => o.trim()).filter(Boolean),
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
