import { OnlineTrueRange, OnlineAverageTrueRange } from "./true-range";
import { Candlestick } from '../core/quotes';

/**
 * Examples from https://school.stockcharts.com/doku.php?id=technical_indicators:average_true_range_atr
 */
describe("OnlineTrueRange", () => {
  it("Can create a new instance", () => {
    let onlineTrueRange = new OnlineTrueRange();
    expect(onlineTrueRange).toBeTruthy();
  });

  it("Can detect TR of the first sample", () => {
    let onlineTrueRange = new OnlineTrueRange();
    let tr: number = onlineTrueRange.trueRange(new Candlestick({high: 48.70, low: 47.79, close: 48.16}));
    expect(tr).toBeCloseTo(0.91, 2);
  });

  it("Can detect TR of the second sample", () => {
    let onlineTrueRange = new OnlineTrueRange();
    onlineTrueRange.trueRange(new Candlestick({high: 48.70, low: 47.79, close: 48.16}));
    let tr: number = onlineTrueRange.trueRange(new Candlestick({high: 48.72, low: 48.14, close: 48.61}));
    expect(tr).toBeCloseTo(0.58, 2);
  });

  it("Can detect TR in different cases", () => {
    let onlineTrueRange = new OnlineTrueRange();
    let tr: number;
    tr = onlineTrueRange.trueRange(new Candlestick({high: 49.05, low: 48.64, close: 49.03}));

    tr = onlineTrueRange.trueRange(new Candlestick({high: 49.20, low: 48.94, close: 49.07}));
    expect(tr).toBeCloseTo(0.26);
    tr = onlineTrueRange.trueRange(new Candlestick({high: 49.35, low: 48.86, close: 49.32}));
    expect(tr).toBeCloseTo(0.49);
    tr = onlineTrueRange.trueRange(new Candlestick({high: 49.92, low: 49.50, close: 49.91}));
    expect(tr).toBeCloseTo(0.60);
    tr = onlineTrueRange.trueRange(new Candlestick({high: 50.19, low: 49.87, close: 50.13}));
    expect(tr).toBeCloseTo(0.32);
    tr = onlineTrueRange.trueRange(new Candlestick({high: 50.12, low: 49.20, close: 49.53}));
    expect(tr).toBeCloseTo(0.93);
  });
});

describe("OnlineAverageTrueRange", () => {
  it("Can create a new instance", () => {
    let onlineAverageTrueRange: OnlineAverageTrueRange = new OnlineAverageTrueRange(10);
    expect(onlineAverageTrueRange).toBeTruthy();
  });

  it("Can calculate the ATR over 5 periods", () => {
    let onlineAverageTrueRange: OnlineAverageTrueRange = new OnlineAverageTrueRange(14);

    onlineAverageTrueRange.atr(new Candlestick({high: 48.70, low: 47.79, close: 48.16}));
    onlineAverageTrueRange.atr(new Candlestick({high: 48.72, low: 48.14, close: 48.61}));
    onlineAverageTrueRange.atr(new Candlestick({high: 48.90, low: 48.39, close: 48.75}));
    onlineAverageTrueRange.atr(new Candlestick({high: 48.87, low: 48.37, close: 48.63}));
    onlineAverageTrueRange.atr(new Candlestick({high: 48.82, low: 48.24, close: 48.74}));
    onlineAverageTrueRange.atr(new Candlestick({high: 49.05, low: 48.64, close: 49.03}));
    onlineAverageTrueRange.atr(new Candlestick({high: 49.20, low: 48.94, close: 49.07}));
    onlineAverageTrueRange.atr(new Candlestick({high: 49.35, low: 48.86, close: 49.32}));
    onlineAverageTrueRange.atr(new Candlestick({high: 49.92, low: 49.50, close: 49.91}));
    onlineAverageTrueRange.atr(new Candlestick({high: 50.19, low: 49.87, close: 50.13}));
    onlineAverageTrueRange.atr(new Candlestick({high: 50.12, low: 49.20, close: 49.53}));
    onlineAverageTrueRange.atr(new Candlestick({high: 49.66, low: 48.90, close: 49.50}));
    onlineAverageTrueRange.atr(new Candlestick({high: 49.88, low: 49.43, close: 49.75}));
    onlineAverageTrueRange.atr(new Candlestick({high: 50.19, low: 49.73, close: 50.03}));
    onlineAverageTrueRange.atr(new Candlestick({high: 50.36, low: 49.26, close: 50.31}));
    onlineAverageTrueRange.atr(new Candlestick({high: 50.57, low: 50.09, close: 50.52}));
    onlineAverageTrueRange.atr(new Candlestick({high: 50.65, low: 50.30, close: 50.41}));
    onlineAverageTrueRange.atr(new Candlestick({high: 50.43, low: 49.21, close: 49.34}));
    onlineAverageTrueRange.atr(new Candlestick({high: 49.63, low: 48.98, close: 49.37}));
    onlineAverageTrueRange.atr(new Candlestick({high: 50.33, low: 49.61, close: 50.23}));
    onlineAverageTrueRange.atr(new Candlestick({high: 50.29, low: 49.20, close: 49.24}));
    onlineAverageTrueRange.atr(new Candlestick({high: 50.17, low: 49.43, close: 49.93}));
    onlineAverageTrueRange.atr(new Candlestick({high: 49.32, low: 48.08, close: 48.43}));
    onlineAverageTrueRange.atr(new Candlestick({high: 48.50, low: 47.64, close: 48.18}));
    onlineAverageTrueRange.atr(new Candlestick({high: 48.32, low: 41.55, close: 46.57}));
    onlineAverageTrueRange.atr(new Candlestick({high: 46.80, low: 44.28, close: 45.41}));
    onlineAverageTrueRange.atr(new Candlestick({high: 47.80, low: 47.31, close: 47.77}));
    onlineAverageTrueRange.atr(new Candlestick({high: 48.39, low: 47.20, close: 47.72}));
    onlineAverageTrueRange.atr(new Candlestick({high: 48.66, low: 47.90, close: 48.62}));
    onlineAverageTrueRange.atr(new Candlestick({high: 48.79, low: 47.73, close: 47.85}));

  });
});
