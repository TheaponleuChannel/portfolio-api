/**
 * Logger utility
 * Provides consistent logging across the application
 */

const config = require("../config");

const LogLevel = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

/**
 * Format log message with timestamp
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} data - Additional data
 * @returns {string}
 */
const formatLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const dataStr = Object.keys(data).length > 0 ? JSON.stringify(data) : "";
  return `[${timestamp}] [${level}] ${message} ${dataStr}`.trim();
};

const logger = {
  error: (message, data) => {
    console.error(formatLog(LogLevel.ERROR, message, data));
  },

  warn: (message, data) => {
    console.warn(formatLog(LogLevel.WARN, message, data));
  },

  info: (message, data) => {
    console.log(formatLog(LogLevel.INFO, message, data));
  },

  debug: (message, data) => {
    if (config.nodeEnv === "development") {
      console.log(formatLog(LogLevel.DEBUG, message, data));
    }
  },
};

module.exports = logger;
