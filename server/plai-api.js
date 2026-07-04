import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createBacklogStore } from "./backlog-store.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, "..");
const DATA_DIR = process.env.PLAI_DATA_DIR || join(ROOT_DIR, "data");
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "127.0.0.1";

const backlogStore = await createBacklogStore({ dataDir: DATA_DIR });

createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") {
      sendJson(response, 204, {});
      return;
    }

    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (url.pathname === "/api/health") {
      sendJson(response, 200, { ok: true, storage: backlogStore.type });
      return;
    }

    if (url.pathname === "/api/backlog" && request.method === "GET") {
      sendJson(response, 200, { items: await backlogStore.list() });
      return;
    }

    if (url.pathname === "/api/backlog" && request.method === "POST") {
      const body = await readJsonBody(request);
      const item = await backlogStore.create(body);
      sendJson(response, 201, { item });
      return;
    }

    const backlogMatch = url.pathname.match(/^\/api\/backlog\/([^/]+)$/);
    if (backlogMatch && request.method === "PATCH") {
      const id = Number(decodeURIComponent(backlogMatch[1]));
      const body = await readJsonBody(request);
      const item = await backlogStore.update(id, body);
      if (!item) sendJson(response, 404, { error: "Backlog item not found" });
      else sendJson(response, 200, { item });
      return;
    }

    if (backlogMatch && request.method === "DELETE") {
      const id = Number(decodeURIComponent(backlogMatch[1]));
      await backlogStore.delete(id);
      sendJson(response, 200, { ok: true });
      return;
    }

    await serveStatic(url.pathname, response);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Plai API error" });
  }
}).listen(PORT, HOST, () => {
  console.log(`Plai workspace running at http://${HOST}:${PORT}/`);
});

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
