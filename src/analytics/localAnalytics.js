(function () {
  const EVENT_KEY = "impossibleLocalAnalyticsEvents";
  const IMPROVEMENT_KEY = "approvedUxImprovements";
  const SESSION_KEY = "impossibleLocalAnalyticsSession";
  const defaults = {
    repeatedClickWindowMs: 2500,
    repeatedClickThreshold: 3,
    maxStoredEvents: 120,
    quotaRetryEvents: 40,
    emergencyRetryEvents: 10
  };

  const sessionId = getSessionId();
  const recentClicks = new Map();

  function getSessionId() {
    try {
      const existing = sessionStorage.getItem(SESSION_KEY);
      if (existing) return existing;
      const id = `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
      return id;
    } catch {
      return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
  }

  function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getRoute() {
    return location.hash.replace(/^#/, "") || "home";
  }

  function readEvents() {
    try {
      return JSON.parse(localStorage.getItem(EVENT_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeEvents(events) {
    const trimmedEvents = events.slice(-defaults.maxStoredEvents);
    try {
      localStorage.setItem(EVENT_KEY, JSON.stringify(trimmedEvents));
      return trimmedEvents;
    } catch (error) {
      if (!isStorageQuotaError(error)) {
        console.warn("PlayAI analytics could not be saved.", error);
        return trimmedEvents;
      }

      const fallbackEvents = trimmedEvents.slice(-defaults.quotaRetryEvents);
      try {
        localStorage.removeItem(EVENT_KEY);
        localStorage.setItem(EVENT_KEY, JSON.stringify(fallbackEvents));
        return fallbackEvents;
      } catch (retryError) {
        const emergencyEvents = trimmedEvents.slice(-defaults.emergencyRetryEvents);
        try {
          localStorage.removeItem(EVENT_KEY);
          localStorage.setItem(EVENT_KEY, JSON.stringify(emergencyEvents));
          return emergencyEvents;
        } catch (finalError) {
          try {
            localStorage.removeItem(EVENT_KEY);
          } catch {
            // Storage may be unavailable; the page should still keep working.
          }
          console.warn("PlayAI analytics storage is full; analytics persistence has been paused.", finalError || retryError);
          return [];
        }
      }
    }
  }

  function isStorageQuotaError(error) {
    return error?.name === "QuotaExceededError" || error?.code === 22 || error?.code === 1014;
  }

  function track(eventName, properties = {}) {
    const event = {
      eventName,
      timestamp: new Date().toISOString(),
      view: document.body.dataset.route || getRoute(),
      route: getRoute(),
      sessionId,
      eventId: createId("event"),
      properties
    };
    const events = readEvents();
    events.push(event);
    writeEvents(events);
    window.dispatchEvent(new CustomEvent("impossible:analytics-event", { detail: event }));
    return event;
  }

  function trackRepeatedClick(clickKey, properties = {}) {
    const now = Date.now();
    const clicks = (recentClicks.get(clickKey) || []).filter(
      (timestamp) => now - timestamp <= defaults.repeatedClickWindowMs
    );
    clicks.push(now);
    recentClicks.set(clickKey, clicks);
    if (clicks.length >= defaults.repeatedClickThreshold) {
      track("Repeated Click Detected", {
        clickKey,
        count: clicks.length,
        windowMs: defaults.repeatedClickWindowMs,
        ...properties
      });
    }
  }

  function getApprovedImprovements() {
    try {
      return JSON.parse(localStorage.getItem(IMPROVEMENT_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function queueImprovement(suggestion) {
    const improvements = getApprovedImprovements();
    if (!improvements.some((item) => item.suggestionId === suggestion.suggestionId)) {
      improvements.push({
        suggestionId: suggestion.suggestionId,
        title: suggestion.title,
        suggestedAction: suggestion.suggestedAction,
        affectedView: suggestion.affectedView,
        affectedComponent: suggestion.affectedComponent,
        queuedAt: new Date().toISOString()
      });
      try {
        localStorage.setItem(IMPROVEMENT_KEY, JSON.stringify(improvements));
      } catch (error) {
        console.warn("PlayAI improvement queue could not be saved locally.", error);
      }
    }
  }

  function clearEvents() {
    localStorage.removeItem(EVENT_KEY);
    window.dispatchEvent(new CustomEvent("impossible:analytics-event"));
  }

  function exportJson() {
    return JSON.stringify(readEvents(), null, 2);
  }

  window.PlayAILocalAnalytics = {
    track,
    trackRepeatedClick,
    getEvents: readEvents,
    clearEvents,
    exportJson,
    queueImprovement,
    getApprovedImprovements,
    config: defaults
  };
})();
