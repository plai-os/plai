(() => {
  const modalId = "plai-direct-bubblegum-modal";
  const styleId = "plai-direct-bubblegum-style";
  const gamePath = "games/bubblegum-stampede/index.html?v=20260705-direct";
  const launchSelector = [
    "[data-exclusive-game-launch]",
    ".exclusive-game-tile",
    ".plai-exclusive-game-card",
    ".game-card[data-play-url]",
    "[data-play-url]",
    ".game-card[data-game-id]",
    "[data-track-game-id]",
    "[data-game-card]"
  ].join(", ");

  function isWorkspaceClick(target) {
    return Boolean(target.closest(".workspace-shell, .playai-shell, .plai-workspace, .playai-app, .plai-app-shell, .workspace-main, .workspace-sidebar, .playai-nav, .plai-side-nav"));
  }

  function injectStyles() {
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = [
      ".plai-direct-bubblegum-modal { position: fixed; inset: 0; z-index: 2147483000; display: grid; place-items: center; padding: clamp(12px, 2.5vw, 36px); background: rgba(18, 5, 42, 0.86); backdrop-filter: blur(14px); }",
      ".plai-direct-bubblegum-window { width: min(98vw, 1540px); height: min(92vh, 940px); overflow: hidden; border: 1px solid rgba(255,255,255,0.3); border-radius: 22px; background: #2b0a65; box-shadow: 0 30px 90px rgba(18, 5, 42, 0.58); }",
      ".plai-direct-bubblegum-bar { height: 68px; display: flex; align-items: center; gap: 14px; padding: 0 20px; background: linear-gradient(90deg, #42107b, #ff43ad); color: white; }",
      ".plai-direct-bubblegum-pill { display: inline-flex; align-items: center; min-height: 28px; padding: 0 10px; background: #ffe95b; color: #211247; font-size: 13px; font-weight: 950; text-transform: uppercase; }",
      ".plai-direct-bubblegum-title { min-width: 0; font-size: clamp(20px, 2vw, 28px); font-weight: 950; line-height: 1; }",
      ".plai-direct-bubblegum-close { width: 48px; height: 48px; margin-left: auto; border: 0; border-radius: 999px; display: grid; place-items: center; color: white; background: rgba(255,255,255,0.2); font-size: 32px; font-weight: 900; cursor: pointer; }",
      ".plai-direct-bubblegum-frame { display: block; width: 100%; height: calc(100% - 68px); border: 0; background: #2b0a65; }",
      "body.plai-direct-bubblegum-open { overflow: hidden !important; }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function gameUrl() {
    return new URL(gamePath, window.location.href).toString();
  }

  function closeBubblegumStampede() {
    document.getElementById(modalId)?.remove();
    document.body.classList.remove("plai-direct-bubblegum-open", "exclusive-game-open");
    const legacyModal = document.querySelector("[data-exclusive-game-modal]");
    if (legacyModal) legacyModal.hidden = true;
  }

  function openBubblegumStampede() {
    injectStyles();
    document.querySelector("[data-login-modal]")?.setAttribute("hidden", "");
    const legacyModal = document.querySelector("[data-exclusive-game-modal]");
    if (legacyModal) legacyModal.hidden = true;
    let modal = document.getElementById(modalId);
    if (!modal) {
      modal = document.createElement("div");
      modal.id = modalId;
      modal.className = "plai-direct-bubblegum-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", "Bubblegum Stampede");
      modal.innerHTML = [
        '<div class="plai-direct-bubblegum-window" role="document">',
        '<div class="plai-direct-bubblegum-bar">',
        '<span class="plai-direct-bubblegum-pill">Exclusive</span>',
        '<strong class="plai-direct-bubblegum-title">Bubblegum Stampede</strong>',
        '<button class="plai-direct-bubblegum-close" type="button" aria-label="Close Bubblegum Stampede">&times;</button>',
        '</div>',
        '<iframe class="plai-direct-bubblegum-frame" title="Bubblegum Stampede" src="' + gameUrl() + '" loading="eager" allow="autoplay; fullscreen"></iframe>',
        '</div>'
      ].join("");
      document.body.appendChild(modal);
      modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.closest(".plai-direct-bubblegum-close")) {
          closeBubblegumStampede();
        }
      });
    } else {
      const frame = modal.querySelector("iframe");
      if (frame && !frame.src.includes("bubblegum-stampede")) frame.src = gameUrl();
    }
    document.body.classList.add("plai-direct-bubblegum-open");
    window.requestAnimationFrame(() => modal.querySelector("iframe")?.focus?.());
  }

  window.openBubblegumStampede = openBubblegumStampede;
  window.PlaiGameLauncher = { open: openBubblegumStampede };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element) || isWorkspaceClick(target)) return;
    const launcher = target.closest(launchSelector);
    if (!launcher) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openBubblegumStampede();
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeBubblegumStampede();
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target;
    if (!(target instanceof Element) || isWorkspaceClick(target)) return;
    if (!target.closest(launchSelector)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openBubblegumStampede();
  }, true);
})();
