import { MarketTiming, BearBull } from "../core/market-timing";
import { Candlestick, InstantQuotes, Quote } from '../core/quotes';
import { Report, NullReport } from '../core/reporting';
import { MultipleMarketTiming } from './market-timing.multiple';

class MockMarketTiming implements MarketTiming {
  public reportingInstant: Date;
  public registeredTo: Report;
  public reportedTo: Report;
  public instant: Date;
  public candlestick: Candlestick;
  public id:string = "MOCK";

  constructor(private assetName: string, private response: BearBull) {}

  record(instantQuotes: InstantQuotes): void {
    this.instant = instantQuotes.instant;
    this.candlestick = instantQuotes.quote(this.assetName);
  }

  bearBull(): BearBull {
    return this.response;
  }
  doRegister(report: Report): void {
    this.registeredTo = report;
  }
  startReportingCycle(instant: Date): void {
    this.reportingInstant = instant;
  }
  reportTo(report: Report): void {
    this.reportedTo = report;
  }
}

describe("MultipleMarketTiming", () => {
  it("Can create a new instance", () => {
    let multipleMarketTiming: MultipleMarketTiming = new MultipleMarketTiming([
      new MockMarketTiming("ONE", BearBull.BULL),
      new MockMarketTiming("TWO", BearBull.BULL)
    ]);
    expect(multipleMarketTiming).toBeTruthy();
  });

  it("Can implement AND / BULL scheme", () => {
    let multipleMarketTiming: MultipleMarketTiming;

    multipleMarketTiming = new MultipleMarketTiming([
      new MockMarketTiming("ONE", BearBull.BULL),
      new MockMarketTiming("TWO", BearBull.BULL)
    ]);
    expect(multipleMarketTiming.bearBull()).toBe(BearBull.BULL);

    multipleMarketTiming = new MultipleMarketTiming([
      new MockMarketTiming("ONE", BearBull.BEAR),
      new MockMarketTiming("TWO", BearBull.BULL)
    ]);
    expect(multipleMarketTiming.bearBull()).toBe(BearBull.BEAR);

    multipleMarketTiming = new MultipleMarketTiming([
      new MockMarketTiming("ONE", BearBull.BULL),
      new MockMarketTiming("TWO", BearBull.BEAR)
    ]);
    expect(multipleMarketTiming.bearBull()).toBe(BearBull.BEAR);

    multipleMarketTiming = new MultipleMarketTiming([
      new MockMarketTiming("ONE", BearBull.BEAR),
      new MockMarketTiming("TWO", BearBull.BEAR)
    ]);
    expect(multipleMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });

  it("Can propagate the market timing events", () => {
    let marketTiming1: MockMarketTiming = new MockMarketTiming("ONE", BearBull.BULL);
    let marketTiming2: MockMarketTiming = new MockMarketTiming("ONE", BearBull.BEAR);
    let multipleMarketTiming: MultipleMarketTiming =
        new MultipleMarketTiming([marketTiming1, marketTiming2]);

    let instant: Date = new Date();
    let quote: Quote = new Quote({
      name: "ONE",
      open: 100,
      close: 110,
      high: 90,
      low: 101
    })

    multipleMarketTiming.record(new InstantQuotes({
      instant: instant,
      quotes: [quote]
    }));

    expect(marketTiming1.instant).toBe(instant);
    expect(marketTiming1.candlestick).toBe(quote);
    expect(marketTiming2.instant).toBe(instant);
    expect(marketTiming2.candlestick).toBe(quote);

  });

  it("Can propagate the report events", () => {
    let marketTiming1: MockMarketTiming = new MockMarketTiming("ONE", BearBull.BULL);
    let marketTiming2: MockMarketTiming = new MockMarketTiming("TWO", BearBull.BEAR);
    let multipleMarketTiming: MultipleMarketTiming =
        new MultipleMarketTiming([marketTiming1, marketTiming2]);

    let report: NullReport = new NullReport();

    multipleMarketTiming.doRegister(report);
    expect(marketTiming1.registeredTo).toBeUndefined();
    expect(marketTiming2.registeredTo).toBeUndefined();

    let instant: Date = new Date();
    multipleMarketTiming.startReportingCycle(instant);
    expect(marketTiming1.reportingInstant).toBe(instant);
    expect(marketTiming2.reportingInstant).toBe(instant);

    multipleMarketTiming.reportTo(report);
    expect(marketTiming1.reportedTo).toBe(report);
    expect(marketTiming2.reportedTo).toBe(report);
  })
});
