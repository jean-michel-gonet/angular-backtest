import { MarketTiming, BearBull } from '../core/market-timing';
import { Candlestick, InstantQuotes } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';
import { OnlineAverageTrueRange } from '../calculations/online-average-true-range';

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

  private averageTrueRange: OnlineAverageTrueRange;

  private atrLevel: number;
  private atrValue: number

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
    this.averageTrueRange = new OnlineAverageTrueRange(14);
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
    this.atrValue = this.averageTrueRange.atr(candlestick);

    // Updates the level:
    let l1: number = candlestick.close - this.threshold * this.atrValue;
    if (!this.atrLevel || l1 > this.atrLevel) {
      this.atrLevel = l1;
    }
    if (candlestick.close < this.atrLevel) {
      this.atrLevel = candlestick.close;
    }
  }

  bearBull(): BearBull {
    return BearBull.BULL;
  }

  doRegister(report: Report): void {
    report.register(this);
  }

  startReportingCycle(instant: Date): void {
    // Nothing to do.
  }

  reportTo(report: Report): void {
    if (this.atrLevel) {
      report.receiveData(new ReportedData({
        sourceName: this.id + ".ATR",
        y: this.atrLevel
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".ATRT",
        y: this.atrLevel + this.atrValue * this.threshold
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".ATRM",
        y: this.atrLevel + this.atrValue * (this.threshold - 2)
      }));
    }
  }
}
