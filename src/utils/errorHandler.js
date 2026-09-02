const { HTTP_STATUS } = require("../constants");

class ApiError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        name: this.name,
        message: this.message,
        statusCode: this.statusCode,
      },
    };
  }
}

/**
 * Not Found error
 */
class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

/**
 * Validation error
 */
class ValidationError extends ApiError {
  constructor(message = "Validation failed", errors = []) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }

  toJSON() {
    return {
      success: false,
      error: {
        name: this.name,
        message: this.message,
        statusCode: this.statusCode,
        errors: this.errors,
      },
    };
  }
}

/**
 * Bad request error
 */
class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

/**
 * Conflict error
 */
class ConflictError extends ApiError {
  constructor(message = "Resource conflict") {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

module.exports = {
  ApiError,
  NotFoundError,
  ValidationError,
  BadRequestError,
  ConflictError,
};
