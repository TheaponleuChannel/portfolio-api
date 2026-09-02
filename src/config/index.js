/**
 * Configuration module
 * Centralizes all environment-based configuration
 */

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  apiVersion: "/api/v1",
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED !== "false",
  },
  logging: {
    format: process.env.LOG_FORMAT || "dev",
  },
};

module.exports = config;
