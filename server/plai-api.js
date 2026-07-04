import { createServer } from "node:http";
import { existsSync, mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, "..");
const DATA_DIR = join(ROOT_DIR, "data");
const DB_PATH = join(DATA_DIR, "plai-workspace.sqlite");
const SEED_PATH = join(DATA_DIR, "workspace-backlog.json");
const PORT = Number(process.env.PORT || 4173);

mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS backlog_items (
    id INTEGER PRIMARY KEY,
    area TEXT DEFAULT 'Unassessed',
    item TEXT NOT NULL,
    priority TEXT DEFAULT '',
    status TEXT DEFAULT 'Unassessed',
    source TEXT DEFAULT 'Human',
    effort TEXT DEFAULT '',
    detail TEXT DEFAULT '',
    benefit TEXT DEFAULT '',
    implementationNote TEXT DEFAULT '',
    auditTrail TEXT DEFAULT '[]',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

await seedBacklogIfEmpty();

createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") {
      sendJson(response, 204, {});
      return;
    }

    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (url.pathname === "/api/health") {
      sendJson(response, 200, { ok: true, storage: "sqlite" });
      return;
    }

    if (url.pathname === "/api/backlog" && request.method === "GET") {
      sendJson(response, 200, { items: readBacklogItems() });
      return;
    }

    if (url.pathname === "/api/backlog" && request.method === "POST") {
      const body = await readJsonBody(request);
      const item = createBacklogItem(body);
      sendJson(response, 201, { item });
      return;
    }

    const backlogMatch = url.pathname.match(/^\/api\/backlog\/([^/]+)$/);
    if (backlogMatch && request.method === "PATCH") {
      const id = Number(decodeURIComponent(backlogMatch[1]));
      const body = await readJsonBody(request);
      const item = updateBacklogItem(id, body);
      if (!item) sendJson(response, 404, { error: "Backlog item not found" });
      else sendJson(response, 200, { item });
      return;
    }

    if (backlogMatch && request.method === "DELETE") {
      const id = Number(decodeURIComponent(backlogMatch[1]));
      deleteBacklogItem(id);
      sendJson(response, 200, { ok: true });
      return;
    }

    await serveStatic(url.pathname, response);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Plai API error" });
  }
}).listen(PORT, () => {
  console.log(`Plai workspace running at http://localhost:${PORT}/`);
});

async function seedBacklogIfEmpty() {
  const count = db.prepare("SELECT COUNT(*) AS count FROM backlog_items").get().count;
  if (count || !existsSync(SEED_PATH)) return;

  const payload = JSON.parse(await readFile(SEED_PATH, "utf8"));
  const items = Array.isArray(payload.items) ? payload.items : [];
  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT INTO backlog_items (
      id, area, item, priority, status, source, effort, detail, benefit,
      implementationNote, auditTrail, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  try {
    for (const item of items) {
      insert.run(
        Number(item.id),
        item.area || "Unassessed",
        item.item || "Untitled backlog item",
        item.priority || "",
        item.status || "Unassessed",
        item.source || "Human",
        item.effort || "",
        item.detail || "",
        item.benefit || "",
        item.implementationNote || "",
        JSON.stringify(Array.isArray(item.auditTrail) ? item.auditTrail : []),
        item.createdAt || now,
        item.updatedAt || now
      );
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function readBacklogItems() {
  return db.prepare("SELECT * FROM backlog_items ORDER BY id").all().map(hydrateBacklogItem);
}

function createBacklogItem(body) {
  const now = new Date().toISOString();
  const nextId = db.prepare("SELECT COALESCE(MAX(id), 0) + 1 AS id FROM backlog_items").get().id;
  const itemText = String(body?.item || body?.description || "").trim();
  const auditTrail = [{
    at: now,
    action: "Created",
    actor: body?.source || "Human",
    from: "",
    to: body?.status || "Unassessed",
    note: "Created from the workspace backlog form."
  }];

  db.prepare(`
    INSERT INTO backlog_items (
      id, area, item, priority, status, source, effort, detail, benefit,
      implementationNote, auditTrail, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    nextId,
    body?.area || "Unassessed",
    itemText || "Untitled backlog item",
    body?.priority || "",
    body?.status || "Unassessed",
    body?.source || "Human",
    body?.effort || "",
    body?.detail || "",
    body?.benefit || "",
    body?.implementationNote || "",
    JSON.stringify(auditTrail),
    now,
    now
  );

  return getBacklogItem(nextId);
}

function updateBacklogItem(id, patch) {
  const current = getBacklogItem(id);
  if (!current) return null;
  const now = new Date().toISOString();
  const next = {
    ...current,
    ...normaliseBacklogPatch(patch),
    updatedAt: now
  };

  db.prepare(`
    UPDATE backlog_items
    SET area = ?, item = ?, priority = ?, status = ?, source = ?, effort = ?,
      detail = ?, benefit = ?, implementationNote = ?, auditTrail = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    next.area || "Unassessed",
    next.item || "Untitled backlog item",
    next.priority || "",
    next.status || "Unassessed",
    next.source || "Human",
    next.effort || "",
    next.detail || "",
    next.benefit || "",
    next.implementationNote || "",
    JSON.stringify(Array.isArray(next.auditTrail) ? next.auditTrail : []),
    now,
    id
  );

  return getBacklogItem(id);
}

function deleteBacklogItem(id) {
  db.prepare("DELETE FROM backlog_items WHERE id = ?").run(id);
}

function getBacklogItem(id) {
  const row = db.prepare("SELECT * FROM backlog_items WHERE id = ?").get(id);
  return row ? hydrateBacklogItem(row) : null;
}

function hydrateBacklogItem(row) {
  let auditTrail = [];
  try {
    auditTrail = JSON.parse(row.auditTrail || "[]");
  } catch {
    auditTrail = [];
  }
  return {
    ...row,
    auditTrail
  };
}

function normaliseBacklogPatch(patch) {
  const next = { ...patch };
  if (Array.isArray(next.auditTrail)) next.auditTrail = next.auditTrail;
  return next;
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

async function serveStatic(pathname, response) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = resolve(ROOT_DIR, `.${normalize(cleanPath)}`);
  if (!filePath.startsWith(ROOT_DIR)) {
    sendJson(response, 403, { error: "Forbidden" });
    return;
  }
  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentType(filePath),
      "Cache-Control": "no-store"
    });
    response.end(body);
  } catch {
    sendJson(response, 404, { error: "Not found" });
  }
}

function contentType(filePath) {
  const type = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
  }[extname(filePath).toLowerCase()];
  return type || "application/octet-stream";
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  if (status === 204) response.end();
  else response.end(JSON.stringify(payload));
}
