/**
 * Environment check
 * Runs at boot and logs missing/misconfigured env vars so misconfigurations
 * are immediately obvious in deploy logs (e.g. on Render) instead of
 * surfacing as confusing runtime errors.
 */

const fs = require("fs");
const path = require("path");
const config = require("./index");
const logger = require("../utils/logger");

const checkEnv = () => {
  // Report where configuration came from
  const envFile = `.env.${config.nodeEnv}`;
  const envFilePath = path.join(__dirname, "..", "..", envFile);
  const fromDisk = fs.existsSync(envFilePath);

  logger.info(
    fromDisk
      ? `Config: loaded ${envFile} from disk`
      : `Config: no ${envFile} file on disk — using platform environment variables`
  );

  // Critical: projects endpoints require MongoDB
  if (!config.mongo.uri) {
    logger.error(
      "MONGODB_URI is not set — projects endpoints will fail with 'Database not connected'. " +
        "Set it in your env file or hosting dashboard (e.g. Render → Environment)."
    );
  }

  // Production-specific warnings
  if (config.nodeEnv === "production") {
    if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === "*") {
      logger.warn(
        'CORS_ORIGIN is unrestricted ("*") — any website can call this API. ' +
          "Set it to your frontend URL(s) in production."
      );
    }
    if (config.swagger.enabled) {
      logger.warn(
        "SWAGGER_ENABLED is true — API docs are publicly exposed at /docs. " +
          "Set SWAGGER_ENABLED=false to hide them in production."
      );
    }
  }
};

module.exports = { checkEnv };
