const profileService = require("../services/profileService");
const { successResponse } = require("../utils/responseFormatter");
const { RESPONSE_MESSAGES, HTTP_STATUS } = require("../constants");

/**
 * GET /profile
 * Retrieve the profile
 */
const getProfile = (req, res, next) => {
  try {
    const profile = profileService.getProfile();
    res.json(successResponse(profile, RESPONSE_MESSAGES.SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /profile
 * Update the profile
 */
const updateProfile = (req, res, next) => {
  try {
    const updatedProfile = profileService.updateProfile(req.body);
    res.json(successResponse(updatedProfile, RESPONSE_MESSAGES.UPDATED_SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
