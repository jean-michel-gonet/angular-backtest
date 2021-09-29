import { RsiMarketTiming } from "./market-timing.rsi";
import { BearBull } from '../core/market-timing';
import { Periodicity } from '../core/period';
import { ConfigurableSource, ConfigurablePreprocessing } from '../calculations/indicators/configurable-source';
import { RsiAverage } from '../calculations/indicators/rsi-indicator';
import { InstantQuotes, Quote } from '../core/quotes';

describe("RsiMarketTiming", () => {

  it("Can be instantiated", () => {
    let marketTiming: RsiMarketTiming = new RsiMarketTiming({
      assetName: "ASS",
      id: "RSIID",
      status: BearBull.BEAR,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.FIRST,
      periodicity: Periodicity.DAILY,
      numberOfPeriods: 14,
      rsiAverage: RsiAverage.CUTLER,
      upperThreshold: 70,
      lowerThreshold: 30
    });
    expect(marketTiming).toBeTruthy();
    expect(marketTiming.listQuotesOfInterest()).toEqual(["ASS"]);
  });

  it("Can configure appropriately the inner RSI indicator", () => {
    let source = ConfigurableSource.CLOSE;
    let status = BearBull.BEAR;
    let preprocessing = ConfigurablePreprocessing.FIRST;
    let periodicity = Periodicity.DAILY;
    let numberOfPeriods = 23;

    let marketTiming: RsiMarketTiming = new RsiMarketTiming({
      assetName: "ASS",
      id: "RSIID",
      status: status,
      source: source,
      preprocessing: preprocessing,
      periodicity: periodicity,
      numberOfPeriods: numberOfPeriods,
      rsiAverage: RsiAverage.CUTLER,
      upperThreshold: 70,
      lowerThreshold: 30
    });
    expect(marketTiming.rsiIndicator.numberOfPeriods).toBe(numberOfPeriods);
    expect(marketTiming.rsiIndicator.periodicity).toBe(periodicity);
    expect(marketTiming.rsiIndicator.preprocessing).toBe(preprocessing);
    expect(marketTiming.rsiIndicator.source).toBe(source);
  })

  it("Can use RSI to detect BULL/BEAR", () => {
    let marketTiming: RsiMarketTiming = new RsiMarketTiming({
      assetName: "ASS",
      id: "RSIID",
      status: BearBull.BULL,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.FIRST,
      periodicity: Periodicity.DAILY,
      numberOfPeriods: 14,
      rsiAverage: RsiAverage.WILDER,
      upperThreshold: 70,
      lowerThreshold: 30
    });

    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1,  1), quotes: [new Quote({name: "ASS", close:100.00})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1,  2), quotes: [new Quote({name: "ASS", close:101.25})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1,  3), quotes: [new Quote({name: "ASS", close:102.49})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1,  4), quotes: [new Quote({name: "ASS", close:103.68})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1,  5), quotes: [new Quote({name: "ASS", close:104.82})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1,  6), quotes: [new Quote({name: "ASS", close:105.88})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1,  7), quotes: [new Quote({name: "ASS", close:106.85})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1,  8), quotes: [new Quote({name: "ASS", close:107.71})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1,  9), quotes: [new Quote({name: "ASS", close:108.44})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 10), quotes: [new Quote({name: "ASS", close:109.05})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 11), quotes: [new Quote({name: "ASS", close:109.51})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 12), quotes: [new Quote({name: "ASS", close:109.82})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 13), quotes: [new Quote({name: "ASS", close:109.98})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 14), quotes: [new Quote({name: "ASS", close:109.98})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 15), quotes: [new Quote({name: "ASS", close:109.82})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 16), quotes: [new Quote({name: "ASS", close:109.51})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 17), quotes: [new Quote({name: "ASS", close:109.05})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 18), quotes: [new Quote({name: "ASS", close:108.44})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 19), quotes: [new Quote({name: "ASS", close:107.71})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 20), quotes: [new Quote({name: "ASS", close:106.85})]}));
    expect(marketTiming.bearBull()).toBe(BearBull.BULL);
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 21), quotes: [new Quote({name: "ASS", close:105.88})]}));
    expect(marketTiming.bearBull()).toBe(BearBull.BEAR);
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 22), quotes: [new Quote({name: "ASS", close:104.82})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 23), quotes: [new Quote({name: "ASS", close:103.68})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 24), quotes: [new Quote({name: "ASS", close:102.49})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 25), quotes: [new Quote({name: "ASS", close:101.25})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 26), quotes: [new Quote({name: "ASS", close:100.00})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 27), quotes: [new Quote({name: "ASS", close: 98.75})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 28), quotes: [new Quote({name: "ASS", close: 97.51})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 29), quotes: [new Quote({name: "ASS", close: 96.32})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 30), quotes: [new Quote({name: "ASS", close: 95.18})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,1 - 1, 31), quotes: [new Quote({name: "ASS", close: 94.12})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1,  1), quotes: [new Quote({name: "ASS", close: 93.15})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1,  2), quotes: [new Quote({name: "ASS", close: 92.29})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1,  3), quotes: [new Quote({name: "ASS", close: 91.56})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1,  4), quotes: [new Quote({name: "ASS", close: 90.95})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1,  5), quotes: [new Quote({name: "ASS", close: 90.49})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1,  6), quotes: [new Quote({name: "ASS", close: 90.18})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1,  7), quotes: [new Quote({name: "ASS", close: 90.02})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1,  8), quotes: [new Quote({name: "ASS", close: 90.02})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1,  9), quotes: [new Quote({name: "ASS", close: 90.18})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1, 10), quotes: [new Quote({name: "ASS", close: 90.49})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1, 11), quotes: [new Quote({name: "ASS", close: 90.95})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1, 12), quotes: [new Quote({name: "ASS", close: 91.56})]}));
    expect(marketTiming.bearBull()).toBe(BearBull.BEAR);
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1, 13), quotes: [new Quote({name: "ASS", close: 92.29})]}));
    expect(marketTiming.bearBull()).toBe(BearBull.BULL);
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1, 14), quotes: [new Quote({name: "ASS", close: 93.15})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1, 15), quotes: [new Quote({name: "ASS", close: 94.12})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1, 16), quotes: [new Quote({name: "ASS", close: 95.18})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1, 17), quotes: [new Quote({name: "ASS", close: 96.32})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1, 18), quotes: [new Quote({name: "ASS", close: 97.51})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1, 19), quotes: [new Quote({name: "ASS", close: 98.75})]}));
    marketTiming.record(new InstantQuotes({instant: new Date(2008,2 - 1, 20), quotes: [new Quote({name: "ASS", close:100.00})]}));
    expect(marketTiming.bearBull()).toBe(BearBull.BULL);
  });
});
