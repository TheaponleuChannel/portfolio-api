/**
 * Error handling middleware
 * Catches and formats all application errors
 */

const config = require("../config");
const { ApiError } = require("../utils/errorHandler");
const { HTTP_STATUS } = require("../constants");

/**
 * Global error handler middleware
 * Should be the last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
  // Default error response
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errors = [];

  // Handle API errors
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || [];
  } else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Handle JSON parse errors
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = "Invalid JSON format";
  } else {
    // Generic error handling
    message = err.message || message;
    if (config.nodeEnv === "development") {
      console.error(err);
    }
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  });
};

/**
 * 404 Not Found handler
 * Should be placed before the error handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    `Route not found: ${req.method} ${req.originalUrl}`,
    HTTP_STATUS.NOT_FOUND
  );
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
