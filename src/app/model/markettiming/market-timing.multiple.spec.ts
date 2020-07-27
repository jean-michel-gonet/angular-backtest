import { MarketTiming, BearBull } from "../core/market-timing";
import { Candlestick } from '../core/quotes';
import { Report, NullReport } from '../core/reporting';
import { MultipleMarketTiming } from './market-timing.multiple';

class MockMarketTiming implements MarketTiming {
  public reportingInstant: Date;
  public registeredTo: Report;
  public reportedTo: Report;
  public instant: Date;
  public candlestick: Candlestick;

  constructor(private response: BearBull) {}

  record(instant: Date, candlestick: Candlestick): void {
    this.instant = instant;
    this.candlestick = candlestick;
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
      new MockMarketTiming(BearBull.BULL),
      new MockMarketTiming(BearBull.BULL)
    ]);
    expect(multipleMarketTiming).toBeTruthy();
  });

  it("Can implement AND / BULL scheme", () => {
    let multipleMarketTiming: MultipleMarketTiming;

    multipleMarketTiming = new MultipleMarketTiming([
      new MockMarketTiming(BearBull.BULL),
      new MockMarketTiming(BearBull.BULL)
    ]);
    expect(multipleMarketTiming.bearBull()).toBe(BearBull.BULL);

    multipleMarketTiming = new MultipleMarketTiming([
      new MockMarketTiming(BearBull.BEAR),
      new MockMarketTiming(BearBull.BULL)
    ]);
    expect(multipleMarketTiming.bearBull()).toBe(BearBull.BEAR);

    multipleMarketTiming = new MultipleMarketTiming([
      new MockMarketTiming(BearBull.BULL),
      new MockMarketTiming(BearBull.BEAR)
    ]);
    expect(multipleMarketTiming.bearBull()).toBe(BearBull.BEAR);

    multipleMarketTiming = new MultipleMarketTiming([
      new MockMarketTiming(BearBull.BEAR),
      new MockMarketTiming(BearBull.BEAR)
    ]);
    expect(multipleMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });

  it("Can propagate the market timing events", () => {
    let marketTiming1: MockMarketTiming = new MockMarketTiming(BearBull.BULL);
    let marketTiming2: MockMarketTiming = new MockMarketTiming(BearBull.BEAR);
    let multipleMarketTiming: MultipleMarketTiming =
        new MultipleMarketTiming([marketTiming1, marketTiming2]);

    let instant: Date = new Date();
    let candlestick: Candlestick = new Candlestick({open: 100, high: 110, low: 90, close: 101});
    multipleMarketTiming.record(instant, candlestick);

    expect(marketTiming1.instant).toBe(instant);
    expect(marketTiming1.candlestick).toBe(candlestick);
    expect(marketTiming2.instant).toBe(instant);
    expect(marketTiming2.candlestick).toBe(candlestick);

  });

  it("Can propagate the report events", () => {
    let marketTiming1: MockMarketTiming = new MockMarketTiming(BearBull.BULL);
    let marketTiming2: MockMarketTiming = new MockMarketTiming(BearBull.BEAR);
    let multipleMarketTiming: MultipleMarketTiming =
        new MultipleMarketTiming([marketTiming1, marketTiming2]);

    let report: NullReport = new NullReport();

    multipleMarketTiming.doRegister(report);
    expect(marketTiming1.registeredTo).toBe(report);
    expect(marketTiming2.registeredTo).toBe(report);

    let instant: Date = new Date();
    multipleMarketTiming.startReportingCycle(instant);
    expect(marketTiming1.reportingInstant).toBe(instant);
    expect(marketTiming2.reportingInstant).toBe(instant);

    multipleMarketTiming.reportTo(report);
    expect(marketTiming1.reportedTo).toBe(report);
    expect(marketTiming2.reportedTo).toBe(report);
  })
});
