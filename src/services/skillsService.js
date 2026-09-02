/**
 * Skills Service
 * Handles skills business logic
 */

const skillsRepository = require("../repositories/skillsRepository");
const { NotFoundError, BadRequestError } = require("../utils/errorHandler");
const { v4: uuidv4 } = require("uuid");

class SkillsService {
  /**
   * Get all skills with optional filtering
   * @param {object} filters - Filter options { category, minLevel, sortBy }
   * @returns {array}
   */
  getSkills(filters = {}) {
    let skills = skillsRepository.getAll();

    if (filters.category) {
      skills = skillsRepository.getByCategory(filters.category);
    }

    if (filters.minLevel) {
      skills = skillsRepository.getAboveLevel(parseInt(filters.minLevel));
    }

    if (filters.sortBy === "level") {
      skills = skillsRepository.getSortedByLevel();
    }

    return skills;
  }

  /**
   * Get skill by ID
   * @param {string} id - Skill ID
   * @returns {object}
   */
  getSkill(id) {
    const skill = skillsRepository.getById(id);
    if (!skill) {
      throw new NotFoundError("Skill not found");
    }
    return skill;
  }

  /**
   * Create new skill
   * @param {object} data - Skill data
   * @returns {object}
   */
  createSkill(data) {
    if (!data.name || data.name.trim().length === 0) {
      throw new BadRequestError("Skill name is required");
    }

    if (data.level && (data.level < 0 || data.level > 100)) {
      throw new BadRequestError("Skill level must be between 0 and 100");
    }

    const skillData = {
      id: uuidv4(),
      ...data,
      level: data.level || 50,
      createdAt: new Date().toISOString(),
    };

    return skillsRepository.create(skillData);
  }

  /**
   * Update skill
   * @param {string} id - Skill ID
   * @param {object} updates - Updated fields
   * @returns {object}
   */
  updateSkill(id, updates) {
    if (!skillsRepository.exists(id)) {
      throw new NotFoundError("Skill not found");
    }

    if (updates.level && (updates.level < 0 || updates.level > 100)) {
      throw new BadRequestError("Skill level must be between 0 and 100");
    }

    const updated = skillsRepository.update(id, updates);
    return updated;
  }

  /**
   * Delete skill
   * @param {string} id - Skill ID
   * @returns {boolean}
   */
  deleteSkill(id) {
    if (!skillsRepository.exists(id)) {
      throw new NotFoundError("Skill not found");
    }

    return skillsRepository.delete(id);
  }

  /**
   * Search skills
   * @param {string} query - Search query
   * @returns {array}
   */
  searchSkills(query) {
    if (!query || query.trim().length === 0) {
      return skillsRepository.getAll();
    }

    return skillsRepository.search(query);
  }

  /**
   * Get skills grouped by category
   * @returns {object}
   */
  getGroupedByCategory() {
    const skills = skillsRepository.getAll();
    const grouped = {};

    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });

    return grouped;
  }
}

module.exports = new SkillsService();
