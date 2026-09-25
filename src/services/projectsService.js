/**
 * Projects Service (MongoDB)
 * Fetch-only business logic for projects.
 */

const projectsRepository = require("../repositories/projectsRepository");
const { NotFoundError, BadRequestError } = require("../utils/errorHandler");
const { isConnected } = require("../config/db");

class ProjectsService {
  /**
   * Guard: projects endpoints require MongoDB
   */
  requireDb() {
    if (!isConnected()) {
      throw new BadRequestError("Database not connected — set MONGODB_URI in your env file");
    }
  }

  /**
   * Get all projects with optional filtering and pagination
   * @param {object} filters - { featured, category, status, search }
   * @param {object} options - { page, limit, sortBy, sortOrder }
   * @returns {Promise<{items: array, total: number, page: number, limit: number}>}
   */
  async getProjects(filters = {}, options = {}) {
    this.requireDb();
    return projectsRepository.getAll(filters, options);
  }

  /**
   * Get featured projects
   * @returns {Promise<array>}
   */
  async getFeatured() {
    this.requireDb();
    return projectsRepository.getFeatured();
  }

  /**
   * Get project by ID (or slug)
   * @param {string} id
   * @returns {Promise<object>}
   */
  async getProject(id) {
    this.requireDb();

    const project = await projectsRepository.getById(id);
    if (!project) {
      throw new NotFoundError("Project not found");
    }
    return project;
  }

  /**
   * Search projects
   * @param {string} query
   * @returns {Promise<array>}
   */
  async searchProjects(query) {
    this.requireDb();

    if (!query || query.trim().length === 0) {
      const { items } = await projectsRepository.getAll();
      return items;
    }

    return projectsRepository.search(query);
  }
}

module.exports = new ProjectsService();
