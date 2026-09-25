# Portfolio API

A RESTful API for a developer portfolio built with **Express.js** and **Node.js**.

## Quick Start

```bash
npm install
npm start         # production
npm run dev       # development (Node.js 18+ watch mode)
```

Server runs at `http://localhost:3000`. Change the port with `PORT=8080 npm start`.

---

## Base URL

| Environment | URL |
|---|---|
| Production | `https://portfolio-api-jgpt.onrender.com/api/v1` |
| Local dev | `http://localhost:3000/api/v1` |

---

## Endpoints

### 🧑 Profile
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/profile` | Get portfolio owner profile |
| PATCH | `/profile` | Update profile fields |

### 📁 Projects
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/projects` | List all projects (filterable) |
| GET | `/projects/featured` | Get featured projects |
| GET | `/projects/:id` | Get a single project |
| POST | `/projects` | Create a project |
| PATCH | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project |

**Query params:** `?category=web|mobile|ai|devops|other`, `?featured=true|false`, `?status=completed|in-progress`, `?search=keyword`, `?sort=createdAt|title`, `?order=asc|desc`

### 🛠 Skills
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/skills` | List all skills (grouped by category) |
| POST | `/skills` | Add a skill |
| PATCH | `/skills/:id` | Update a skill |
| DELETE | `/skills/:id` | Delete a skill |

**Query params:** `?category=language|frontend|backend|database|devops`

### 💼 Experience
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/experience` | List all experience (newest first) |
| POST | `/experience` | Add an experience entry |
| PATCH | `/experience/:id` | Update an experience entry |
| DELETE | `/experience/:id` | Delete an experience entry |

### 📬 Contact
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/contact` | Submit a contact message |
| GET | `/contact/messages` | List received messages |
| PATCH | `/contact/messages/:id/read` | Mark message as read |
| DELETE | `/contact/messages/:id` | Delete a message |

**Query params:** `?read=true|false`

---

## Example Requests

```bash
# Get profile
curl http://localhost:3000/api/v1/profile

# Get featured web projects
curl "http://localhost:3000/api/v1/projects?featured=true&category=web"

# Search projects
curl "http://localhost:3000/api/v1/projects?search=react"

# Create a project
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My App",
    "description": "A great application.",
    "techStack": ["React", "Node.js"],
    "category": "web"
  }'

# Send a contact message
curl -X POST http://localhost:3000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "I love your portfolio!"
  }'
```

---

## Response Format

All responses follow this shape:

```json
{
  "success": true,
  "data": { ... },
  "count": 4,
  "message": "Optional status message"
}
```

Errors return:

```json
{
  "success": false,
  "error": { "message": "Description of what went wrong" }
}
```

---

## Project Structure

```
portfolio-api/
├── index.js                  # App entry point
├── src/
│   ├── data/
│   │   └── store.js          # In-memory data store with seed data
│   ├── controllers/
│   │   ├── profileController.js
│   │   ├── projectsController.js
│   │   ├── skillsController.js
│   │   ├── experienceController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   └── index.js          # Error handler + validators
│   └── routes/
│       └── index.js          # Route definitions
└── package.json
```

> **Note:** Projects are stored in **MongoDB** (configured via `MONGODB_URI`). Other entities (profile, skills, experience, contact) use an in-memory store and reset on restart. Projects endpoints are **read-only** (fetch-only) — create/update/delete are not exposed.

---

## Deployment

Hosted on **Render** — live at `https://portfolio-api-jgpt.onrender.com`.

See [DEPLOY.md](DEPLOY.md) for the full deployment guide (Atlas network access, env vars, free-tier notes).
