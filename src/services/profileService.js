/**
 * Profile Service
 * Handles profile business logic
 */

const profileRepository = require("../repositories/profileRepository");
const { NotFoundError, BadRequestError } = require("../utils/errorHandler");

class ProfileService {
  /**
   * Get profile with additional processing
   * @returns {object}
   */
  getProfile() {
    const profile = profileRepository.getProfile();
    if (!profile) {
      throw new NotFoundError("Profile not found");
    }
    return profile;
  }

  /**
   * Update profile with validation
   * @param {object} updates - Profile updates
   * @returns {object}
   */
  updateProfile(updates) {
    if (!updates || Object.keys(updates).length === 0) {
      throw new BadRequestError("No valid fields provided for update");
    }

    const allowedFields = ["name", "title", "bio", "email", "location", "avatar", "social"];
    const filteredUpdates = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      throw new BadRequestError("No valid fields provided for update");
    }

    const updatedProfile = profileRepository.updateProfile(filteredUpdates);
    return updatedProfile;
  }

  /**
   * Validate profile data
   * @param {object} profile - Profile data to validate
   * @returns {boolean}
   */
  validateProfileData(profile) {
    if (!profile.name || typeof profile.name !== "string") {
      throw new BadRequestError("Valid name is required");
    }

    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      throw new BadRequestError("Valid email format is required");
    }

    return true;
  }

  /**
   * Get profile summary (limited fields)
   * @returns {object}
   */
  getProfileSummary() {
    const profile = this.getProfile();
    const { id, name, title, avatar, email, social } = profile;
    return { id, name, title, avatar, email, social };
  }
}

module.exports = new ProfileService();
