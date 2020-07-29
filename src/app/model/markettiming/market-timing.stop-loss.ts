import { MarketTiming, BearBull } from '../core/market-timing';
import { Candlestick } from '../core/quotes';
import { Report } from '../core/reporting';
import { OnlineLinearRegression } from '../calculations/linear-regression';

interface IStopLossMarketTiming {
  /** The idientifier of this market timing.*/
  id?: string,
  /** The initial status.*/
  status?: BearBull;
  /**
   * The amount of the drop before activating stop loss.
   * Specify 0.95 if you want to stop your loss after a drop of 5%.
   */
  threshold?: number;
  /**
   * The number of days to wait before checking the linear regression for
   * recovery. Calculation for linear regression starts immediately, though.
   */
  safety?: number;
  /**
   * Minimal value for linear regression's A factor to recover.
   */
  recovery?: number;
}

const MILLISECONDS_IN_DAY: number = 1000 * 24 * 60 * 60;

export class StopLossMarketTiming implements MarketTiming {
  public id: String;
  public threshold: number;
  public safety: number;
  public recovery: number;
  public status: BearBull;
  private max: Candlestick;
  private count: number;

  private linearRegression: OnlineLinearRegression;

  constructor(obj = {} as IStopLossMarketTiming) {
    let {
      id = 'STOPLOSS',
      status = BearBull.BULL,
      threshold = 95 / 100,
      safety = 3,
      recovery = 1
    } = obj;
    this.id = id;
    this.status = status;
    this.threshold = threshold;
    this.safety = safety;
    this.recovery = recovery;
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
          console.log("Stop Loss going BEAR", instant, candlestick, this.max)
          this.status = BearBull.BEAR;
          this.count = this.safety;
          this.linearRegression = new OnlineLinearRegression();
        }
        break;

      // Stays in BEAR until recovery.
      case BearBull.BEAR:
        let x: number = instant.valueOf() / MILLISECONDS_IN_DAY;
        this.linearRegression.regression(x , candlestick.close);
        // Waits in bear for the duration of the safety.
        if (this.count > 0) {
          this.count--;
        }
        // Then waits until the linear regression is above recovery
        else {
          let a: number = this.linearRegression.getA();
          if (a > this.recovery) {
            console.log("Stop Loss going BULL", instant, candlestick)
            this.status = BearBull.BULL;
            this.max = candlestick;
          }
        }
        break;
    }
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
