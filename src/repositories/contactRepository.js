const BaseRepository = require("./baseRepository");
const store = require("../data/store");

class ContactRepository extends BaseRepository {
  constructor() {
    super(store, "messages");
    // Initialize messages array if it doesn't exist
    if (!store.messages) {
      store.messages = [];
    }
  }

  /**
   * Get unread messages
   * @returns {array}
   */
  getUnread() {
    return this.findByCriteria((msg) => msg.read === false);
  }

  /**
   * Mark message as read
   * @param {string} id - Message ID
   * @returns {object|null}
   */
  markAsRead(id) {
    return this.update(id, { read: true });
  }

  /**
   * Get message with details
   * @param {string} id - Message ID
   * @returns {object|null}
   */
  getDetail(id) {
    return this.getById(id);
  }

  /**
   * Get messages by email
   * @param {string} email - Email address
   * @returns {array}
   */
  getByEmail(email) {
    return this.findByCriteria((msg) => msg.email.toLowerCase() === email.toLowerCase());
  }
}

module.exports = new ContactRepository();
