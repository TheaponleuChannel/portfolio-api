/**
 * Base Repository
 * Provides common methods and patterns for all repositories
 */

class BaseRepository {
  constructor(dataStore, entityName) {
    this.dataStore = dataStore;
    this.entityName = entityName;
  }

  /**
   * Get all items from store
   * @returns {array}
   */
  getAll() {
    return this.dataStore[this.entityName] || [];
  }

  /**
   * Get item by ID
   * @param {string} id - Item ID
   * @returns {object|null}
   */
  getById(id) {
    const items = this.getAll();
    return items.find((item) => item.id === id) || null;
  }

  /**
   * Create new item
   * @param {object} data - Item data
   * @returns {object}
   */
  create(data) {
    const items = this.getAll();
    items.push(data);
    return data;
  }

  /**
   * Update item by ID
   * @param {string} id - Item ID
   * @param {object} updates - Updated fields
   * @returns {object|null}
   */
  update(id, updates) {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    return items[index];
  }

  /**
   * Delete item by ID
   * @param {string} id - Item ID
   * @returns {boolean}
   */
  delete(id) {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) return false;

    items.splice(index, 1);
    return true;
  }

  /**
   * Find items by criteria
   * @param {function} predicate - Filter function
   * @returns {array}
   */
  findByCriteria(predicate) {
    const items = this.getAll();
    return items.filter(predicate);
  }

  /**
   * Check if item exists
   * @param {string} id - Item ID
   * @returns {boolean}
   */
  exists(id) {
    return this.getById(id) !== null;
  }
}

module.exports = BaseRepository;
