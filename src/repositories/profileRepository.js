/**
 * Profile Repository
 * Handles profile data access operations
 */

const store = require("../data/store");

class ProfileRepository {
  /**
   * Get profile
   * @returns {object}
   */
  getProfile() {
    return store.profile;
  }

  /**
   * Update profile
   * @param {object} updates - Profile updates
   * @returns {object}
   */
  updateProfile(updates) {
    store.profile = { ...store.profile, ...updates };
    return store.profile;
  }

  /**
   * Get profile field
   * @param {string} field - Field name
   * @returns {any}
   */
  getField(field) {
    return store.profile[field];
  }

  /**
   * Update profile field
   * @param {string} field - Field name
   * @param {any} value - New value
   * @returns {object}
   */
  updateField(field, value) {
    store.profile[field] = value;
    return store.profile;
  }
}

module.exports = new ProfileRepository();
