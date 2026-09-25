# Render Deployment Guide — portfolio-api

Deploy your Express API to Render's free tier with continuous deployment from GitHub.

> **Status: DEPLOYED** ✅ — Live at `https://portfolio-api-jgpt.onrender.com`
>
> ⚠️ **Current issue:** the database is not connected. `MONGODB_URI` is not set in Render's dashboard — the app boots but projects endpoints return `"Database not connected"`. Fix: Render dashboard → your service → **Environment** → add `MONGODB_URI` with your Atlas connection string → **Save** (service redeploys automatically). Atlas Network Access must allow `0.0.0.0/0`.

## Prerequisites

- Code pushed to a GitHub/GitLab repo (Render connects to it)
- MongoDB Atlas cluster running (you already have one)

## Step 1 — Push your code to GitHub

```bash
git remote add origin https://github.com/<you>/portfolio-api.git
git push -u origin master
```

(If you already have a remote, just `git push`.)

## Step 2 — Prepare Atlas for Render

Render's free tier uses dynamic outbound IPs, so Atlas must allow all IPs:

1. Atlas dashboard → **Network Access** → **+ ADD IP ADDRESS**
2. Enter `0.0.0.0/0` and confirm

Without this, Render's servers can't reach your database.

## Step 3 — Create the service on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → sign in with GitHub
2. **New +** → **Web Service**
3. **Connect** your `portfolio-api` repository
4. Fill in:
   | Setting | Value |
   |---|---|
   | Name | `portfolio-api` (or anything) |
   | Region | closest to your users |
   | Branch | `master` |
   | Runtime | **Node** |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | **Free** |
5. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://<user>:<pass>@cluster0.e8krvhe.mongodb.net/portfolio-api-prod?retryWrites=true&w=majority` |
   | `CORS_ORIGIN` | your frontend URL(s), comma-separated (or `*` for now) |
   | `SWAGGER_ENABLED` | `true` (optional) |
   | `LOG_FORMAT` | leave unset → defaults to `combined` in production |

   > **Note:** Render injects its own `PORT` env var automatically — your app already reads `process.env.PORT`, so no need to set it. Your config only loads `.env.production` from disk, which won't exist on Render — dotenv silently skips it and uses the dashboard vars instead. No code changes needed.

6. Click **Create Web Service** — first deploy takes ~2–3 min

## Step 4 — Verify

Live at `https://portfolio-api-jgpt.onrender.com`:

```bash
curl https://portfolio-api-jgpt.onrender.com/health
curl https://portfolio-api-jgpt.onrender.com/api/v1/projects
```

If `/api/v1/projects` returns `"Database not connected"`, `MONGODB_URI` is missing from the dashboard env vars (or Atlas is blocking the connection).

## Free tier limitations

- **Spins down** after 15 minutes idle → first request after idle takes ~50s to wake
- 750 hours/month free (enough for one always-on-ish service)
- No static outbound IPs (hence the `0.0.0.0/0` Atlas rule)
- Upgrade to Starter ($7/mo) for always-on + faster response + optional static IPs

## Continuous deployment

Every `git push` to `master` triggers automatic rebuild + deploy. To disable, toggle "Auto-Deploy" off in service settings.
