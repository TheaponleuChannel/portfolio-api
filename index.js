const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/swagger");
const routes = require("./src/routes");
const { notFound, errorHandler } = require("./src/middleware");

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = "/api/v1";

// ── Core Middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// ── Health Check ──────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime().toFixed(2) + "s",
    timestamp: new Date().toISOString(),
  });
});

// ── API Docs (inline) ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    name: "Portfolio API",
    version: "1.0.0",
    baseUrl: API_VERSION,
    endpoints: {
      profile:    { GET: `${API_VERSION}/profile`,                  PATCH: `${API_VERSION}/profile` },
      projects:   { GET: `${API_VERSION}/projects`,                 POST: `${API_VERSION}/projects`,
                    "GET (featured)": `${API_VERSION}/projects/featured`,
                    "GET|PATCH|DELETE (by id)": `${API_VERSION}/projects/:id` },
      skills:     { GET: `${API_VERSION}/skills`,                   POST: `${API_VERSION}/skills`,
                    "PATCH|DELETE (by id)": `${API_VERSION}/skills/:id` },
      experience: { GET: `${API_VERSION}/experience`,               POST: `${API_VERSION}/experience`,
                    "PATCH|DELETE (by id)": `${API_VERSION}/experience/:id` },
      contact:    { POST: `${API_VERSION}/contact`,
                    "GET messages": `${API_VERSION}/contact/messages`,
                    "PATCH read": `${API_VERSION}/contact/messages/:id/read`,
                    "DELETE": `${API_VERSION}/contact/messages/:id` },
    },
    queryParams: {
      projects: "?category=web|mobile|ai|devops|other  &featured=true|false  &status=completed|in-progress  &search=keyword  &sort=createdAt|title  &order=asc|desc",
      skills: "?category=language|frontend|backend|database|devops",
      contact: "?read=true|false",
    },
  });
});

// ── Swagger UI ────────────────────────────────────────────────────────────
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Portfolio API Docs",
  customCss: ".swagger-ui .topbar { background-color: #1a1a2e; }",
}));
app.get("/docs.json", (req, res) => res.json(swaggerSpec));

// ── Routes ────────────────────────────────────────────────────────────────
app.use(API_VERSION, routes);

// ── Error Handling ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀  Portfolio API running on http://localhost:${PORT}`);
  console.log(`📖  Docs:          http://localhost:${PORT}/`);
  console.log(`❤️   Health:        http://localhost:${PORT}/health`);
  console.log(`🔗  Base URL:      http://localhost:${PORT}${API_VERSION}\n`);
});

module.exports = app;
