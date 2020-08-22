import { MarketTiming, BearBull } from '../core/market-timing';
import { Candlestick, InstantQuotes } from '../core/quotes';
import { Report } from '../core/reporting';
import { MovingLinearRegression } from '../calculations/moving-linear-regression';
import { PeriodLength } from '../core/period';
import { OnlineSma } from '../calculations/online-sma';
import { OnlineTrueRange } from '../calculations/true-range';

interface IStopLossMarketTiming {
  /** The name of the asset to watch.*/
  assetName: string;

  /** The idientifier of this market timing.*/
  id?: string;

  /** The initial status.*/
  status?: BearBull;

  /**
   * The multiple of ATR that triggers the stop loss.
   * Specify 3 if you want to stop your losses (or collect your gains )
   * after a variation of three times the ATR.
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

/**
 * This is a fast reacting market timing that is intend to work together with
 * a slower one like EMA or Superthon.
 * class{StopLossMarketTiming}
 */
export class StopLossMarketTiming implements MarketTiming {
  public assetName: string;
  public id: string;
  public threshold: number;
  public safety: number;
  public recovery: number;
  public status: BearBull;
  private previous: Candlestick;

  private trueRange: OnlineTrueRange;
  private onlineSma: OnlineSma;
  private movingLinearRegression: MovingLinearRegression;

  constructor(obj = {} as IStopLossMarketTiming) {
    let {
      assetName,
      id = 'STOPLOSS',
      status = BearBull.BULL,
      threshold = 2,
      safety = 10,
      recovery = 1
    } = obj;
    this.assetName = assetName;
    this.id = id;
    this.status = status;
    this.threshold = threshold;
    this.safety = safety;
    this.recovery = recovery;
    this.trueRange = new OnlineTrueRange();
    this.onlineSma = new OnlineSma(14);
  }

  record(instantQuotes: InstantQuotes): void {
    let instant: Date = instantQuotes.instant;
    let quote: Candlestick = instantQuotes.quote(this.assetName);
    if (quote) {
      this.recordQuote(instant, quote);
    }
  }

  recordQuote(instant: Date, candlestick: Candlestick) {
    // Updates the ATR:
    let tr: number = this.trueRange.trueRange(candlestick);
    let atr: number = this.onlineSma.smaOf(tr);

    switch(this.status) {
      // Stays in BULL until the quote drops below the threshold:
      case BearBull.BULL:
        // Looks out for drops:
        if (this.previous) {
          let change: number = candlestick.close -  this.previous.close;
          if (change > atr * this.threshold) {
            console.log("Stop Loss going BEAR ", instant, change, atr, this.threshold, candlestick, this.previous)
            this.status = BearBull.BEAR;
            this.movingLinearRegression = new MovingLinearRegression({
              numberOfPeriods: this.safety,
              periodLength: PeriodLength.DAILY
            });
            this.movingLinearRegression.calculate(instant, candlestick);
          }
        }
        break;

      // Stays in BEAR until recovery.
      case BearBull.BEAR:
        let mlr = this.movingLinearRegression.calculate(instant, candlestick);
        if (mlr && mlr > this.recovery) {
          console.log("Stop Loss going BULL", instant, candlestick, mlr, this.recovery);
          this.status = BearBull.BULL;
        }
        break;
    }

    // Keep candlestick as previous value:
    this.previous = candlestick;
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
