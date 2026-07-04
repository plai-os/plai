chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.tabs.create({ url: chrome.runtime.getURL("impossible.html") });
    if (tab.id) await showBadge(tab.id, "GO", "#5ee7ff");
  } catch (error) {
    console.error("Plai workspace launch failed:", error);
    if (tab.id) await showBadge(tab.id, "ERR", "#9b2335");
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "my-casino-lobby:load-catalogues") {
    loadExternalCatalogues()
      .then((games) => sendResponse({ ok: true, games }))
      .catch((error) =>
        sendResponse({ ok: false, error: error.message || String(error) })
      );
    return true;
  }

  if (
    message?.type === "my-casino-lobby:navigate" &&
    typeof message.url === "string"
  ) {
    navigateToGame(sender.tab?.id, message.url);
  }
});

async function navigateToGame(tabId, url) {
  let destination;
  try {
    destination = new URL(url);
  } catch {
    return;
  }

  const validGameRoute = [
    "/casino/",
    "/live-casino/",
    "/bingo/"
  ].some((prefix) => destination.pathname.startsWith(prefix));
  if (
    destination.origin !== "https://beta.lottoland.co.uk" ||
    !validGameRoute
  ) {
    return;
  }

  if (tabId) {
    await chrome.tabs.update(tabId, { url: destination.href });
  } else {
    await chrome.tabs.create({ url: destination.href });
  }
}

async function loadExternalCatalogues() {
  const sources = [
    { path: "/casino", source: "casino", selector: "Game" },
    { path: "/live-casino", source: "live", selector: "Game" },
    { path: "/bingo", source: "bingo", selector: "Room" }
  ];
  const results = await Promise.all(
    sources.map((source) => scrapeCataloguePage(source))
  );
  return results.flat();
}

async function scrapeCataloguePage({ path, source, selector }) {
  const tab = await chrome.tabs.create({
    url: `https://beta.lottoland.co.uk${path}`,
    active: false
  });

  try {
    await waitForTabComplete(tab.id);
    const [execution] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [source, selector],
      func: async (sourceName, containerName) => {
        const selectorText =
          `[data-track-container="${containerName}"][data-track-game-id]`;
        for (let attempt = 0; attempt < 40; attempt += 1) {
          if (document.querySelector(selectorText)) break;
          await new Promise((resolve) => setTimeout(resolve, 250));
        }

        const games = new Map();
        const cleanText = (value) => (value || "").replace(/\s+/g, " ").trim();
        const absolutise = (value) => {
          const cleaned = cleanText(value);
          if (!cleaned) return "";
          try {
            return new URL(cleaned, location.origin).href;
          } catch {
            return cleaned;
          }
        };
        const srcFromSet = (value) => {
          const cleaned = cleanText(value);
          if (!cleaned) return "";
          const candidates = cleaned
            .split(",")
            .map((candidate) => candidate.trim().split(/\s+/)[0])
            .filter(Boolean);
          return candidates[candidates.length - 1] || "";
        };
        const backgroundUrl = (node) => {
          const match = getComputedStyle(node).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
          return match?.[1] || "";
        };
        const nearestVisualRoots = (node) => {
          const roots = [node];
          let current = node;
          for (let index = 0; index < 5; index += 1) {
            current = current.parentElement;
            if (!current) break;
            roots.push(current);
          }
          const link = node.closest("a");
          if (link && !roots.includes(link)) roots.push(link);
          const article = node.closest("article, li, [role='listitem'], [data-testid], [class*='card'], [class*='tile']");
          if (article && !roots.includes(article)) roots.push(article);
          return roots;
        };
        const imageFromRoot = (root) => {
          const image = root.querySelector("img");
          const source = root.querySelector("picture source[srcset], source[srcset]");
          const metaImage = root.querySelector('[itemprop="image"], meta[property="og:image"]');
          return (
            image?.currentSrc ||
            image?.src ||
            image?.getAttribute("data-src") ||
            image?.getAttribute("data-lazy-src") ||
            image?.getAttribute("data-original") ||
            image?.getAttribute("data-nimg") ||
            srcFromSet(image?.getAttribute("srcset")) ||
            srcFromSet(source?.getAttribute("srcset")) ||
            metaImage?.content ||
            backgroundUrl(root)
          );
        };
        const imageFrom = (node) => {
          const rawImage = nearestVisualRoots(node)
            .map(imageFromRoot)
            .find(Boolean);
          return absolutise(rawImage);
        };
        const nameFrom = (node, rawId) => {
          const roots = nearestVisualRoots(node);
          const image = roots.map((root) => root.querySelector("img")).find(Boolean);
          const labelled = roots
            .map((root) => root.querySelector("[aria-label], [title]"))
            .find(Boolean);
          const heading = roots
            .map((root) => root.querySelector("h1, h2, h3, h4, strong, [data-game-name]"))
            .find(Boolean);
          const candidates = [
            node.getAttribute("data-track-game-name"),
            node.getAttribute("data-game-name"),
            node.getAttribute("aria-label"),
            node.getAttribute("title"),
            image?.alt,
            labelled?.getAttribute("aria-label"),
            labelled?.getAttribute("title"),
            heading?.textContent
          ]
            .map(cleanText)
            .filter(Boolean);
          return candidates.find((candidate) => candidate !== rawId) || rawId;
        };
        const providerFrom = (node, fallback) => {
          const providerNode = nearestVisualRoots(node)
            .map((root) =>
              root.querySelector(
                "[data-track-game-provider], [data-provider], [data-game-provider], .provider"
              )
            )
            .find(Boolean);
          return (
            cleanText(node.getAttribute("data-track-game-provider")) ||
            cleanText(node.getAttribute("data-provider")) ||
            cleanText(node.getAttribute("data-game-provider")) ||
            cleanText(providerNode?.getAttribute("data-track-game-provider")) ||
            cleanText(providerNode?.getAttribute("data-provider")) ||
            cleanText(providerNode?.textContent) ||
            fallback
          );
        };

        document.querySelectorAll(selectorText).forEach((node) => {
          const rawId = node.getAttribute("data-track-game-id");
          if (!rawId) return;
          const internalId =
            sourceName === "casino" ? rawId : `${sourceName}:${rawId}`;
          const playLink =
            node.querySelector('a[href*="/play"]') ||
            node.closest('a[href*="/play"]');
          if (!playLink) return;

          let category = node.getAttribute("data-track-game-type") || "";
          let current = node.parentElement;
          while (!category && current) {
            category = current.getAttribute?.("data-track-title") || "";
            current = current.parentElement;
          }

          const schedule =
            node.getAttribute("data-track-game-schedule") || "";
          games.set(internalId, {
            id: internalId,
            rawId,
            source: sourceName,
            name: nameFrom(node, rawId),
            provider: providerFrom(node, sourceName === "bingo" ? "Bingo" : "Unknown"),
            categories: [category, schedule].filter(Boolean),
            image: imageFrom(node),
            playUrl: playLink.getAttribute("href"),
            callout:
              node.getAttribute("data-track-game-callout-value") || ""
          });
        });
        return [...games.values()];
      }
    });
    return execution?.result || [];
  } finally {
    if (tab.id) await chrome.tabs.remove(tab.id).catch(() => {});
  }
}

function waitForTabComplete(tabId) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      reject(new Error("Timed out while loading a game catalogue."));
    }, 20000);
    const listener = (updatedTabId, changeInfo) => {
      if (updatedTabId !== tabId || changeInfo.status !== "complete") return;
      clearTimeout(timeout);
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    };
    chrome.tabs.onUpdated.addListener(listener);
    chrome.tabs.get(tabId).then((currentTab) => {
      if (currentTab.status === "complete") {
        clearTimeout(timeout);
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    });
  });
}

async function showBadge(tabId, text, color) {
  await chrome.action.setBadgeBackgroundColor({ tabId, color });
  await chrome.action.setBadgeText({ tabId, text });
  setTimeout(() => {
    chrome.action.setBadgeText({ tabId, text: "" }).catch(() => {});
  }, 3500);
}
