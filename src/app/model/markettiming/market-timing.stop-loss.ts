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
  public status: BearBull;

  private averageTrueRange: OnlineAverageTrueRange;

  private atr: number;
  private l1: number

  private annotations: string[] = [];

  constructor(obj = {} as IStopLossMarketTiming) {
    let {
      assetName,
      id = 'STOPLOSS',
      status = BearBull.BULL,
      threshold = 2,
    } = obj;
    this.assetName = assetName;
    this.id = id;
    this.status = status;
    this.threshold = threshold;
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

    let status: BearBull;

    if (this.atr) {
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
          status = BearBull.BEAR;
        }
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
    }
    this.annotations = this.annotations.filter(annotation =>{
      report.receiveData(new ReportedData({
        sourceName: this.id + "." + annotation
      }))
      return false;
    });
  }
}
