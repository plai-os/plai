import * as PIXI from "pixi.js";
import { GAME_CONFIG, findSymbol } from "./config.js";

export class PixiSlotRenderer {
  constructor(container) {
    this.container = container;
    this.app = null;
    this.symbolLayer = null;
    this.particleLayer = null;
  }

  async init() {
    this.app = new PIXI.Application();
    await this.app.init({ resizeTo: this.container, antialias: true, backgroundAlpha: 0 });
    this.container.appendChild(this.app.canvas);
    this.symbolLayer = new PIXI.Container();
    this.particleLayer = new PIXI.Container();
    this.app.stage.addChild(this.symbolLayer, this.particleLayer);
    this.drawBackground();
  }

  drawBackground() {
    const graphic = new PIXI.Graphics();
    graphic.roundRect(16, 16, Math.max(320, this.container.clientWidth - 32), Math.max(260, this.container.clientHeight - 32), 28);
    graphic.fill({ color: 0x3b1078, alpha: 0.66 });
    graphic.stroke({ width: 2, color: 0xffc5ef, alpha: 0.35 });
    this.app.stage.addChildAt(graphic, 0);
  }

  renderBoard(board, wins = []) {
    if (!this.app || !this.symbolLayer) return;
    this.symbolLayer.removeChildren();
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const cellW = Math.min(122, (width - 80) / GAME_CONFIG.layout.reels);
    const cellH = Math.min(92, (height - 76) / GAME_CONFIG.layout.rows);
    const startX = (width - cellW * GAME_CONFIG.layout.reels) / 2;
    const startY = (height - cellH * GAME_CONFIG.layout.rows) / 2;
    const winningSymbols = new Set(wins.map((win) => win.symbol));

    board.forEach((reel, reelIndex) => {
      reel.forEach((symbolId, rowIndex) => {
        const symbol = findSymbol(symbolId);
        const x = startX + reelIndex * cellW;
        const y = startY + rowIndex * cellH;
        const card = new PIXI.Graphics();
        card.roundRect(x + 8, y + 8, cellW - 16, cellH - 16, 18);
        card.fill({ color: parseInt(symbol.color.replace("#", ""), 16), alpha: 0.95 });
        card.stroke({ width: winningSymbols.has(symbolId) ? 5 : 2, color: winningSymbols.has(symbolId) ? 0xffffff : 0x4b166d, alpha: 0.86 });
        const label = new PIXI.Text({
          text: symbol.short,
          style: { fill: symbolId === "wild" ? "#30105f" : "#2a0e50", fontFamily: "Arial", fontSize: 28, fontWeight: "900", align: "center" }
        });
        label.anchor.set(0.5);
        label.x = x + cellW / 2;
        label.y = y + cellH / 2;
        this.symbolLayer.addChild(card, label);
      });
    });
  }

  burst(amount = 18) {
    if (!this.app || !this.particleLayer) return;
    for (let index = 0; index < amount; index += 1) {
      const particle = new PIXI.Graphics();
      particle.circle(0, 0, 4 + Math.random() * 5);
      particle.fill({ color: [0xff4eb3, 0xffe760, 0x6de7ff, 0x62f4c8][index % 4], alpha: 0.9 });
      particle.x = this.container.clientWidth / 2;
      particle.y = this.container.clientHeight / 2;
      particle.vx = (Math.random() - 0.5) * 11;
      particle.vy = (Math.random() - 0.5) * 9;
      particle.life = 42 + Math.random() * 30;
      this.particleLayer.addChild(particle);
    }
  }

  tickParticles() {
    if (!this.particleLayer) return;
    [...this.particleLayer.children].forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha *= 0.96;
      particle.life -= 1;
      if (particle.life <= 0) this.particleLayer.removeChild(particle);
    });
  }

  destroy() {
    if (this.app) this.app.destroy(true, { children: true });
  }
}
