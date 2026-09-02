const router = require("express").Router();

const profileController = require("../controllers/profileController");
const projectsController = require("../controllers/projectsController");
const skillsController = require("../controllers/skillsController");
const experienceController = require("../controllers/experienceController");
const contactController = require("../controllers/contactController");

// Import middleware
const { validateContactMessageMiddleware, validateProjectMiddleware } = require("../middlewares/validationMiddleware");

// ────────────────────────────────────────────────────────────────────────────
// ── Profile Routes ──────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
router.get("/profile", profileController.getProfile);
router.patch("/profile", profileController.updateProfile);

// ────────────────────────────────────────────────────────────────────────────
// ── Projects Routes ─────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
router.get("/projects", projectsController.getProjects);
router.get("/projects/featured", projectsController.getFeatured);
router.get("/projects/:id", projectsController.getProject);
router.post("/projects", validateProjectMiddleware, projectsController.createProject);
router.patch("/projects/:id", projectsController.updateProject);
router.delete("/projects/:id", projectsController.deleteProject);

// ────────────────────────────────────────────────────────────────────────────
// ── Skills Routes ───────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
router.get("/skills", skillsController.getSkills);
router.post("/skills", skillsController.createSkill);
router.patch("/skills/:id", skillsController.updateSkill);
router.delete("/skills/:id", skillsController.deleteSkill);

// ────────────────────────────────────────────────────────────────────────────
// ── Experience Routes ───────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
router.get("/experience", experienceController.getExperience);
router.post("/experience", experienceController.createExperience);
router.patch("/experience/:id", experienceController.updateExperience);
router.delete("/experience/:id", experienceController.deleteExperience);

// ────────────────────────────────────────────────────────────────────────────
// ── Contact Routes ──────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
router.get("/contact/messages", contactController.getMessages);
router.post("/contact", validateContactMessageMiddleware, contactController.createMessage);
router.patch("/contact/messages/:id/read", contactController.markRead);
router.delete("/contact/messages/:id", contactController.deleteMessage);

module.exports = router;
