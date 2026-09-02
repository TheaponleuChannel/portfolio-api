/**
 * Projects Repository
 * Handles projects data access operations
 */

const BaseRepository = require("./baseRepository");
const store = require("../data/store");

class ProjectsRepository extends BaseRepository {
  constructor() {
    super(store, "projects");
  }

  /**
   * Get featured projects
   * @returns {array}
   */
  getFeatured() {
    return this.findByCriteria((project) => project.featured === true);
  }

  /**
   * Get projects by category
   * @param {string} category - Category name
   * @returns {array}
   */
  getByCategory(category) {
    return this.findByCriteria((project) => project.category === category);
  }

  /**
   * Get projects by status
   * @param {string} status - Project status
   * @returns {array}
   */
  getByStatus(status) {
    return this.findByCriteria((project) => project.status === status);
  }

  /**
   * Search projects
   * @param {string} query - Search query
   * @returns {array}
   */
  search(query) {
    const lowerQuery = query.toLowerCase();
    return this.findByCriteria(
      (project) =>
        project.title.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery)
    );
  }
}

module.exports = new ProjectsRepository();
