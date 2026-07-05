import { GAME_CONFIG, findSymbol, getWeightedSymbol } from "./config.js";

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export class SlotMathEngine {
  constructor(seed = Date.now()) {
    this.rng = seededRandom(seed);
  }

  createBoard() {
    return Array.from({ length: GAME_CONFIG.layout.reels }, () =>
      Array.from({ length: GAME_CONFIG.layout.rows }, () => getWeightedSymbol(this.rng).id)
    );
  }

  runSpin({ freeSpin = false } = {}) {
    let board = this.createBoard();
    const cascades = [];
    let totalWin = 0;
    let multiplierIndex = 0;

    for (let cascade = 0; cascade < 6; cascade += 1) {
      const evaluation = this.evaluateBoard(board);
      if (!evaluation.wins.length) break;
      const multiplier = GAME_CONFIG.math.cascadeMultiplier[Math.min(multiplierIndex, GAME_CONFIG.math.cascadeMultiplier.length - 1)];
      const cascadeWin = evaluation.baseWin * multiplier * (freeSpin ? 2 : 1);
      totalWin += cascadeWin;
      cascades.push({ board, multiplier, win: cascadeWin, wins: evaluation.wins });
      board = this.cascadeBoard(board, evaluation.positions);
      multiplierIndex += 1;
    }

    const scatterCount = this.countSymbol(board, "scatter");
    const bonusCount = this.countSymbol(board, "bonus");
    const jackpot = this.rollJackpot(totalWin);

    return {
      board,
      cascades,
      totalWin: Number((totalWin + jackpot.win).toFixed(2)),
      baseWin: Number(totalWin.toFixed(2)),
      freeSpinsAwarded: scatterCount >= GAME_CONFIG.math.freeSpinAward.scatterCount ? GAME_CONFIG.math.freeSpinAward.spins : 0,
      bonusTriggered: bonusCount >= GAME_CONFIG.math.bonusAward.minBonusSymbols,
      jackpotHit: jackpot.name,
      jackpotWin: jackpot.win,
      tier: this.getWinTier(totalWin)
    };
  }

  evaluateBoard(board) {
    const wins = [];
    const positions = new Set();
    let baseWin = 0;

    GAME_CONFIG.layout.paylines.forEach((line, lineIndex) => {
      const symbols = line.map((row, reel) => board[reel][row]);
      const result = this.evaluateLine(symbols);
      if (!result) return;
      baseWin += result.win;
      wins.push({ lineIndex: lineIndex + 1, symbol: result.symbol, count: result.count, win: result.win });
      for (let reel = 0; reel < result.count; reel += 1) positions.add(`${reel}:${line[reel]}`);
    });

    return { wins, positions, baseWin: Number(baseWin.toFixed(2)) };
  }

  evaluateLine(symbols) {
    const payable = symbols.find((id) => id !== "wild");
    if (!payable || payable === "scatter" || payable === "bonus") return null;
    let count = 0;
    for (const id of symbols) {
      if (id === payable || id === "wild") count += 1;
      else break;
    }
    if (count < 3) return null;
    const symbol = findSymbol(payable);
    return { symbol: payable, count, win: symbol.paytable[count] || 0 };
  }

  cascadeBoard(board, positions) {
    return board.map((reel, reelIndex) => {
      const survivors = reel.filter((_, rowIndex) => !positions.has(`${reelIndex}:${rowIndex}`));
      while (survivors.length < GAME_CONFIG.layout.rows) survivors.unshift(getWeightedSymbol(this.rng).id);
      return survivors;
    });
  }

  countSymbol(board, id) {
    return board.flat().filter((symbolId) => symbolId === id).length;
  }

  rollJackpot(totalWin) {
    if (totalWin <= 0) return { name: "", win: 0 };
    for (const jackpot of GAME_CONFIG.math.jackpots) {
      if (this.rng() < jackpot.chance) return { name: jackpot.name, win: jackpot.multiplier * GAME_CONFIG.math.baseBet };
    }
    return { name: "", win: 0 };
  }

  getWinTier(win) {
    if (win >= 100) return "Super Win";
    if (win >= 40) return "Mega Win";
    if (win >= 15) return "Big Win";
    if (win > 0) return "Win";
    return "";
  }
}
