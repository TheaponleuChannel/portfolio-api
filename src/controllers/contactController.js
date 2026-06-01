const { v4: uuidv4 } = require("uuid");
const store = require("../data/store");

const getMessages = (req, res) => {
  const { read } = req.query;
  let messages = [...store.messages].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  if (read !== undefined) messages = messages.filter((m) => m.read === (read === "true"));
  res.json({ success: true, count: messages.length, data: messages });
};

const createMessage = (req, res) => {
  const { name, email, subject, message } = req.body;
  const msg = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject?.trim() || "No Subject",
    message: message.trim(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  store.messages.unshift(msg);
  res.status(201).json({ success: true, data: msg, message: "Message sent successfully." });
};

const markRead = (req, res) => {
  const idx = store.messages.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { message: "Message not found." } });
  store.messages[idx].read = true;
  res.json({ success: true, data: store.messages[idx], message: "Marked as read." });
};

const deleteMessage = (req, res) => {
  const idx = store.messages.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { message: "Message not found." } });
  store.messages.splice(idx, 1);
  res.json({ success: true, message: "Message deleted." });
};

module.exports = { getMessages, createMessage, markRead, deleteMessage };
