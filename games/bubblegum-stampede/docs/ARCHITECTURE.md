# Bubblegum Stampede Build Notes

Bubblegum Stampede is a Plai exclusive slot concept built as a small React, Vite-ready and PixiJS-powered game shell.

## Foundation

- `index.html` provides the standalone game entry point.
- `src/main.js` mounts the React application.
- `src/pixiRenderer.js` owns the PixiJS canvas, reels, symbols, win overlays and particle layer.
- `src/config.js` contains symbols, reels, paylines, jackpot values and default stake settings.

## Gameplay

- `src/mathEngine.js` runs spins, evaluates paylines, applies cascade refills and returns a complete result object.
- Payline wins use configurable symbol multipliers.
- Cascade wins can stack additional win lines into the same spin result.
- The math configuration is intentionally readable so future studio tuning can happen without touching the renderer.

## Features

- Free spins can be toggled on and awarded from scatter-style results.
- Bonus and jackpot events are included as result types for UI demonstration.
- Jackpot meters are displayed in the interface and can be wired to progressive values later.

## Showcase

- The loading screen shows the Plai AI build phases before the game becomes playable.
- Each spin updates the build summary drawer with outcome, win, feature and cascade detail.
- The game can run standalone or inside the main Plai site as an embedded exclusive.

## Polish

- PixiJS handles motion, reel drawing and win particles.
- The CSS layer handles responsive layout, panels, controls and modal presentation.
- The current implementation is browser-only and keeps state in memory so it can be safely embedded in demos.
