import { StopLossMarketTiming } from "./market-timing.stop-loss";
import { BearBull } from '../core/market-timing';
import { Candlestick } from '../core/quotes';

describe("StopLosMarketTiming", () => {
  it("Can be instantiated", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      status: BearBull.BEAR,
      threshold: 0.2,
      safety: 4
    });
    expect(stopLossMarketTiming).toBeTruthy();
  });

  it("Can react to a drop", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      status: BearBull.BULL,
      threshold: 0.95,
      safety: 4
    });
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new Date(), new Candlestick({close: 100}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new Date(), new Candlestick({close: 96}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new Date(), new Candlestick({close: 94}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });

  it("Can react to a drop after experiencing a raise", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      status: BearBull.BULL,
      threshold: 0.95,
      safety: 4,
      recovery: 0.1
    });
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new Date(), new Candlestick({close: 80}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new Date(), new Candlestick({close: 100}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new Date(), new Candlestick({close: 96}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new Date(), new Candlestick({close: 94}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });

  it("Can recover after a drop", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      status: BearBull.BULL,
      threshold: 0.95,
      safety: 2,
      recovery: 0.1
    });
    stopLossMarketTiming.record(new Date(2000, 1, 1), new Candlestick({close: 100}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);

    stopLossMarketTiming.record(new Date(2000, 1, 2), new Candlestick({close: 94}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);

    stopLossMarketTiming.record(new Date(2000, 1, 3), new Candlestick({close: 95}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);

    stopLossMarketTiming.record(new Date(2000, 1, 4), new Candlestick({close: 96}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);

    stopLossMarketTiming.record(new Date(2000, 1, 5), new Candlestick({close: 97}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
  });

  it("Can detect a second drop after a recovery", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      status: BearBull.BULL,
      threshold: 0.95,
      safety: 2,
      recovery: 0.1
    });
    stopLossMarketTiming.record(new Date(2000, 1, 1), new Candlestick({close: 100}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);

    stopLossMarketTiming.record(new Date(2000, 1, 2), new Candlestick({close: 94}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);

    stopLossMarketTiming.record(new Date(2000, 1, 3), new Candlestick({close: 95}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);

    stopLossMarketTiming.record(new Date(2000, 1, 4), new Candlestick({close: 96}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);

    stopLossMarketTiming.record(new Date(2000, 1, 5), new Candlestick({close: 97}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);

    stopLossMarketTiming.record(new Date(2000, 1, 6), new Candlestick({close: 92.15}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);

    stopLossMarketTiming.record(new Date(2000, 1, 6), new Candlestick({close: 92.14}));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });

});
