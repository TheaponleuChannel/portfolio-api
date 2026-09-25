/**
 * Projects Controller (MongoDB)
 * Read-only handlers for project-related HTTP requests
 */

const projectsService = require("../services/projectsService");
const { successResponse } = require("../utils/responseFormatter");
const { HTTP_STATUS, RESPONSE_MESSAGES } = require("../constants");

/**
 * GET /projects
 * Retrieve projects with optional filters
 */
const getProjects = async (req, res, next) => {
  try {
    const { category, featured, status, search, page, limit, sortBy, sortOrder } = req.query;
    const filters = { category, status };

    if (featured !== undefined) filters.featured = featured === "true";
    if (search) filters.search = search;

    const result = await projectsService.getProjects(filters, { page, limit, sortBy, sortOrder });

    res.json({
      success: true,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: result.limit > 0 ? Math.ceil(result.total / result.limit) : 1,
        hasMore: result.limit > 0 ? result.page * result.limit < result.total : false,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /projects/featured
 * Retrieve featured projects
 */
const getFeatured = async (req, res, next) => {
  try {
    const featured = await projectsService.getFeatured();
    res.json(successResponse(featured, RESPONSE_MESSAGES.SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /projects/:id
 * Supports both Mongo _id and slug
 */
const getProject = async (req, res, next) => {
  try {
    const project = await projectsService.getProject(req.params.id);
    res.json(successResponse(project, RESPONSE_MESSAGES.SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, getFeatured, getProject };
