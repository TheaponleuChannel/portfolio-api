/**
 * Experience Service
 * Handles experience business logic
 */

const experienceRepository = require("../repositories/experienceRepository");
const { NotFoundError, BadRequestError } = require("../utils/errorHandler");
const { v4: uuidv4 } = require("uuid");

class ExperienceService {
  /**
   * Get all experience entries
   * @param {object} filters - Filter options { company, sortBy }
   * @returns {array}
   */
  getExperience(filters = {}) {
    let experience = experienceRepository.getAll();

    if (filters.company) {
      experience = experienceRepository.getByCompany(filters.company);
    }

    if (filters.sortBy === "date") {
      experience = experienceRepository.getChronological();
    }

    return experience;
  }

  /**
   * Get experience entry by ID
   * @param {string} id - Experience ID
   * @returns {object}
   */
  getExperienceEntry(id) {
    const entry = experienceRepository.getById(id);
    if (!entry) {
      throw new NotFoundError("Experience entry not found");
    }
    return entry;
  }

  /**
   * Create new experience entry
   * @param {object} data - Experience data
   * @returns {object}
   */
  createExperience(data) {
    if (!data.company || data.company.trim().length === 0) {
      throw new BadRequestError("Company name is required");
    }

    if (!data.position || data.position.trim().length === 0) {
      throw new BadRequestError("Position is required");
    }

    const experienceData = {
      id: uuidv4(),
      ...data,
      isCurrent: data.endDate ? false : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return experienceRepository.create(experienceData);
  }

  /**
   * Update experience entry
   * @param {string} id - Experience ID
   * @param {object} updates - Updated fields
   * @returns {object}
   */
  updateExperience(id, updates) {
    if (!experienceRepository.exists(id)) {
      throw new NotFoundError("Experience entry not found");
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new BadRequestError("No fields provided for update");
    }

    updates.updatedAt = new Date().toISOString();
    const updated = experienceRepository.update(id, updates);

    return updated;
  }

  /**
   * Delete experience entry
   * @param {string} id - Experience ID
   * @returns {boolean}
   */
  deleteExperience(id) {
    if (!experienceRepository.exists(id)) {
      throw new NotFoundError("Experience entry not found");
    }

    return experienceRepository.delete(id);
  }

  /**
   * Get current/ongoing experience
   * @returns {array}
   */
  getCurrentExperience() {
    return experienceRepository.getCurrent();
  }

  /**
   * Get experience summary (statistics)
   * @returns {object}
   */
  getExperienceSummary() {
    const all = experienceRepository.getAll();
    return {
      total: all.length,
      current: all.filter((e) => !e.endDate || e.isCurrent).length,
      companies: [...new Set(all.map((e) => e.company))].length,
    };
  }
}

module.exports = new ExperienceService();
