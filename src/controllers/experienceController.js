const { v4: uuidv4 } = require("uuid");
const store = require("../data/store");

const getExperience = (req, res) => {
  const sorted = [...store.experience].sort((a, b) =>
    a.startDate < b.startDate ? 1 : -1
  );
  res.json({ success: true, count: sorted.length, data: sorted });
};

const createExperience = (req, res) => {
  const { company, role, startDate, location, description, highlights, techStack, endDate, current } = req.body;
  if (!company || !role || !startDate) {
    return res.status(422).json({ success: false, errors: ["company, role, and startDate are required."] });
  }
  const exp = {
    id: uuidv4(),
    company,
    role,
    location: location || "",
    startDate,
    endDate: current ? null : endDate || null,
    current: !!current,
    description: description || "",
    highlights: Array.isArray(highlights) ? highlights : [],
    techStack: Array.isArray(techStack) ? techStack : [],
  };
  store.experience.push(exp);
  res.status(201).json({ success: true, data: exp, message: "Experience added." });
};

const updateExperience = (req, res) => {
  const idx = store.experience.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { message: "Experience not found." } });
  const allowed = ["company", "role", "location", "startDate", "endDate", "current", "description", "highlights", "techStack"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  store.experience[idx] = { ...store.experience[idx], ...updates };
  res.json({ success: true, data: store.experience[idx], message: "Experience updated." });
};

const deleteExperience = (req, res) => {
  const idx = store.experience.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { message: "Experience not found." } });
  store.experience.splice(idx, 1);
  res.json({ success: true, message: "Experience deleted." });
};

module.exports = { getExperience, createExperience, updateExperience, deleteExperience };
