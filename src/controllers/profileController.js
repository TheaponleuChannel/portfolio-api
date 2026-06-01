const store = require("../data/store");

const getProfile = (req, res) => {
  res.json({ success: true, data: store.profile });
};

const updateProfile = (req, res) => {
  const allowed = ["name", "title", "bio", "email", "location", "avatar", "social"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ success: false, error: { message: "No valid fields provided." } });
  }

  store.profile = { ...store.profile, ...updates };
  res.json({ success: true, data: store.profile, message: "Profile updated." });
};

module.exports = { getProfile, updateProfile };
