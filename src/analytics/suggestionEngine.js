(function () {
  const SUGGESTION_KEY = "impossibleAiUxSuggestions";

  function createSuggestion(input) {
    return {
      suggestionId: input.suggestionId,
      title: input.title,
      description: input.description,
      evidence: input.evidence,
      severity: input.severity || "medium",
      status: "pending",
      createdAt: new Date().toISOString(),
      relatedEvents: input.relatedEvents || [],
      suggestedAction: input.suggestedAction,
      affectedView: input.affectedView,
      affectedComponent: input.affectedComponent
    };
  }

  function readStoredSuggestions() {
    try {
      return JSON.parse(localStorage.getItem(SUGGESTION_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeStoredSuggestions(suggestions) {
    localStorage.setItem(SUGGESTION_KEY, JSON.stringify(suggestions));
  }

  function generate(events) {
    const stored = readStoredSuggestions();
    const byId = new Map(stored.map((suggestion) => [suggestion.suggestionId, suggestion]));
    const generated = [];

    const repeated = events.filter((event) => event.eventName === "Repeated Click Detected");
    repeated.forEach((event) => {
      const key = event.properties?.clickKey || "unknown-click";
      generated.push(createSuggestion({
        suggestionId: `repeated-click-${key}`,
        title: "Make this click target clearer",
        description: "A user repeatedly clicked the same item in a short window. This can mean the action is unclear, slow to respond, or not visibly selected.",
        evidence: `${event.properties?.count || 3} repeated clicks detected on ${key}.`,
        severity: "high",
        relatedEvents: [event.eventId],
        suggestedAction: "Add a stronger selected or loading state for the clicked card/action.",
        affectedView: event.view,
        affectedComponent: key
      }));
    });

    const selectedGames = events.filter((event) => event.eventName === "Game Selected");
    const selectionsByGame = groupBy(selectedGames, (event) => event.properties?.gameId || event.properties?.gameName);
    selectionsByGame.forEach((gameEvents, gameKey) => {
      if (!gameKey || gameEvents.length < 2) return;
      const latest = gameEvents[gameEvents.length - 1];
      generated.push(createSuggestion({
        suggestionId: `repeated-selection-${gameKey}`,
        title: "Clarify what happens after selecting this game",
        description: "The same game has been selected multiple times. In this prototype that may mean the login handoff, selected state or next step is not clear enough.",
        evidence: `${gameEvents.length} selections captured for ${latest.properties?.gameName || gameKey}.`,
        severity: "medium",
        relatedEvents: gameEvents.map((event) => event.eventId).slice(-8),
        suggestedAction: "Add clearer feedback after Play is clicked, such as a stronger login prompt or selected state.",
        affectedView: latest.view,
        affectedComponent: latest.properties?.gameName || gameKey
      }));
    });

    const gameViews = events.filter((event) => event.eventName === "Game Viewed");
    if (gameViews.length >= 80 && selectedGames.length === 0) {
      generated.push(createSuggestion({
        suggestionId: "game-card-action-discovery",
        title: "Make game actions easier to discover",
        description: "Many game cards have been viewed but no game selections were captured. The Play action may need more contrast, clearer placement or supporting copy.",
        evidence: `${gameViews.length} game view events and 0 game selections.`,
        severity: "medium",
        relatedEvents: gameViews.map((event) => event.eventId).slice(-8),
        suggestedAction: "Make the Play button more prominent and add a clear hover or focus state.",
        affectedView: "games",
        affectedComponent: "Game cards"
      }));
    }

    const noResults = events.filter((event) => event.eventName === "Search No Results");
    if (noResults.length) {
      const latest = noResults[noResults.length - 1];
      generated.push(createSuggestion({
        suggestionId: "search-no-results-helper",
        title: "Improve the no-results search state",
        description: "Searches are returning no results. A richer empty state can keep the user moving instead of making the library feel broken.",
        evidence: `${noResults.length} no-result search event${noResults.length === 1 ? "" : "s"} captured. Latest term: "${latest.properties?.searchTerm || ""}".`,
        severity: "medium",
        relatedEvents: noResults.map((event) => event.eventId).slice(-8),
        suggestedAction: "Show helper text under search with a prompt to try provider names or clear filters.",
        affectedView: "my-casino",
        affectedComponent: "Game library search"
      }));
    }

    const previewed = events.filter((event) => event.eventName === "Layout Previewed");
    const saved = events.filter((event) => event.eventName === "Layout Saved");
    if (previewed.length > saved.length) {
      generated.push(createSuggestion({
        suggestionId: "layout-save-cta",
        title: "Make the save action more prominent",
        description: "The lobby has been previewed more often than it has been saved. The save action may need stronger emphasis.",
        evidence: `${previewed.length} previews vs ${saved.length} saves.`,
        severity: "medium",
        relatedEvents: previewed.map((event) => event.eventId).slice(-8),
        suggestedAction: "Highlight the Save lobby button while editing.",
        affectedView: "my-casino",
        affectedComponent: "Save lobby button"
      }));
    }

    const filterEvents = events.filter((event) => event.eventName === "Filter Applied");
    const filterClears = filterEvents.filter((event) => event.properties?.source === "all" && !event.properties?.provider);
    if (filterEvents.length >= 2 && filterClears.length) {
      generated.push(createSuggestion({
        suggestionId: "filter-label-review",
        title: "Review filter labels and result quality",
        description: "Users are applying filters and returning to all games. This may indicate the filter labels or results are not matching expectations.",
        evidence: `${filterEvents.length} filter changes, including ${filterClears.length} clear/reset action${filterClears.length === 1 ? "" : "s"}.`,
        severity: "low",
        relatedEvents: filterEvents.map((event) => event.eventId).slice(-8),
        suggestedAction: "Add clearer helper copy near filters or show result counts beside labels.",
        affectedView: "my-casino",
        affectedComponent: "Game library filters"
      }));
    }

    if (!generated.length && events.length >= 25) {
      const latest = events[events.length - 1];
      generated.push(createSuggestion({
        suggestionId: "general-journey-review",
        title: "Review the busiest journey",
        description: "The prototype has captured enough behaviour to review the journey, but no high-confidence friction rule has fired yet.",
        evidence: `${events.length} events captured. Most recent event: ${latest.eventName}.`,
        severity: "low",
        relatedEvents: events.map((event) => event.eventId).slice(-8),
        suggestedAction: "Inspect the analytics dashboard and choose one interaction to instrument more deeply next.",
        affectedView: latest.view,
        affectedComponent: "Prototype journey"
      }));
    }

    const grouped = groupSuggestions(generated);
    const merged = grouped.map((suggestion) => ({
      ...suggestion,
      status: byId.get(suggestion.suggestionId)?.status || suggestion.status,
      createdAt: byId.get(suggestion.suggestionId)?.createdAt || suggestion.createdAt
    }));
    const manual = stored.filter((suggestion) => !merged.some((item) => item.suggestionId === suggestion.suggestionId));
    const next = [...merged, ...manual].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    writeStoredSuggestions(next);
    return next;
  }

  function groupBy(items, getter) {
    const grouped = new Map();
    items.forEach((item) => {
      const key = getter(item);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(item);
    });
    return grouped;
  }

  function groupSuggestions(suggestions) {
    const grouped = new Map();
    suggestions.forEach((suggestion) => {
      const key = [
        suggestion.title,
        suggestion.suggestedAction,
        suggestion.affectedView
      ].join("|");
      if (!grouped.has(key)) {
        grouped.set(key, {
          ...suggestion,
          suggestionId: `group-${slugify(suggestion.title)}-${slugify(suggestion.affectedView || "all")}`,
          affectedComponents: [suggestion.affectedComponent].filter(Boolean),
          evidenceItems: [suggestion.evidence],
          relatedEvents: [...suggestion.relatedEvents]
        });
        return;
      }

      const existing = grouped.get(key);
      existing.affectedComponents = unique([
        ...existing.affectedComponents,
        suggestion.affectedComponent
      ].filter(Boolean));
      existing.evidenceItems.push(suggestion.evidence);
      existing.relatedEvents = unique([
        ...existing.relatedEvents,
        ...suggestion.relatedEvents
      ]);
      existing.evidence = `${existing.evidenceItems.length} related signals grouped.`;
      existing.affectedComponent = existing.affectedComponents.join(", ");
      existing.severity = highestSeverity(existing.severity, suggestion.severity);
    });

    return [...grouped.values()].map((suggestion) => ({
      ...suggestion,
      evidence: suggestion.evidenceItems?.length > 1
        ? `${suggestion.evidenceItems.length} related signals grouped: ${suggestion.evidenceItems.slice(0, 3).join(" ")}`
        : suggestion.evidence,
      affectedComponent: suggestion.affectedComponents?.join(", ") || suggestion.affectedComponent
    }));
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function unique(values) {
    return [...new Set(values)];
  }

  function highestSeverity(first, second) {
    const order = { low: 0, medium: 1, high: 2 };
    return order[second] > order[first] ? second : first;
  }

  function updateStatus(suggestionId, status) {
    const suggestions = readStoredSuggestions().map((suggestion) =>
      suggestion.suggestionId === suggestionId ? { ...suggestion, status } : suggestion
    );
    writeStoredSuggestions(suggestions);
    return suggestions;
  }

  window.PlayAISuggestionEngine = {
    generate,
    getSuggestions: readStoredSuggestions,
    updateStatus
  };
})();
