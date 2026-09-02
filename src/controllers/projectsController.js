/**
 * Projects Controller
 * Handles project-related HTTP requests
 */

const projectsService = require("../services/projectsService");
const { successResponse } = require("../utils/responseFormatter");
const { RESPONSE_MESSAGES, HTTP_STATUS } = require("../constants");

/**
 * GET /projects
 * Retrieve projects with optional filters
 */
const getProjects = (req, res, next) => {
  try {
    const { category, featured, status, search } = req.query;
    const filters = { category, status };

    if (featured !== undefined) filters.featured = featured === "true";

    let projects = projectsService.getProjects(filters);

    if (search) {
      projects = projectsService.searchProjects(search);
    }

    res.json(successResponse(projects, RESPONSE_MESSAGES.SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /projects/featured
 * Retrieve featured projects
 */
const getFeatured = (req, res, next) => {
  try {
    const featured = projectsService.getFeatured();
    res.json(successResponse(featured, RESPONSE_MESSAGES.SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /projects/:id
 * Retrieve a single project by ID
 */
const getProject = (req, res, next) => {
  try {
    const project = projectsService.getProject(req.params.id);
    res.json(successResponse(project, RESPONSE_MESSAGES.SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /projects
 * Create a new project
 */
const createProject = (req, res, next) => {
  try {
    const project = projectsService.createProject(req.body);
    res.status(HTTP_STATUS.CREATED).json(successResponse(project, RESPONSE_MESSAGES.CREATED_SUCCESS, HTTP_STATUS.CREATED));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /projects/:id
 * Update a project
 */
const updateProject = (req, res, next) => {
  try {
    const updated = projectsService.updateProject(req.params.id, req.body);
    res.json(successResponse(updated, RESPONSE_MESSAGES.UPDATED_SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /projects/:id
 * Delete a project
 */
const deleteProject = (req, res, next) => {
  try {
    projectsService.deleteProject(req.params.id);
    res.json(successResponse(null, RESPONSE_MESSAGES.DELETED_SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, getFeatured };
