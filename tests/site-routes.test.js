import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function readWorkspaceFile(fileName) {
  return readFileSync(join(root, fileName), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const plaiHtml = readWorkspaceFile("plai.html");
const plaiScript = readWorkspaceFile("plai.js");

assert(
  plaiHtml.includes('data-route-link="exclusive"'),
  "Primary navigation must include the Exclusive route link."
);
assert(
  plaiHtml.includes('data-page="exclusive"'),
  "Exclusive lobby section must be present as a routable page."
);
assert(
  plaiHtml.includes("data-exclusive-game-launch"),
  "Exclusive lobby must include a game launch action."
);
assert(
  plaiHtml.includes("./games/bubblegum-stampede/index.html"),
  "Exclusive game modal must load Bubblegum Stampede."
);
assert(
  plaiScript.includes('"exclusive"'),
  "Client route list must recognise the Exclusive route."
);
assert(
  plaiScript.includes("setupExclusiveGameLauncher"),
  "Exclusive game launcher must be wired in the client script."
);
assert(
  plaiScript.includes("window.openBubblegumStampede"),
  "Bubblegum Stampede launcher must be exposed for all game-card launches."
);
assert(
  plaiScript.includes("[data-play-url]"),
  "Generated game cards with play URLs must be routed into Bubblegum Stampede."
);
assert(
  plaiScript.includes("plai-bubblegum-launch-style"),
  "Bubblegum Stampede launcher must inject its modal styling from the loaded script."
);
assert(
  plaiScript.includes("window.openBubblegumStampede();\n    return;\n  }\n  openLoginModal();"),
  "Original game-card navigation must open Bubblegum Stampede instead of the login handoff."
);
assert(
  plaiScript.includes("event?.preventDefault?.();"),
  "Exclusive route launch buttons must be intercepted before the legacy empty modal opens."
);
assert(
  !plaiScript.includes("function findGameCard(node)"),
  "Bubblegum launcher must not install a broad document-wide game-card click catcher."
);

for (const entryPoint of ["index.html", "impossible.html"]) {
  const entryHtml = readWorkspaceFile(entryPoint);
  assert(
    entryHtml.includes("plai.html"),
    `${entryPoint} must redirect to the Plai app.`
  );
  assert(
    entryHtml.includes("window.location.hash"),
    `${entryPoint} must preserve route hashes such as #exclusive.`
  );
}

console.log("Site route checks passed.");
