import { existsSync, mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const BACKLOG_COLUMNS = [
  "id",
  "area",
  "item",
  "priority",
  "status",
  "source",
  "effort",
  "detail",
  "benefit",
  "implementationNote",
  "auditTrail",
  "createdAt",
  "updatedAt"
];

export async function createBacklogStore({ dataDir }) {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
  if (databaseUrl) return createPostgresBacklogStore({ databaseUrl, dataDir });
  return createSqliteBacklogStore({ dataDir });
}

async function createSqliteBacklogStore({ dataDir }) {
  const { DatabaseSync } = await import("node:sqlite");
  const dbPath = join(dataDir, "plai-workspace.sqlite");
  const seedPath = join(dataDir, "workspace-backlog.json");

  mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(dbPath);

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

  await seedSqliteBacklogIfEmpty(db, seedPath);

  return {
    type: "sqlite",
    async list() {
      return db.prepare("SELECT * FROM backlog_items ORDER BY id").all().map(hydrateBacklogItem);
    },
    async create(body) {
      const now = new Date().toISOString();
      const nextId = db.prepare("SELECT COALESCE(MAX(id), 0) + 1 AS id FROM backlog_items").get().id;
      const item = normaliseCreatedBacklogItem(body, nextId, now);

      db.prepare(`
        INSERT INTO backlog_items (
          id, area, item, priority, status, source, effort, detail, benefit,
          implementationNote, auditTrail, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(...BACKLOG_COLUMNS.map((key) => serialiseSqliteValue(key, item[key])));

      return this.get(nextId);
    },
    async update(id, patch) {
      const current = await this.get(id);
      if (!current) return null;
      const now = new Date().toISOString();
      const next = normaliseUpdatedBacklogItem(current, patch, now);

      db.prepare(`
        UPDATE backlog_items
        SET area = ?, item = ?, priority = ?, status = ?, source = ?, effort = ?,
          detail = ?, benefit = ?, implementationNote = ?, auditTrail = ?, updatedAt = ?
        WHERE id = ?
      `).run(
        next.area,
        next.item,
        next.priority,
        next.status,
        next.source,
        next.effort,
        next.detail,
        next.benefit,
        next.implementationNote,
        JSON.stringify(next.auditTrail),
        now,
        id
      );

      return this.get(id);
    },
    async delete(id) {
      db.prepare("DELETE FROM backlog_items WHERE id = ?").run(id);
    },
    async get(id) {
      const row = db.prepare("SELECT * FROM backlog_items WHERE id = ?").get(id);
      return row ? hydrateBacklogItem(row) : null;
    }
  };
}

async function createPostgresBacklogStore({ databaseUrl, dataDir }) {
  const { Pool } = await import("pg");
  const seedPath = join(dataDir, "workspace-backlog.json");
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false }
  });

  await pool.query(`
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
      implementation_note TEXT DEFAULT '',
      audit_trail JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `);

  await seedPostgresBacklogIfEmpty(pool, seedPath);

  return {
    type: "postgres",
    async list() {
      const { rows } = await pool.query("SELECT * FROM backlog_items ORDER BY id");
      return rows.map(hydratePostgresBacklogItem);
    },
    async create(body) {
      const { rows: idRows } = await pool.query("SELECT COALESCE(MAX(id), 0) + 1 AS id FROM backlog_items");
      const now = new Date().toISOString();
      const nextId = Number(idRows[0].id);
      const item = normaliseCreatedBacklogItem(body, nextId, now);

      await pool.query(`
        INSERT INTO backlog_items (
          id, area, item, priority, status, source, effort, detail, benefit,
          implementation_note, audit_trail, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13)
      `, [
        item.id,
        item.area,
        item.item,
        item.priority,
        item.status,
        item.source,
        item.effort,
        item.detail,
        item.benefit,
        item.implementationNote,
        JSON.stringify(item.auditTrail),
        item.createdAt,
        item.updatedAt
      ]);

      return this.get(nextId);
    },
    async update(id, patch) {
      const current = await this.get(id);
      if (!current) return null;
      const now = new Date().toISOString();
      const next = normaliseUpdatedBacklogItem(current, patch, now);

      await pool.query(`
        UPDATE backlog_items
        SET area = $1, item = $2, priority = $3, status = $4, source = $5,
          effort = $6, detail = $7, benefit = $8, implementation_note = $9,
          audit_trail = $10::jsonb, updated_at = $11
        WHERE id = $12
      `, [
        next.area,
        next.item,
        next.priority,
        next.status,
        next.source,
        next.effort,
        next.detail,
        next.benefit,
        next.implementationNote,
        JSON.stringify(next.auditTrail),
        now,
        id
      ]);

      return this.get(id);
    },
    async delete(id) {
      await pool.query("DELETE FROM backlog_items WHERE id = $1", [id]);
    },
    async get(id) {
      const { rows } = await pool.query("SELECT * FROM backlog_items WHERE id = $1", [id]);
      return rows[0] ? hydratePostgresBacklogItem(rows[0]) : null;
    }
  };
}

async function seedSqliteBacklogIfEmpty(db, seedPath) {
  const count = db.prepare("SELECT COUNT(*) AS count FROM backlog_items").get().count;
  if (count || !existsSync(seedPath)) return;

  const insert = db.prepare(`
    INSERT INTO backlog_items (
      id, area, item, priority, status, source, effort, detail, benefit,
      implementationNote, auditTrail, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  try {
    for (const item of await readSeedItems(seedPath)) {
      insert.run(...BACKLOG_COLUMNS.map((key) => serialiseSqliteValue(key, item[key])));
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

async function seedPostgresBacklogIfEmpty(pool, seedPath) {
  const { rows } = await pool.query("SELECT COUNT(*) AS count FROM backlog_items");
  if (Number(rows[0].count) || !existsSync(seedPath)) return;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const item of await readSeedItems(seedPath)) {
      await client.query(`
        INSERT INTO backlog_items (
          id, area, item, priority, status, source, effort, detail, benefit,
          implementation_note, audit_trail, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13)
      `, [
        item.id,
        item.area,
        item.item,
        item.priority,
        item.status,
        item.source,
        item.effort,
        item.detail,
        item.benefit,
        item.implementationNote,
        JSON.stringify(item.auditTrail),
        item.createdAt,
        item.updatedAt
      ]);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function readSeedItems(seedPath) {
  const payload = JSON.parse(await readFile(seedPath, "utf8"));
  const now = new Date().toISOString();
  return (Array.isArray(payload.items) ? payload.items : []).map((item) => ({
    id: Number(item.id),
    area: item.area || "Unassessed",
    item: item.item || "Untitled backlog item",
    priority: item.priority || "",
    status: item.status || "Unassessed",
    source: item.source || "Human",
    effort: item.effort || "",
    detail: item.detail || "",
    benefit: item.benefit || "",
    implementationNote: item.implementationNote || "",
    auditTrail: Array.isArray(item.auditTrail) ? item.auditTrail : [],
    createdAt: item.createdAt || now,
    updatedAt: item.updatedAt || now
  }));
}

function normaliseCreatedBacklogItem(body, id, now) {
  const itemText = String(body?.item || body?.description || "").trim();
  const status = body?.status || "Unassessed";
  return {
    id,
    area: body?.area || "Unassessed",
    item: itemText || "Untitled backlog item",
    priority: body?.priority || "",
    status,
    source: body?.source || "Human",
    effort: body?.effort || "",
    detail: body?.detail || "",
    benefit: body?.benefit || "",
    implementationNote: body?.implementationNote || "",
    auditTrail: [{
      at: now,
      action: "Created",
      actor: body?.source || "Human",
      from: "",
      to: status,
      note: "Created from the workspace backlog form."
    }],
    createdAt: now,
    updatedAt: now
  };
}

function normaliseUpdatedBacklogItem(current, patch, now) {
  return {
    ...current,
    ...patch,
    id: current.id,
    area: patch.area ?? current.area ?? "Unassessed",
    item: patch.item ?? current.item ?? "Untitled backlog item",
    priority: patch.priority ?? current.priority ?? "",
    status: patch.status ?? current.status ?? "Unassessed",
    source: patch.source ?? current.source ?? "Human",
    effort: patch.effort ?? current.effort ?? "",
    detail: patch.detail ?? current.detail ?? "",
    benefit: patch.benefit ?? current.benefit ?? "",
    implementationNote: patch.implementationNote ?? current.implementationNote ?? "",
    auditTrail: Array.isArray(patch.auditTrail) ? patch.auditTrail : current.auditTrail || [],
    createdAt: current.createdAt,
    updatedAt: now
  };
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

function hydratePostgresBacklogItem(row) {
  return {
    id: Number(row.id),
    area: row.area || "Unassessed",
    item: row.item || "Untitled backlog item",
    priority: row.priority || "",
    status: row.status || "Unassessed",
    source: row.source || "Human",
    effort: row.effort || "",
    detail: row.detail || "",
    benefit: row.benefit || "",
    implementationNote: row.implementation_note || "",
    auditTrail: Array.isArray(row.audit_trail) ? row.audit_trail : [],
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : "",
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : ""
  };
}

function serialiseSqliteValue(key, value) {
  if (key === "auditTrail") return JSON.stringify(Array.isArray(value) ? value : []);
  return value ?? "";
}
