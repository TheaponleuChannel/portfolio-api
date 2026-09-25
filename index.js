const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const config = require("./src/config");
const { checkEnv } = require("./src/config/envCheck");
const { connectDB } = require("./src/config/db");
const { errorHandler, notFoundHandler } = require("./src/middlewares/errorMiddleware");
const { requestLogger } = require("./src/middlewares/requestLogger");

const routes = require("./src/routes");
const logger = require("./src/utils/logger");
const swaggerSpec = require("./src/swagger");

/**
 * Initialize Express app
 */
const app = express();

// ────────────────────────────────────────────────────────────────────────────
// ── Startup Env Check ───────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
checkEnv();

// ────────────────────────────────────────────────────────────────────────────
// ── Security & Parsing Middleware ───────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan(config.logging.format));

// ────────────────────────────────────────────────────────────────────────────
// ── Custom Middleware ───────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
app.use(requestLogger);

// ────────────────────────────────────────────────────────────────────────────
// ── Health Check Endpoint ───────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime().toFixed(2) + "s",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// ────────────────────────────────────────────────────────────────────────────
// ── API Documentation ───────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    name: "Portfolio API",
    version: "1.0.0",
    baseUrl: config.apiVersion,
    endpoints: {
      profile: {
        GET: `${config.apiVersion}/profile`,
        PATCH: `${config.apiVersion}/profile`,
      },
      projects: {
        GET: `${config.apiVersion}/projects`,
        POST: `${config.apiVersion}/projects`,
        "GET (featured)": `${config.apiVersion}/projects/featured`,
        "GET|PATCH|DELETE (by id)": `${config.apiVersion}/projects/:id`,
      },
      skills: {
        GET: `${config.apiVersion}/skills`,
        POST: `${config.apiVersion}/skills`,
        "PATCH|DELETE (by id)": `${config.apiVersion}/skills/:id`,
      },
      experience: {
        GET: `${config.apiVersion}/experience`,
        POST: `${config.apiVersion}/experience`,
        "PATCH|DELETE (by id)": `${config.apiVersion}/experience/:id`,
      },
      contact: {
        POST: `${config.apiVersion}/contact`,
        "GET messages": `${config.apiVersion}/contact/messages`,
        "PATCH read": `${config.apiVersion}/contact/messages/:id/read`,
        "DELETE": `${config.apiVersion}/contact/messages/:id`,
      },
    },
    documentation: {
      swagger: "/docs",
      swaggerJson: "/docs.json",
    },
  });
});

// ────────────────────────────────────────────────────────────────────────────
// ── Swagger API Documentation ───────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
if (config.swagger.enabled) {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "Portfolio API Documentation",
      customCss: ".swagger-ui .topbar { background-color: #1a1a2e; }",
      customfavIcon: "https://favicon.ico",
    })
  );
  app.get("/docs.json", (req, res) => res.json(swaggerSpec));
}

// ────────────────────────────────────────────────────────────────────────────
// ── API Routes ──────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
app.use(config.apiVersion, routes);

// ────────────────────────────────────────────────────────────────────────────
// ── MongoDB Connection ──────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
connectDB()
  .then((connected) => {
    if (connected) {
      logger.info("Project data is served from MongoDB");
    }
  })
  .catch((err) => {
    logger.error("MongoDB connection failed", { message: err.message });
    process.exit(1);
  });

// ────────────────────────────────────────────────────────────────────────────
// ── Error Handling (Must be last) ───────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ────────────────────────────────────────────────────────────────────────────
// ── Server Startup ──────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  logger.info(`🚀 Portfolio API started successfully`);
  logger.info(`Server running at ${config.appUrl}`);
  logger.info(`API Base URL: ${config.appUrl}${config.apiVersion}`);
  logger.info(`Health Check: ${config.appUrl}/health`);
  if (config.swagger.enabled) {
    logger.info(`Swagger Docs: ${config.appUrl}/docs`);
  }
  logger.info(`Environment: ${config.nodeEnv}`);
});

module.exports = app;
