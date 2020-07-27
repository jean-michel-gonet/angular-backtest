import { MarketTiming, BearBull } from '../core/market-timing';
import { Candlestick } from '../core/quotes';
import { Report } from '../core/reporting';

export class MultipleMarketTiming implements MarketTiming {

  constructor(private marketTimings: MarketTiming[]) {}

  record(instant: Date, candlestick: Candlestick): void {
    this.marketTimings.forEach(m => {
      m.record(instant, candlestick);
    });
  }

  bearBull(): BearBull {
    let response: BearBull = BearBull.BULL;

    this.marketTimings.forEach(m => {
      if (m.bearBull() == BearBull.BEAR) {
        response = BearBull.BEAR;
      }
    })

    return response;
  }

  doRegister(report: Report): void {
    this.marketTimings.forEach(m => {
      m.doRegister(report);
    });
  }

  startReportingCycle(instant: Date): void {
    this.marketTimings.forEach(m => {
      m.startReportingCycle(instant);
    });
  }

  reportTo(report: Report): void {
    this.marketTimings.forEach(m => {
      m.reportTo(report);
    });
  }
}
