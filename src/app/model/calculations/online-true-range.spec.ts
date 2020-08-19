import { OnlineTrueRange, OnlineAverageTrueRange } from "./online-true-range";
import { Candlestick } from '../core/quotes';

describe("OnlineTrueRange", () => {
  it("Can create a new instance", () => {
    let onlineTrueRange = new OnlineTrueRange();
    expect(onlineTrueRange).toBeTruthy();
  });

  it("Can detect true range when previous close is between current high-low", () => {
    let onlineTrueRange = new OnlineTrueRange();
    onlineTrueRange.trueRange(new Candlestick({close: 50}));
    let tr = onlineTrueRange.trueRange(new Candlestick({close: 30, high: 100, low: 20}));
    expect(tr).toBe(100 - 20);
  });

  it("Can detect true range when previous close is above current high", () => {
    let onlineTrueRange = new OnlineTrueRange();
    onlineTrueRange.trueRange(new Candlestick({close: 50}));
    let tr = onlineTrueRange.trueRange(new Candlestick({close: 30, high: 40, low: 20}));
    expect(tr).toBe(50 - 20);
  });

  it("Can detect true range when previous close is below current low", () => {
    let onlineTrueRange = new OnlineTrueRange();
    onlineTrueRange.trueRange(new Candlestick({close: 10}));
    let tr = onlineTrueRange.trueRange(new Candlestick({close: 30, high: 40, low: 20}));
    expect(tr).toBe(40 - 10);
  });
});

describe("OnlineAverageTrueRange", () => {
  it("Can create a new instance", () => {
    let onlineAverageTrueRange: OnlineAverageTrueRange = new OnlineAverageTrueRange(10);
    expect(onlineAverageTrueRange).toBeTruthy();
  });
});
