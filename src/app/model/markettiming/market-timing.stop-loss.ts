import { MarketTiming, BearBull } from '../core/market-timing';
import { Candlestick } from '../core/quotes';
import { Report } from '../core/reporting';

interface IStopLossMarketTiming {
  id?: string,
  status?: BearBull;
  threshold?: number;
  safety?: number;
}

export class StopLossMarketTiming implements MarketTiming {
  public id: String;
  public threshold: number;
  public safety: number;
  public status: BearBull;
  private max: Candlestick;
  private last: Candlestick;
  private count: number;

  constructor(obj = {} as IStopLossMarketTiming) {
    let {
      id = 'STOPLOSS',
      status = BearBull.BULL,
      threshold = 95 / 100,
      safety = 3
    } = obj;
    this.id = id;
    this.status = status;
    this.threshold = threshold;
    this.safety = safety;
  }

  record(instant: Date, candlestick: Candlestick): void {
    switch(this.status) {
      // Stays in BULL until the quote drops below the threshold:
      case BearBull.BULL:
        // Keeps track of the max closing quote:
        if (!this.max) {
          this.max = candlestick;
        } else if (candlestick.close > this.max.close) {
          this.max = candlestick;
        }
        // Looks out for drops:
        if (candlestick.close < this.max.close * this.threshold) {
          this.status = BearBull.BEAR;
          this.count = this.safety;
        }
        break;

      // Stays in bear until there have been enough green candlesticks
      case BearBull.BEAR:
        if (this.last) {
          if (candlestick.close > this.last.close) {
            this.count --;
            if (this.count < 1) {
              this.status = BearBull.BULL;
              this.max = candlestick;
            }
          } else {
            this.count = this.safety;
          }
        }
        break;
    }
    this.last = candlestick;
  }

  bearBull(): BearBull {
    return this.status;
  }

  doRegister(report: Report): void {
    // Do nothing.
  }
  startReportingCycle(instant: Date): void {
    // Do nothing.
  }
  reportTo(report: Report): void {
    // Do nothing.
  }
}
