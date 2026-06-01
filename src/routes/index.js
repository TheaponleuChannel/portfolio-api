const router = require("express").Router();
const profile = require("../controllers/profileController");
const projects = require("../controllers/projectsController");
const skills = require("../controllers/skillsController");
const experience = require("../controllers/experienceController");
const contact = require("../controllers/contactController");
const { validateMessage, validateProject } = require("../middleware");

// ── Profile ────────────────────────────────────────────────────────────────
router.get("/profile", profile.getProfile);
router.patch("/profile", profile.updateProfile);

// ── Projects ───────────────────────────────────────────────────────────────
router.get("/projects", projects.getProjects);
router.get("/projects/featured", projects.getFeatured);
router.get("/projects/:id", projects.getProject);
router.post("/projects", validateProject, projects.createProject);
router.patch("/projects/:id", projects.updateProject);
router.delete("/projects/:id", projects.deleteProject);

// ── Skills ─────────────────────────────────────────────────────────────────
router.get("/skills", skills.getSkills);
router.post("/skills", skills.createSkill);
router.patch("/skills/:id", skills.updateSkill);
router.delete("/skills/:id", skills.deleteSkill);

// ── Experience ─────────────────────────────────────────────────────────────
router.get("/experience", experience.getExperience);
router.post("/experience", experience.createExperience);
router.patch("/experience/:id", experience.updateExperience);
router.delete("/experience/:id", experience.deleteExperience);

// ── Contact ────────────────────────────────────────────────────────────────
router.get("/contact/messages", contact.getMessages);
router.post("/contact", validateMessage, contact.createMessage);
router.patch("/contact/messages/:id/read", contact.markRead);
router.delete("/contact/messages/:id", contact.deleteMessage);

module.exports = router;
