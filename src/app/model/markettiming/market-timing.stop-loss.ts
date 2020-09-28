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

  private atr: number;
  private l1: number
  private l2: number
  private n: number;

  private annotations: string[] = [];

  constructor(obj = {} as IStopLossMarketTiming) {
    let {
      assetName,
      id = 'STOPLOSS',
      status = BearBull.BULL,
      threshold = 2,
      safety = 0,
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
    this.atr = this.averageTrueRange.atr(candlestick);
    if (this.atr < 0.5) {
      this.atr = 0.5
    }

    let status: BearBull;

    // Updates the L1:
    let l1: number = candlestick.close - this.threshold * this.atr;
    if (!this.l1) {
      this.l1 = l1;
    } else {
      if (l1 > this.l1) {
        this.l1 = l1;
        status = BearBull.BULL;
      }
      if (candlestick.close < this.l1) {
        this.l1 = candlestick.close;
      }
    }

    // Updates the L2:
    let l2: number = candlestick.close + this.threshold * this.atr;
    if (!this.l2) {
      this.l2 = l2;
    } else {
      if (l2 < this.l2) {
        this.l2 = l2;
        status = BearBull.BEAR;
      }
      if (candlestick.close > this.l2) {
        this.l2 = candlestick.close;
      }
    }

    // Annotates the status variation:
    if (status && status != this.status) {
      this.annotations.push(status);
      this.status = status;
    }
  }

  bearBull(): BearBull {
    return this.status;
  }

  doRegister(report: Report): void {
    report.register(this);
  }

  startReportingCycle(instant: Date): void {
    // Nothing to do.
  }

  reportTo(report: Report): void {
    if (this.atr) {
      report.receiveData(new ReportedData({
        sourceName: this.id + ".ATR",
        y: this.atr
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".L1",
        y: this.l1
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".L2",
        y: this.l2
      }));
    }
    this.annotations = this.annotations.filter(annotation =>{
      report.receiveData(new ReportedData({
        sourceName: this.id + "." + annotation
      }))
      return false;
    });
  }
}
