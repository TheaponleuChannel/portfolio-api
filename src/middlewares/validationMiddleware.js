/**
 * Validation middleware
 * Validates request data and passes errors to error handler
 */

const { validateContactMessage, validateProject } = require("../utils/validators");

/**
 * Contact message validation middleware
 */
const validateContactMessageMiddleware = (req, res, next) => {
  try {
    validateContactMessage(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Project validation middleware
 */
const validateProjectMiddleware = (req, res, next) => {
  try {
    validateProject(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateContactMessageMiddleware,
  validateProjectMiddleware,
};
