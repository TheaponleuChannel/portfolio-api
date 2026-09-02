/**
 * Projects Service
 * Handles projects business logic
 */

const projectsRepository = require("../repositories/projectsRepository");
const { NotFoundError, BadRequestError } = require("../utils/errorHandler");
const { v4: uuidv4 } = require("uuid");

class ProjectsService {
  /**
   * Get all projects with optional filtering
   * @param {object} filters - Filter options { featured, category, status }
   * @returns {array}
   */
  getProjects(filters = {}) {
    let projects = projectsRepository.getAll();

    if (filters.featured) {
      projects = projects.filter((p) => p.featured === true);
    }

    if (filters.category) {
      projects = projectsRepository.getByCategory(filters.category);
    }

    if (filters.status) {
      projects = projects.filter((p) => p.status === filters.status);
    }

    return projects;
  }

  /**
   * Get featured projects
   * @returns {array}
   */
  getFeatured() {
    return projectsRepository.getFeatured();
  }

  /**
   * Get project by ID
   * @param {string} id - Project ID
   * @returns {object}
   */
  getProject(id) {
    const project = projectsRepository.getById(id);
    if (!project) {
      throw new NotFoundError("Project not found");
    }
    return project;
  }

  /**
   * Create new project
   * @param {object} data - Project data
   * @returns {object}
   */
  createProject(data) {
    const projectData = {
      id: uuidv4(),
      ...data,
      featured: data.featured || false,
      status: data.status || "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return projectsRepository.create(projectData);
  }

  /**
   * Update project
   * @param {string} id - Project ID
   * @param {object} updates - Updated fields
   * @returns {object}
   */
  updateProject(id, updates) {
    if (!projectsRepository.exists(id)) {
      throw new NotFoundError("Project not found");
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new BadRequestError("No fields provided for update");
    }

    updates.updatedAt = new Date().toISOString();
    const updated = projectsRepository.update(id, updates);

    return updated;
  }

  /**
   * Delete project
   * @param {string} id - Project ID
   * @returns {boolean}
   */
  deleteProject(id) {
    if (!projectsRepository.exists(id)) {
      throw new NotFoundError("Project not found");
    }

    return projectsRepository.delete(id);
  }

  /**
   * Search projects
   * @param {string} query - Search query
   * @returns {array}
   */
  searchProjects(query) {
    if (!query || query.trim().length === 0) {
      return projectsRepository.getAll();
    }

    return projectsRepository.search(query);
  }

  /**
   * Get projects statistics
   * @returns {object}
   */
  getStatistics() {
    const projects = projectsRepository.getAll();
    return {
      total: projects.length,
      featured: projects.filter((p) => p.featured).length,
      completed: projects.filter((p) => p.status === "completed").length,
      inProgress: projects.filter((p) => p.status === "in-progress").length,
      byCategory: {
        web: projects.filter((p) => p.category === "web").length,
        mobile: projects.filter((p) => p.category === "mobile").length,
        ai: projects.filter((p) => p.category === "ai").length,
        devops: projects.filter((p) => p.category === "devops").length,
        other: projects.filter((p) => p.category === "other").length,
      },
    };
  }
}

module.exports = new ProjectsService();
