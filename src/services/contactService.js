/**
 * Contact Service
 * Handles contact/messaging business logic
 */

const contactRepository = require("../repositories/contactRepository");
const { NotFoundError } = require("../utils/errorHandler");
const { v4: uuidv4 } = require("uuid");

class ContactService {
  /**
   * Get all contact messages
   * @param {object} filters - Filter options { unreadOnly }
   * @returns {array}
   */
  getMessages(filters = {}) {
    if (filters.unreadOnly) {
      return contactRepository.getUnread();
    }

    return contactRepository.getAll();
  }

  /**
   * Get message by ID
   * @param {string} id - Message ID
   * @returns {object}
   */
  getMessage(id) {
    const message = contactRepository.getById(id);
    if (!message) {
      throw new NotFoundError("Message not found");
    }
    return message;
  }

  /**
   * Create new contact message
   * @param {object} data - Message data { name, email, message }
   * @returns {object}
   */
  createMessage(data) {
    const messageData = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      message: data.message,
      subject: data.subject || "New Contact Message",
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return contactRepository.create(messageData);
  }

  /**
   * Mark message as read
   * @param {string} id - Message ID
   * @returns {object}
   */
  markMessageAsRead(id) {
    if (!contactRepository.exists(id)) {
      throw new NotFoundError("Message not found");
    }

    const updated = contactRepository.markAsRead(id);
    return updated;
  }

  /**
   * Delete message
   * @param {string} id - Message ID
   * @returns {boolean}
   */
  deleteMessage(id) {
    if (!contactRepository.exists(id)) {
      throw new NotFoundError("Message not found");
    }

    return contactRepository.delete(id);
  }

  /**
   * Get unread message count
   * @returns {number}
   */
  getUnreadCount() {
    return contactRepository.getUnread().length;
  }

  /**
   * Get contact statistics
   * @returns {object}
   */
  getStatistics() {
    const all = contactRepository.getAll();
    const unread = contactRepository.getUnread();

    return {
      total: all.length,
      unread: unread.length,
      read: all.length - unread.length,
    };
  }

  /**
   * Search messages
   * @param {string} query - Search query
   * @returns {array}
   */
  searchMessages(query) {
    if (!query || query.trim().length === 0) {
      return contactRepository.getAll();
    }

    const lowerQuery = query.toLowerCase();
    return contactRepository.findByCriteria(
      (msg) =>
        msg.name.toLowerCase().includes(lowerQuery) ||
        msg.email.toLowerCase().includes(lowerQuery) ||
        msg.message.toLowerCase().includes(lowerQuery)
    );
  }
}

module.exports = new ContactService();
