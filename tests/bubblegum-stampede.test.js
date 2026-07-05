import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(
  path.join(__dirname, "..", "games", "bubblegum-stampede", "index.html"),
  "utf8"
);

const requiredMarkers = [
  'data-game="bubblegum-stampede"',
  'id="reelGrid"',
  'id="spinButton"',
  "const mathConfig",
  "function evaluateWins",
  "function cascadeGrid",
  "window.bubblegumStampedeTestApi",
  "Build Summary"
];

const missing = requiredMarkers.filter((marker) => !html.includes(marker));
if (missing.length) {
  throw new Error(`Bubblegum Stampede shell missing: ${missing.join(", ")}`);
}

const paylineMatch = html.match(/paylines:\s*\[([\s\S]*?)\],\s*cascadeMultiplierStep/);
if (!paylineMatch) {
  throw new Error("Payline configuration was not found.");
}

const lineCount = (
  paylineMatch[1].match(/\[[0-3],\s*[0-3],\s*[0-3],\s*[0-3],\s*[0-3]\]/g) || []
).length;
if (lineCount < 8) {
  throw new Error(`Expected at least 8 paylines, found ${lineCount}.`);
}

console.log("Bubblegum Stampede smoke test passed.");
