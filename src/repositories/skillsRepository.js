/**
 * Skills Repository
 * Handles skills data access operations
 */

const BaseRepository = require("./baseRepository");
const store = require("../data/store");

class SkillsRepository extends BaseRepository {
  constructor() {
    super(store, "skills");
  }

  /**
   * Get skills by category
   * @param {string} category - Category name
   * @returns {array}
   */
  getByCategory(category) {
    return this.findByCriteria((skill) => skill.category === category);
  }

  /**
   * Get skills sorted by level (descending)
   * @returns {array}
   */
  getSortedByLevel() {
    const skills = this.getAll();
    return [...skills].sort((a, b) => b.level - a.level);
  }

  /**
   * Get skills above a certain level
   * @param {number} minLevel - Minimum level
   * @returns {array}
   */
  getAboveLevel(minLevel) {
    return this.findByCriteria((skill) => skill.level >= minLevel);
  }

  /**
   * Search skills by name
   * @param {string} query - Search query
   * @returns {array}
   */
  search(query) {
    const lowerQuery = query.toLowerCase();
    return this.findByCriteria((skill) => skill.name.toLowerCase().includes(lowerQuery));
  }
}

module.exports = new SkillsRepository();
