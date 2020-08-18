import { StopLossMarketTiming } from "./market-timing.stop-loss";
import { BearBull } from '../core/market-timing';
import { Candlestick, InstantQuotes, Quote } from '../core/quotes';

describe("StopLosMarketTiming", () => {
  it("Can be instantiated", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BEAR,
      threshold: 0.2,
      safety: 4
    });
    expect(stopLossMarketTiming).toBeTruthy();
  });

  it("Can react to a drop", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BULL,
      threshold: 95,
      safety: 4
    });
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 100})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 96})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 94})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });

  it("Can react to a drop after experiencing a raise", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BULL,
      threshold: 95,
      safety: 4,
      recovery: 0.1
    });
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 80})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 100})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 96})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 94})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });

  it("Can recover after a drop", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BULL,
      threshold: 95.1,
      safety: 5,
      recovery: 3.0
    });
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(1999, 11, 31), quotes: [new Quote({name: 'ANY', close: 1000})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);

    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 1), quotes: [new Quote({name: 'ANY', close: 950.0})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 2), quotes: [new Quote({name: 'ANY', close: 945.7})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 3), quotes: [new Quote({name: 'ANY', close: 947.0})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 4), quotes: [new Quote({name: 'ANY', close: 947.0})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);

    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 5), quotes: [new Quote({name: 'ANY', close: 947.0})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 6), quotes: [new Quote({name: 'ANY', close: 946.0})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 7), quotes: [new Quote({name: 'ANY', close: 947.9})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
  });

  it("Can detect a second drop after a recovery", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BULL,
      threshold: 95.1,
      safety: 5,
      recovery: 3
    });
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(1999, 11, 31), quotes: [new Quote({name: 'ANY', close: 1000})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);

    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 1), quotes: [new Quote({name: 'ANY', close: 950.0})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 2), quotes: [new Quote({name: 'ANY', close: 945.7})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 3), quotes: [new Quote({name: 'ANY', close: 947.0})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 4), quotes: [new Quote({name: 'ANY', close: 947.0})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);

    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 5), quotes: [new Quote({name: 'ANY', close: 950.0})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);

    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(2000, 1, 6), quotes: [new Quote({name: 'ANY', close: 902.0})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });
});
