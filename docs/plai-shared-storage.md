# Plai Shared Storage Direction

## Why This Changed

The backlog was stored in each browser. That meant Chrome, Brave, and GitHub
Pages could all show different backlog states. It also caused storage quota
errors after long review sessions.

Plai now has an API-first path for backlog data. When the API is running, the
workspace reads and writes backlog items through SQLite. When the API is not
available, the page falls back to the static JSON file so the demo still opens.

## Current Local Architecture

- Static app files are served from this repository.
- `server/plai-api.js` serves the workspace and exposes `/api/backlog`.
- `data/plai-workspace.sqlite` stores backlog items locally.
- `data/workspace-backlog.json` remains the seed and static fallback.
- Browser storage is still used for small interface preferences and temporary
  analytics, but it is no longer the desired source of truth for backlog work.

## What This Enables

- Chrome and Brave can share the same backlog when they use the local API URL.
- Backlog items can be created, assessed, approved, implemented, cancelled, and
  signed off without relying on one browser profile.
- Future API endpoints can use the same pattern for knowledge, brands,
  experiments, intelligence dashboards, and catalogue data.

## GitHub Pages Limitation

GitHub Pages is static hosting. It can display the Plai workspace, but it cannot
save shared data by itself. A hosted API/database is required before the public
URL becomes a true multi-user app.

## Recommended Next Step

Deploy the API and database to a small hosted service, then set the hosted
workspace to call that API. Good candidate paths:

- A simple Node API with a hosted SQLite/Postgres database.
- Supabase for Postgres-backed app data.
- Render, Railway, Fly.io, or a similar service for the API.

The game catalogue should move in the same direction so the source catalogue,
cached images, provider names, game names, and launch metadata are consistent
for every reviewer.
