import { MarketTiming, BearBull } from '../core/market-timing';
import { Candlestick } from '../core/quotes';
import { Report } from '../core/reporting';
import { MovingLinearRegression } from '../calculations/moving-linear-regression';
import { PeriodLength } from '../core/period';

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

/**
 * This is a fast reacting market timing that is intend to work together with
 * a slower one like EMA or Superthon.
 * class{StopLossMarketTiming}
 */
export class StopLossMarketTiming implements MarketTiming {
  public id: String;
  public threshold: number;
  public safety: number;
  public recovery: number;
  public status: BearBull;
  private max: Candlestick;

  private movingLinearRegression: MovingLinearRegression;

  constructor(obj = {} as IStopLossMarketTiming) {
    let {
      id = 'STOPLOSS',
      status = BearBull.BULL,
      threshold = 95,
      safety = 3,
      recovery = 1
    } = obj;
    this.id = id;
    this.status = status;
    this.threshold = threshold / 100;
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
          this.movingLinearRegression = new MovingLinearRegression({
            numberOfPeriods: this.safety,
            periodLength: PeriodLength.DAILY
          });
          this.movingLinearRegression.calculate(instant, candlestick);
        }
        break;

      // Stays in BEAR until recovery.
      case BearBull.BEAR:
        let mlr = this.movingLinearRegression.calculate(instant, candlestick);
        if (mlr && mlr > this.recovery) {
          console.log("Stop Loss going BULL", instant, candlestick, mlr, this.recovery);
          this.status = BearBull.BULL;
          this.max = candlestick;
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
