/**
 * Experience Repository
 * Handles experience data access operations
 */

const BaseRepository = require("./baseRepository");
const store = require("../data/store");

class ExperienceRepository extends BaseRepository {
  constructor() {
    super(store, "experience");
  }

  /**
   * Get experience sorted by date (newest first)
   * @returns {array}
   */
  getChronological() {
    const items = this.getAll();
    return [...items].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }

  /**
   * Get experience at specific company
   * @param {string} company - Company name
   * @returns {array}
   */
  getByCompany(company) {
    return this.findByCriteria((exp) => exp.company.toLowerCase() === company.toLowerCase());
  }

  /**
   * Get current/ongoing experience
   * @returns {array}
   */
  getCurrent() {
    return this.findByCriteria((exp) => !exp.endDate || exp.isCurrent === true);
  }
}

module.exports = new ExperienceRepository();
