
const { HTTP_STATUS, RESPONSE_MESSAGES } = require("../constants");

/**
 * Format successful response
 * @param {any} data - Response data
 * @param {string} message - Response message
 * @param {number} statusCode - HTTP status code
 * @returns {object} Formatted response
 */
const successResponse = (data, message = RESPONSE_MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {array} errors - Array of detailed errors
 * @returns {object} Formatted error response
 */
const errorResponse = (
  message = RESPONSE_MESSAGES.INTERNAL_ERROR,
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors = []
) => {
  return {
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
  };
};

/**
 * Format paginated response
 * @param {array} data - Response data
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {string} message - Response message
 * @returns {object} Formatted paginated response
 */
const paginatedResponse = (
  data,
  total,
  page,
  limit,
  message = RESPONSE_MESSAGES.SUCCESS
) => {
  return {
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};
