/**
 * Skills Controller
 * Handles skill-related HTTP requests
 */

const skillsService = require("../services/skillsService");
const { successResponse } = require("../utils/responseFormatter");
const { RESPONSE_MESSAGES, HTTP_STATUS } = require("../constants");

/**
 * GET /skills
 * Retrieve skills with optional filters
 */
const getSkills = (req, res, next) => {
  try {
    const { category, minLevel, sortBy } = req.query;
    const filters = { category, minLevel, sortBy };
    const skills = skillsService.getSkills(filters);
    const grouped = skillsService.getGroupedByCategory();
    res.json({
      ...successResponse(skills, RESPONSE_MESSAGES.SUCCESS, HTTP_STATUS.OK),
      grouped,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /skills
 * Create a new skill
 */
const createSkill = (req, res, next) => {
  try {
    const skill = skillsService.createSkill(req.body);
    res.status(HTTP_STATUS.CREATED).json(successResponse(skill, RESPONSE_MESSAGES.CREATED_SUCCESS, HTTP_STATUS.CREATED));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /skills/:id
 * Update a skill
 */
const updateSkill = (req, res, next) => {
  try {
    const updated = skillsService.updateSkill(req.params.id, req.body);
    res.json(successResponse(updated, RESPONSE_MESSAGES.UPDATED_SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /skills/:id
 * Delete a skill
 */
const deleteSkill = (req, res, next) => {
  try {
    skillsService.deleteSkill(req.params.id);
    res.json(successResponse(null, RESPONSE_MESSAGES.DELETED_SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
