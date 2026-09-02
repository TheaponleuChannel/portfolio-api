/**
 * Request logging middleware
 * Logs incoming requests (can be extended for more detailed logging)
 */

const logger = require("../utils/logger");

/**
 * Request logger middleware
 * Logs request details (optional, Morgan is already used in index.js)
 */
const requestLogger = (req, res, next) => {
  const { method, path, ip } = req;
  logger.debug(`${method} ${path}`, { ip });

  res.on("finish", () => {
    logger.debug(`${method} ${path} - ${res.statusCode}`, { ip });
  });

  next();
};

module.exports = {
  requestLogger,
};
