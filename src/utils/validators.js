const { VALIDATION_RULES, PROJECT_CATEGORIES } = require("../constants");
const { ValidationError } = require("./errorHandler");

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  return VALIDATION_RULES.emailRegex.test(email);
};

/**
 * Validate string length
 * @param {string} str - String to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean}
 */
const isValidLength = (str, minLength = 1) => {
  return typeof str === "string" && str.trim().length >= minLength;
};

/**
 * Validate contact message
 * @param {object} body - Request body
 * @throws {ValidationError}
 */
const validateContactMessage = (body) => {
  const { name, email, message } = body;
  const errors = [];

  if (!isValidLength(name, VALIDATION_RULES.minNameLength)) {
    errors.push(`Name must be at least ${VALIDATION_RULES.minNameLength} characters.`);
  }

  if (!email || !isValidEmail(email)) {
    errors.push("A valid email is required.");
  }

  if (!isValidLength(message, VALIDATION_RULES.minMessageLength)) {
    errors.push(`Message must be at least ${VALIDATION_RULES.minMessageLength} characters.`);
  }

  if (errors.length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};

/**
 * Validate project data
 * @param {object} body - Request body
 * @throws {ValidationError}
 */
const validateProject = (body) => {
  const { title, description, techStack, category } = body;
  const errors = [];

  if (!isValidLength(title, VALIDATION_RULES.minTitleLength)) {
    errors.push(`Title must be at least ${VALIDATION_RULES.minTitleLength} characters.`);
  }

  if (!isValidLength(description, VALIDATION_RULES.minDescriptionLength)) {
    errors.push(`Description must be at least ${VALIDATION_RULES.minDescriptionLength} characters.`);
  }

  if (!Array.isArray(techStack) || techStack.length === 0) {
    errors.push("techStack must be a non-empty array.");
  }

  if (!category || !PROJECT_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${PROJECT_CATEGORIES.join(", ")}.`);
  }

  if (errors.length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
};

/**
 * Validate ID format (UUID)
 * @param {string} id - ID to validate
 * @returns {boolean}
 */
const isValidUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

module.exports = {
  isValidEmail,
  isValidLength,
  isValidUUID,
  validateContactMessage,
  validateProject,
};
