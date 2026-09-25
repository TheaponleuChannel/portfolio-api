/**
 * Projects Repository (MongoDB)
 * Fetch-only data access for projects.
 */

const mongoose = require("mongoose");
const Project = require("../models/project.model");

const SORT_FIELDS = ["createdAt", "updatedAt", "title", "order"];

const parsePositiveInt = (value, fallback, max) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n <= 0) return fallback;
  return max ? Math.min(n, max) : n;
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

class ProjectsRepository {
  /**
   * Get all projects with optional filters
   * @param {object} filters - { featured, category, status, search }
   * @param {object} options - { page, limit, sortBy, sortOrder }
   * @returns {Promise<{items: array, total: number, page: number, limit: number}>}
   */
  async getAll(filters = {}, options = {}) {
    const query = {};

    if (filters.featured !== undefined) query.featured = filters.featured;
    if (filters.category) query.category = filters.category;
    if (filters.status) query.status = filters.status;

    if (filters.search) {
      const rx = new RegExp(escapeRegex(filters.search), "i");
      query.$or = [{ title: rx }, { description: rx }, { summary: rx }, { techStack: rx }];
    }

    const page = parsePositiveInt(options.page, 1);
    const limit = parsePositiveInt(options.limit, 0, 200); // 0 = no limit (keeps old behavior)

    const sortField = SORT_FIELDS.includes(options.sortBy) ? options.sortBy : "createdAt";
    const sort = { [sortField]: options.sortOrder === "asc" ? 1 : -1 };

    let mongoQuery = Project.find(query).sort(sort);
    if (limit > 0) {
      const total = await Project.countDocuments(query);
      const items = await mongoQuery.skip((page - 1) * limit).limit(limit).lean();
      return { items, total, page, limit };
    }

    const items = await mongoQuery.lean();
    return { items, total: items.length, page: 1, limit: items.length };
  }

  /**
   * Get featured projects
   * @returns {Promise<array>}
   */
  async getFeatured() {
    return Project.find({ featured: true }).sort({ order: 1, createdAt: -1 }).lean();
  }

  /**
   * Get project by ID
   * @param {string} id - Mongo ObjectId or slug
   * @returns {Promise<object|null>}
   */
  async getById(id) {
    if (!id || typeof id !== "string") return null;

    // Slug lookup (slug is lowercase in the model)
    const bySlug = await Project.findOne({ slug: id.toLowerCase() }).lean();
    if (bySlug) return bySlug;

    // ObjectId lookup
    if (mongoose.isValidObjectId(id)) {
      return Project.findById(id).lean();
    }

    return null;
  }

  /**
   * Search projects by keyword
   * @param {string} term
   * @returns {Promise<array>}
   */
  async search(term) {
    const rx = new RegExp(escapeRegex(term), "i");
    return Project.find({ $or: [{ title: rx }, { description: rx }] }).lean();
  }
}

module.exports = new ProjectsRepository();
