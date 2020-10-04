import { StopLossMarketTiming } from "./market-timing.stop-loss";
import { BearBull } from '../core/market-timing';
import { InstantQuotes, Quote } from '../core/quotes';

describe("StopLosMarketTiming", () => {
  it("Can be instantiated", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BEAR,
      threshold: 0.2
    });
    expect(stopLossMarketTiming).toBeTruthy();
  });

  it("Can wait the specified number of periods before changing status", () => {
    let numberOfPeriods: number = 25;
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BEAR,
      threshold: 4,
      numberOfPeriods: numberOfPeriods
    });
    let n: number;
    for(n = 0; n <= numberOfPeriods; n++) {
      stopLossMarketTiming.record(new InstantQuotes({
          instant: new Date(),
          quotes: [new Quote({name: 'ANY', close: n * 10})]
        }));
      expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    }
    stopLossMarketTiming.record(new InstantQuotes({
        instant: new Date(),
        quotes: [new Quote({name: 'ANY', close: numberOfPeriods * n})]
      }));
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
  });

  it("Can react to a drop after experiencing a raise", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BULL,
      threshold: 4,
      numberOfPeriods: 14
    });
    let atr: number = 10;
    let close: number;
    for(var n = 0; n <= 14; n++) {
      close = n * atr;
      stopLossMarketTiming.record(new InstantQuotes({
          instant: new Date(),
          quotes: [new Quote({name: 'ANY', close: close})]
        }));
    }

    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close + atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 3 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 3.1 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });

  it("Can react to a drop after experiencing a drop", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BULL,
      threshold: 4,
      numberOfPeriods: 14
    });

    let atr: number = 10;
    let close: number;
    for(var n = 0; n <= 14; n++) {
      close = n * atr;
      stopLossMarketTiming.record(new InstantQuotes({
          instant: new Date(),
          quotes: [new Quote({name: 'ANY', close: close})]
        }));
    }

    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 4 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 4.1 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });

  it("Can recover after a drop", () => {
    let stopLossMarketTiming: StopLossMarketTiming = new StopLossMarketTiming({
      assetName: "ANY",
      status: BearBull.BULL,
      threshold: 4
    });

    let atr: number = 10;
    let close: number;
    for(var n = 0; n <= 14; n++) {
      close = n * atr;
      stopLossMarketTiming.record(new InstantQuotes({
          instant: new Date(),
          quotes: [new Quote({name: 'ANY', close: close})]
        }));
    }

    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 1 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 2 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 3 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 4 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);

    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 5 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);

    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 4 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 3 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 2 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 1 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BEAR);
    stopLossMarketTiming.record(new InstantQuotes({instant: new Date(), quotes: [new Quote({name: 'ANY', close: close - 0 * atr})]}));;
    expect(stopLossMarketTiming.bearBull()).toBe(BearBull.BULL);

  });
});
