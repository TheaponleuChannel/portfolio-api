/**
 * Contact Controller
 * Handles contact/messaging-related HTTP requests
 */

const contactService = require("../services/contactService");
const { successResponse } = require("../utils/responseFormatter");
const { RESPONSE_MESSAGES, HTTP_STATUS } = require("../constants");

/**
 * GET /contact/messages
 * Retrieve contact messages
 */
const getMessages = (req, res, next) => {
  try {
    const { unreadOnly } = req.query;
    const filters = { unreadOnly: unreadOnly === "true" };
    const messages = contactService.getMessages(filters);
    res.json(successResponse(messages, RESPONSE_MESSAGES.SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /contact
 * Create a new contact message
 */
const createMessage = (req, res, next) => {
  try {
    const message = contactService.createMessage(req.body);
    res.status(HTTP_STATUS.CREATED).json(successResponse(message, RESPONSE_MESSAGES.CREATED_SUCCESS, HTTP_STATUS.CREATED));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /contact/messages/:id/read
 * Mark a message as read
 */
const markRead = (req, res, next) => {
  try {
    const message = contactService.markMessageAsRead(req.params.id);
    res.json(successResponse(message, RESPONSE_MESSAGES.UPDATED_SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /contact/messages/:id
 * Delete a message
 */
const deleteMessage = (req, res, next) => {
  try {
    contactService.deleteMessage(req.params.id);
    res.json(successResponse(null, RESPONSE_MESSAGES.DELETED_SUCCESS, HTTP_STATUS.OK));
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, createMessage, markRead, deleteMessage };
