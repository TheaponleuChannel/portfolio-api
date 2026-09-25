const swaggerJsdoc = require("swagger-jsdoc");
const { appUrl } = require("./config");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio API",
      version: "1.0.0",
      description: "A RESTful API for a developer portfolio — manage projects, skills, experience, and contact messages.",
      contact: { name: "Alex Johnson", email: "alex@example.com" },
    },
    servers: [
      { url: `${appUrl}/api/v1`, description: "Production (Render)" },
      { url: "/api/v1", description: "Same-origin / local development" },
    ],
    tags: [
      { name: "Profile", description: "Portfolio owner profile" },
      { name: "Projects", description: "Portfolio projects" },
      { name: "Skills", description: "Technical skills" },
      { name: "Experience", description: "Work experience" },
      { name: "Contact", description: "Contact messages" },
    ],
    components: {
      schemas: {
        Profile: {
          type: "object",
          properties: {
            id:       { type: "string", format: "uuid" },
            name:     { type: "string", example: "Alex Johnson" },
            title:    { type: "string", example: "Full Stack Developer" },
            bio:      { type: "string" },
            email:    { type: "string", format: "email" },
            location: { type: "string", example: "San Francisco, CA" },
            avatar:   { type: "string", format: "uri" },
            social: {
              type: "object",
              properties: {
                github:   { type: "string", format: "uri" },
                linkedin: { type: "string", format: "uri" },
                twitter:  { type: "string", format: "uri" },
              },
            },
          },
        },
        Project: {
          type: "object",
          properties: {
            id:              { type: "string", format: "uuid" },
            title:           { type: "string", example: "E-Commerce Platform" },
            description:     { type: "string" },
            longDescription: { type: "string", nullable: true },
            techStack:       { type: "array", items: { type: "string" }, example: ["React", "Node.js"] },
            category:        { type: "string", enum: ["web", "mobile", "ai", "devops", "other"] },
            featured:        { type: "boolean" },
            status:          { type: "string", enum: ["completed", "in-progress"] },
            githubUrl:       { type: "string", format: "uri", nullable: true },
            liveUrl:         { type: "string", format: "uri", nullable: true },
            imageUrl:        { type: "string", format: "uri", nullable: true },
            createdAt:       { type: "string", format: "date-time" },
            updatedAt:       { type: "string", format: "date-time" },
          },
        },
        ProjectInput: {
          type: "object",
          required: ["title", "description", "techStack", "category"],
          properties: {
            title:           { type: "string", minLength: 3, example: "My App" },
            description:     { type: "string", minLength: 10, example: "A great application." },
            longDescription: { type: "string", nullable: true },
            techStack:       { type: "array", items: { type: "string" }, example: ["React", "Node.js"] },
            category:        { type: "string", enum: ["web", "mobile", "ai", "devops", "other"] },
            featured:        { type: "boolean", default: false },
            status:          { type: "string", enum: ["completed", "in-progress"], default: "in-progress" },
            githubUrl:       { type: "string", format: "uri", nullable: true },
            liveUrl:         { type: "string", format: "uri", nullable: true },
            imageUrl:        { type: "string", format: "uri", nullable: true },
          },
        },
        Skill: {
          type: "object",
          properties: {
            id:       { type: "string", format: "uuid" },
            name:     { type: "string", example: "React" },
            category: { type: "string", enum: ["language", "frontend", "backend", "database", "devops"] },
            level:    { type: "integer", minimum: 0, maximum: 100, example: 90 },
            icon:     { type: "string", example: "react" },
          },
        },
        SkillInput: {
          type: "object",
          required: ["name", "category", "level"],
          properties: {
            name:     { type: "string", example: "React" },
            category: { type: "string", enum: ["language", "frontend", "backend", "database", "devops"] },
            level:    { type: "integer", minimum: 0, maximum: 100, example: 90 },
            icon:     { type: "string", example: "react" },
          },
        },
        Experience: {
          type: "object",
          properties: {
            id:          { type: "string", format: "uuid" },
            company:     { type: "string", example: "TechCorp Inc." },
            role:        { type: "string", example: "Senior Full Stack Developer" },
            location:    { type: "string", example: "San Francisco, CA" },
            startDate:   { type: "string", example: "2022-03" },
            endDate:     { type: "string", nullable: true, example: null },
            current:     { type: "boolean" },
            description: { type: "string" },
            highlights:  { type: "array", items: { type: "string" } },
            techStack:   { type: "array", items: { type: "string" } },
          },
        },
        ExperienceInput: {
          type: "object",
          required: ["company", "role", "startDate"],
          properties: {
            company:     { type: "string", example: "TechCorp Inc." },
            role:        { type: "string", example: "Senior Developer" },
            location:    { type: "string", example: "Remote" },
            startDate:   { type: "string", example: "2023-01" },
            endDate:     { type: "string", nullable: true },
            current:     { type: "boolean", default: false },
            description: { type: "string" },
            highlights:  { type: "array", items: { type: "string" } },
            techStack:   { type: "array", items: { type: "string" } },
          },
        },
        Message: {
          type: "object",
          properties: {
            id:        { type: "string", format: "uuid" },
            name:      { type: "string", example: "Jane Doe" },
            email:     { type: "string", format: "email" },
            subject:   { type: "string" },
            message:   { type: "string" },
            read:      { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        MessageInput: {
          type: "object",
          required: ["name", "email", "message"],
          properties: {
            name:    { type: "string", minLength: 2, example: "Jane Doe" },
            email:   { type: "string", format: "email", example: "jane@example.com" },
            subject: { type: "string", example: "Hello!" },
            message: { type: "string", minLength: 10, example: "I love your portfolio!" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: { message: { type: "string" } },
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            errors:  { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    paths: {
      // ── Profile ──────────────────────────────────────────────────────────
      "/profile": {
        get: {
          tags: ["Profile"],
          summary: "Get profile",
          responses: {
            200: { description: "Profile data", content: { "application/json": { schema: { properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Profile" } } } } } },
          },
        },
        patch: {
          tags: ["Profile"],
          summary: "Update profile",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Profile" } } } },
          responses: {
            200: { description: "Updated profile" },
            400: { description: "No valid fields", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ── Projects ──────────────────────────────────────────────────────────
      "/projects": {
        get: {
          tags: ["Projects"],
          summary: "List all projects",
          parameters: [
            { name: "category", in: "query", schema: { type: "string", enum: ["web", "mobile", "ai", "devops", "other"] } },
            { name: "featured", in: "query", schema: { type: "boolean" } },
            { name: "status",   in: "query", schema: { type: "string", enum: ["completed", "in-progress"] } },
            { name: "search",   in: "query", schema: { type: "string" }, description: "Search title, description, or tech stack" },
            { name: "sort",     in: "query", schema: { type: "string", enum: ["createdAt", "updatedAt", "title"], default: "createdAt" } },
            { name: "order",    in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } },
          ],
          responses: {
            200: { description: "List of projects", content: { "application/json": { schema: { properties: { success: { type: "boolean" }, count: { type: "integer" }, data: { type: "array", items: { $ref: "#/components/schemas/Project" } } } } } } },
          },
        },
        post: {
          tags: ["Projects"],
          summary: "Create a project",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProjectInput" } } } },
          responses: {
            201: { description: "Project created" },
            422: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } } } },
          },
        },
      },
      "/projects/featured": {
        get: {
          tags: ["Projects"],
          summary: "Get featured projects",
          responses: {
            200: { description: "Featured projects" },
          },
        },
      },
      "/projects/{id}": {
        get: {
          tags: ["Projects"],
          summary: "Get a project by ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: { description: "Project data" },
            404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        patch: {
          tags: ["Projects"],
          summary: "Update a project",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProjectInput" } } } },
          responses: {
            200: { description: "Updated project" },
            404: { description: "Not found" },
          },
        },
        delete: {
          tags: ["Projects"],
          summary: "Delete a project",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: { description: "Deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            404: { description: "Not found" },
          },
        },
      },

      // ── Skills ────────────────────────────────────────────────────────────
      "/skills": {
        get: {
          tags: ["Skills"],
          summary: "List all skills",
          parameters: [
            { name: "category", in: "query", schema: { type: "string", enum: ["language", "frontend", "backend", "database", "devops"] } },
          ],
          responses: {
            200: { description: "Skills list grouped by category" },
          },
        },
        post: {
          tags: ["Skills"],
          summary: "Add a skill",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SkillInput" } } } },
          responses: {
            201: { description: "Skill added" },
            422: { description: "Validation error" },
          },
        },
      },
      "/skills/{id}": {
        patch: {
          tags: ["Skills"],
          summary: "Update a skill",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SkillInput" } } } },
          responses: { 200: { description: "Updated" }, 404: { description: "Not found" } },
        },
        delete: {
          tags: ["Skills"],
          summary: "Delete a skill",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
        },
      },

      // ── Experience ────────────────────────────────────────────────────────
      "/experience": {
        get: {
          tags: ["Experience"],
          summary: "List all experience entries",
          responses: { 200: { description: "Experience list (newest first)" } },
        },
        post: {
          tags: ["Experience"],
          summary: "Add an experience entry",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ExperienceInput" } } } },
          responses: { 201: { description: "Experience added" }, 422: { description: "Validation error" } },
        },
      },
      "/experience/{id}": {
        patch: {
          tags: ["Experience"],
          summary: "Update an experience entry",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ExperienceInput" } } } },
          responses: { 200: { description: "Updated" }, 404: { description: "Not found" } },
        },
        delete: {
          tags: ["Experience"],
          summary: "Delete an experience entry",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
        },
      },

      // ── Contact ───────────────────────────────────────────────────────────
      "/contact": {
        post: {
          tags: ["Contact"],
          summary: "Send a contact message",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MessageInput" } } } },
          responses: {
            201: { description: "Message sent" },
            422: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } } } },
          },
        },
      },
      "/contact/messages": {
        get: {
          tags: ["Contact"],
          summary: "List received messages",
          parameters: [{ name: "read", in: "query", schema: { type: "boolean" }, description: "Filter by read status" }],
          responses: { 200: { description: "Messages list" } },
        },
      },
      "/contact/messages/{id}/read": {
        patch: {
          tags: ["Contact"],
          summary: "Mark a message as read",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: { 200: { description: "Marked as read" }, 404: { description: "Not found" } },
        },
      },
      "/contact/messages/{id}": {
        delete: {
          tags: ["Contact"],
          summary: "Delete a message",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);