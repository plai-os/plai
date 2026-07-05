import React, { useEffect, useMemo, useRef, useState } from "react";
import { GAME_CONFIG, findSymbol } from "./config.js";
import { SlotMathEngine } from "./mathEngine.js";
import { PixiSlotRenderer } from "./pixiRenderer.js";
import { AudioEngine } from "./audioEngine.js";

const h = React.createElement;

function money(value) {
  return `£${Number(value || 0).toFixed(2)}`;
}

function LoadingShowcase({ ready }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (ready) return undefined;
    const timer = window.setInterval(() => {
      setStep((current) => Math.min(current + 1, GAME_CONFIG.loadingSteps.length - 1));
    }, 700);
    return () => window.clearInterval(timer);
  }, [ready]);

  const progress = ready ? 100 : Math.round(((step + 1) / GAME_CONFIG.loadingSteps.length) * 100);

  return h(
    "div",
    { className: `loading-showcase ${ready ? "ready" : ""}` },
    h("div", { className: "plai-chip" }, "PLAI BUILD"),
    h("h1", null, ready ? "Bubblegum Stampede is ready" : "Plai is building your slot"),
    h("p", null, GAME_CONFIG.aiBuild.prompt),
    h("div", { className: "loading-meter" }, h("span", { style: { width: `${progress}%` } })),
    h("ol", { className: "build-steps" }, GAME_CONFIG.loadingSteps.map((label, index) =>
      h("li", { key: label, className: index <= step ? "done" : "" }, label)
    ))
  );
}

function StatCard({ label, value }) {
  return h("div", { className: "stat-card" }, h("span", null, label), h("strong", null, value));
}

function Paytable() {
  return h(
    "div",
    { className: "panel paytable-panel" },
    h("h2", null, "Paytable"),
    h("div", { className: "paytable" }, GAME_CONFIG.symbols
      .filter((symbol) => symbol.paytable)
      .map((symbol) => h(
        "div",
        { className: "pay-row", key: symbol.id },
        h("span", { style: { background: symbol.color } }, symbol.short),
        h("strong", null, symbol.name),
        h("small", null, `3x ${symbol.paytable[3]} · 4x ${symbol.paytable[4]} · 5x ${symbol.paytable[5]}`)
      )))
  );
}

function BuildSummary({ result, onClose }) {
  return h(
    "aside",
    { className: "drawer" },
    h("button", { className: "close-button", onClick: onClose, type: "button" }, "×"),
    h("div", { className: "plai-chip" }, "BUILD SUMMARY"),
    h("h2", null, "What Plai generated"),
    h("p", null, "A self-contained slot concept with a configurable math model, PixiJS reel renderer, cascades, free spins, jackpots and a demo-safe build trail."),
    h("div", { className: "summary-grid" },
      h(StatCard, { label: "RTP target", value: `${GAME_CONFIG.math.targetRtp}%` }),
      h(StatCard, { label: "Simulated RTP", value: `${GAME_CONFIG.aiBuild.simulatedRtp}%` }),
      h(StatCard, { label: "Simulation", value: GAME_CONFIG.aiBuild.simulation }),
      h(StatCard, { label: "Volatility", value: GAME_CONFIG.math.volatility })
    ),
    h("h3", null, "Latest spin"),
    h("pre", null, JSON.stringify(result || { state: "No spin yet" }, null, 2))
  );
}

export function App() {
  const stageRef = useRef(null);
  const rendererRef = useRef(null);
  const audioRef = useRef(new AudioEngine());
  const engineRef = useRef(null);
  const rafRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [board, setBoard] = useState(null);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(GAME_CONFIG.math.baseBet);
  const [spinning, setSpinning] = useState(false);
  const [freeSpins, setFreeSpins] = useState(0);
  const [auto, setAuto] = useState(false);
  const [turbo, setTurbo] = useState(false);
  const [muted, setMuted] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [log, setLog] = useState([]);

  const engine = useMemo(() => new SlotMathEngine(20260705), []);

  useEffect(() => {
    engineRef.current = engine;
    setBoard(engine.createBoard());
    const ready = window.setTimeout(() => setLoaded(true), 4300);
    return () => window.clearTimeout(ready);
  }, [engine]);

  useEffect(() => {
    if (!loaded || !stageRef.current || rendererRef.current) return undefined;
    const renderer = new PixiSlotRenderer(stageRef.current);
    rendererRef.current = renderer;
    let active = true;
    renderer.init().then(() => {
      if (!active) return;
      renderer.renderBoard(board || engine.createBoard());
      const tick = () => {
        renderer.tickParticles();
        rafRef.current = window.requestAnimationFrame(tick);
      };
      tick();
    });
    return () => {
      active = false;
      window.cancelAnimationFrame(rafRef.current);
      renderer.destroy();
      rendererRef.current = null;
    };
  }, [loaded, board, engine]);

  useEffect(() => {
    audioRef.current.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (!auto || spinning || !loaded) return undefined;
    const timer = window.setTimeout(() => spin(), turbo ? 350 : 900);
    return () => window.clearTimeout(timer);
  }, [auto, spinning, loaded, turbo]);

  function record(message) {
    setLog((items) => [{ time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), message }, ...items].slice(0, 6));
  }

  function spin() {
    if (spinning || !engineRef.current) return;
    setSpinning(true);
    audioRef.current.spin();
    const isFree = freeSpins > 0;
    setBalance((current) => current - (isFree ? 0 : bet));

    window.setTimeout(() => {
      const result = engineRef.current.runSpin({ freeSpin: isFree });
      setBoard(result.board);
      rendererRef.current?.renderBoard(result.board, result.wins);
      if (result.totalWin > 0) {
        rendererRef.current?.burst(result.winTier === "Super Win" ? 70 : 30);
        audioRef.current.win(result.totalWin);
      }
      setBalance((current) => current + result.totalWin);
      setFreeSpins((current) => Math.max(0, current - (isFree ? 1 : 0)) + result.freeSpinsAwarded);
      setLastResult(result);
      record(result.totalWin ? `${result.winTier}: ${money(result.totalWin)}` : "No win");
      setSpinning(false);
    }, turbo ? 240 : 760);
  }

  const latestSymbols = (board || []).flat().map((id) => findSymbol(id).name);

  return h(
    "main",
    { className: "slot-page" },
    !loaded && h(LoadingShowcase, { ready: false }),
    h(
      "section",
      { className: `game-shell ${loaded ? "ready" : "hidden"}` },
      h("header", { className: "game-hero" },
        h("div", null,
          h("span", { className: "plai-chip" }, "EXCLUSIVE"),
          h("h1", null, GAME_CONFIG.title),
          h("p", null, "A polished Plai-built slot concept with cascading wins, free spins, progressive jackpots and configurable math.")
        ),
        h("button", { type: "button", className: "ghost-button", onClick: () => setShowSummary(true) }, "View build summary")
      ),
      h("div", { className: "game-layout" },
        h("section", { className: "stage-card" },
          h("div", { className: "stage-topline" },
            h("strong", null, lastResult?.winTier || "Ready"),
            h("span", null, lastResult?.jackpot?.name ? `${lastResult.jackpot.name} jackpot` : "Cascading reels")
          ),
          h("div", { className: "pixi-stage", ref: stageRef, "aria-label": latestSymbols.join(", ") })
        ),
        h("aside", { className: "control-panel" },
          h("div", { className: "stat-grid" },
            h(StatCard, { label: "Balance", value: money(balance) }),
            h(StatCard, { label: "Last win", value: money(lastResult?.totalWin || 0) }),
            h(StatCard, { label: "Free spins", value: freeSpins }),
            h(StatCard, { label: "Bet", value: money(bet) })
          ),
          h("label", { className: "range-label" }, "Stake", h("input", {
            type: "range",
            min: "0.5",
            max: "5",
            step: "0.5",
            value: bet,
            onChange: (event) => setBet(Number(event.target.value))
          })),
          h("button", { type: "button", className: "spin-button", onClick: spin, disabled: spinning }, spinning ? "Spinning" : "Spin"),
          h("div", { className: "toggle-row" },
            h("button", { type: "button", className: auto ? "active" : "", onClick: () => setAuto(!auto) }, "Auto"),
            h("button", { type: "button", className: turbo ? "active" : "", onClick: () => setTurbo(!turbo) }, "Turbo"),
            h("button", { type: "button", className: muted ? "active" : "", onClick: () => setMuted(!muted) }, "Mute")
          ),
          h("div", { className: "spin-log" },
            h("h2", null, "Spin log"),
            log.length ? log.map((entry) => h("p", { key: `${entry.time}-${entry.message}` }, h("span", null, entry.time), entry.message)) : h("p", null, "Spin to start the session.")
          )
        )
      ),
      h("section", { className: "info-grid" },
        h(Paytable),
        h("div", { className: "panel" },
          h("h2", null, "Game phases"),
          h("ul", null,
            h("li", null, "Foundation: React, Vite-ready structure and PixiJS reels."),
            h("li", null, "Gameplay: wins, paylines, cascades and math config."),
            h("li", null, "Features: free spins, bonus scatters and jackpots."),
            h("li", null, "Showcase: Plai loading journey and build summary."),
            h("li", null, "Polish: particles, animation, responsive layout and docs.")
          )
        )
      )
    ),
    showSummary && h(BuildSummary, { result: lastResult, onClose: () => setShowSummary(false) })
  );
}
