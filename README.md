# Plai Workspace

Plai is a workspace for shaping, reviewing, and launching branded gaming site
concepts. The current launch deliverable is the casino concept site, with
markets, brands, knowledge, components, experiments, intelligence, automation,
and backlog managed from the Plai workspace.

## Running Locally

For the shared workspace mode, run:

```bash
npm start
```

Then open:

```text
http://localhost:4173/
```

This starts the Plai workspace and a small local API. The backlog is stored in:

```text
data/plai-workspace.sqlite
```

The SQLite database is ignored by Git so local working data is not accidentally
published. If the database does not exist, it is seeded from:

```text
data/workspace-backlog.json
```

## GitHub Pages

The GitHub Pages version is useful for viewing the static concept:

```text
https://plai-os.github.io/plai/
```

GitHub Pages cannot write to a shared database, so it falls back to the static
backlog JSON and browser-only draft changes. Use the local API mode above when
you need backlog updates to persist across browsers.

## Current Direction

- Backlog storage is moving from browser storage to a shared API/database.
- Knowledge, component requirements, experiments, and intelligence dashboards
  should follow the same pattern.
- The game catalogue should also move behind an API so source harvesting,
  cached metadata, provider names, game names, and images are consistent.
- Browser storage should be treated as a short-term cache only, not as the
  source of truth.

## Browser Extension

The original prototype can still be loaded as an unpacked extension:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select this folder.

The strategic direction is now the Plai workspace as its own app, with the site
as a launch deliverable rather than the whole product.
