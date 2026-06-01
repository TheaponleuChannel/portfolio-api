const { v4: uuidv4 } = require("uuid");
const store = require("../data/store");

const getSkills = (req, res) => {
  const { category } = req.query;
  let skills = [...store.skills];
  if (category) skills = skills.filter((s) => s.category === category);

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  res.json({ success: true, count: skills.length, data: skills, grouped });
};

const createSkill = (req, res) => {
  const { name, category, level, icon } = req.body;
  if (!name || !category || level === undefined) {
    return res.status(422).json({ success: false, errors: ["name, category, and level are required."] });
  }
  if (level < 0 || level > 100) {
    return res.status(422).json({ success: false, errors: ["level must be between 0 and 100."] });
  }
  const skill = { id: uuidv4(), name, category, level: Number(level), icon: icon || name.toLowerCase() };
  store.skills.push(skill);
  res.status(201).json({ success: true, data: skill, message: "Skill added." });
};

const updateSkill = (req, res) => {
  const idx = store.skills.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { message: "Skill not found." } });
  const updates = {};
  for (const key of ["name", "category", "level", "icon"]) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  store.skills[idx] = { ...store.skills[idx], ...updates };
  res.json({ success: true, data: store.skills[idx], message: "Skill updated." });
};

const deleteSkill = (req, res) => {
  const idx = store.skills.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { message: "Skill not found." } });
  store.skills.splice(idx, 1);
  res.json({ success: true, message: "Skill deleted." });
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
