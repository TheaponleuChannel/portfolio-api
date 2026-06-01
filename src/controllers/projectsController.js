const { v4: uuidv4 } = require("uuid");
const store = require("../data/store");

const getProjects = (req, res) => {
  let projects = [...store.projects];
  const { category, featured, status, search, sort = "createdAt", order = "desc" } = req.query;

  if (category) projects = projects.filter((p) => p.category === category);
  if (featured !== undefined) projects = projects.filter((p) => p.featured === (featured === "true"));
  if (status) projects = projects.filter((p) => p.status === status);
  if (search) {
    const q = search.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
    );
  }

  const validSorts = ["createdAt", "updatedAt", "title"];
  if (validSorts.includes(sort)) {
    projects.sort((a, b) => {
      const aVal = a[sort], bVal = b[sort];
      return order === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  }

  res.json({ success: true, count: projects.length, data: projects });
};

const getProject = (req, res) => {
  const project = store.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, error: { message: "Project not found." } });
  }
  res.json({ success: true, data: project });
};

const createProject = (req, res) => {
  const now = new Date().toISOString();
  const project = {
    id: uuidv4(),
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    longDescription: req.body.longDescription?.trim() || null,
    techStack: req.body.techStack,
    category: req.body.category,
    featured: req.body.featured ?? false,
    status: req.body.status || "in-progress",
    githubUrl: req.body.githubUrl || null,
    liveUrl: req.body.liveUrl || null,
    imageUrl: req.body.imageUrl || null,
    createdAt: now,
    updatedAt: now,
  };
  store.projects.unshift(project);
  res.status(201).json({ success: true, data: project, message: "Project created." });
};

const updateProject = (req, res) => {
  const idx = store.projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: { message: "Project not found." } });
  }
  const allowed = ["title", "description", "longDescription", "techStack", "category", "featured", "status", "githubUrl", "liveUrl", "imageUrl"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  store.projects[idx] = { ...store.projects[idx], ...updates, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: store.projects[idx], message: "Project updated." });
};

const deleteProject = (req, res) => {
  const idx = store.projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: { message: "Project not found." } });
  }
  store.projects.splice(idx, 1);
  res.json({ success: true, message: "Project deleted." });
};

const getFeatured = (req, res) => {
  const featured = store.projects.filter((p) => p.featured);
  res.json({ success: true, count: featured.length, data: featured });
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, getFeatured };
