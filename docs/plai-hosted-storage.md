# Plai Hosted Storage

Plai is moving from a single-browser prototype into a shared workspace. GitHub Pages can host the static interface, but shared workspace data needs an API and database so backlog items, knowledge documents, experiments and dashboards are not tied to one browser.

## Current Entry Points

- `plai.html` is the main workspace entry point.
- `index.html` redirects to `plai.html`.
- `impossible.html` remains as a compatibility redirect while old links are still in circulation.

## Backlog Storage

The backlog now has a server-side API:

- `GET /api/backlog` lists backlog items.
- `POST /api/backlog` creates a backlog item.
- `PATCH /api/backlog/:id` updates a backlog item.
- `DELETE /api/backlog/:id` deletes a backlog item.

The API uses SQLite for local development and can use Postgres in production when `DATABASE_URL` or `POSTGRES_URL` is provided. The repository file `data/workspace-backlog.json` remains as the seed and fallback so backlog content is not lost during migration.

## Deployment Shape

GitHub Pages can serve the static workspace. A hosted API should sit beside it on a service such as Render, Railway or Fly.

Once the API is hosted, set the API base in `plai-config.js`:

```js
const configuredApiBase = "https://your-plai-api.example.com";
```

Until that value is set, the static page falls back to repository data and local behaviour where needed.

## Storage Roadmap

Backlog storage is the first shared-data path. The same API pattern should be extended to:

- Knowledge documents and requirement rows.
- Market and brand configuration.
- Component definitions.
- Experiment setup and results.
- Intelligence dashboards.
- Game catalogue metadata and image source mapping.

## Intelligent Inheritance Model

Plai should support controlled inheritance rather than one-off page edits:

- Global Base: common components, validation rules, content standards, design tokens, behaviours and analytics.
- Brand Layer: brand identity, tone, visual assets, templates and brand-specific component styling.
- Market / Regulation Layer: jurisdiction rules, KYC, age gates, safer gambling, payments, legal content and consent.
- Site / Product Layer: product journeys, page layouts, feature configuration and site-specific content.
- Experiment / Audience Layer: A/B tests, personalisation, audience-specific variations and temporary overrides.

Knowledge documents should remain human-readable and writable. Where structure helps, they can later be paired with YAML so Plai can generate implementation prompts and validation checks without requiring a business analyst, developer, tester or data analyst in the loop.
