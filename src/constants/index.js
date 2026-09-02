/**
 * Application constants
 * Centralized constants used throughout the application
 */

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

const PROJECT_CATEGORIES = ["web", "mobile", "ai", "devops", "other"];

const SKILL_CATEGORIES = ["language", "frontend", "backend", "database", "devops", "tools"];

const RESPONSE_MESSAGES = {
  // Success messages
  SUCCESS: "Request successful",
  CREATED_SUCCESS: "Resource created successfully",
  UPDATED_SUCCESS: "Resource updated successfully",
  DELETED_SUCCESS: "Resource deleted successfully",

  // Error messages
  NOT_FOUND: "Resource not found",
  BAD_REQUEST: "Invalid request data",
  UNAUTHORIZED: "Unauthorized access",
  INTERNAL_ERROR: "Internal server error",
  VALIDATION_ERROR: "Validation failed",
};

const VALIDATION_RULES = {
  minNameLength: 2,
  minTitleLength: 3,
  minDescriptionLength: 10,
  minMessageLength: 10,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

module.exports = {
  HTTP_STATUS,
  PROJECT_CATEGORIES,
  SKILL_CATEGORIES,
  RESPONSE_MESSAGES,
  VALIDATION_RULES,
};
