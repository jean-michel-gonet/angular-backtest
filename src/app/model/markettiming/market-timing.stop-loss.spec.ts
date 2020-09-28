import { StopLossMarketTiming } from "./market-timing.stop-loss";
import { BearBull } from '../core/market-timing';
import { InstantQuotes, Quote } from '../core/quotes';

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

  it("Can react to a drop after experiencing a raise", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BULL,
      threshold: 4,
      safety: 4
    });
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 100})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 110})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 100})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 69})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });

  it("Can react to a drop after experiencing a drop", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BULL,
      threshold: 4,
      safety: 4
    });
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 100})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 90})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 100})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 59})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });

  it("Can recover after a drop", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BULL,
      threshold: 4,
      safety: 4
    });
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 100})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 90})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 100})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 59})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);

    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 79})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 89})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 99})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 109})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: 119})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
  });
});
