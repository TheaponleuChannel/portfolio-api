/**
 * Experience Controller
 * Handles experience-related HTTP requests
 */

const experienceService = require("../services/experienceService");
const { successResponse } = require("../utils/responseFormatter");
const { RESPONSE_MESSAGES, HTTP_STATUS } = require("../constants");

/**
 * GET /experience
 * Retrieve experience entries
 */
const getExperience = (req, res, next) => {
  try {
    const { company, sortBy } = req.query;
    const filters = { company, sortBy: sortBy || "date" };
    const experience = experienceService.getExperience(filters);
    res.json(successResponse(experience, RESPONSE_MESSAGES.SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /experience
 * Create a new experience entry
 */
const createExperience = (req, res, next) => {
  try {
    const experience = experienceService.createExperience(req.body);
    res.status(HTTP_STATUS.CREATED).json(successResponse(experience, RESPONSE_MESSAGES.CREATED_SUCCESS, HTTP_STATUS.CREATED));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /experience/:id
 * Update an experience entry
 */
const updateExperience = (req, res, next) => {
  try {
    const updated = experienceService.updateExperience(req.params.id, req.body);
    res.json(successResponse(updated, RESPONSE_MESSAGES.UPDATED_SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /experience/:id
 * Delete an experience entry
 */
const deleteExperience = (req, res, next) => {
  try {
    experienceService.deleteExperience(req.params.id);
    res.json(successResponse(null, RESPONSE_MESSAGES.DELETED_SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

module.exports = { getExperience, createExperience, updateExperience, deleteExperience };
