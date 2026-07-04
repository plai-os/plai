(() => {
  const configuredApiBase = "";
  let storedApiBase = "";

  try {
    storedApiBase = localStorage.getItem("PLAI_API_BASE") || "";
  } catch {
    storedApiBase = "";
  }

  const cleanApiBase = (globalThis.PLAI_API_BASE || configuredApiBase || storedApiBase || "")
    .trim()
    .replace(/\/$/, "");

  globalThis.PLAI_API_BASE = cleanApiBase;
  globalThis.setPlaiApiBase = (url) => {
    const next = String(url || "").trim().replace(/\/$/, "");
    try {
      if (next) localStorage.setItem("PLAI_API_BASE", next);
      else localStorage.removeItem("PLAI_API_BASE");
    } catch {
      // The app can still run with the in-memory value when storage is blocked.
    }
    globalThis.PLAI_API_BASE = next;
    return next;
  };
})();
