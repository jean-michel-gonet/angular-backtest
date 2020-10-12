import { MarketTiming, BearBull } from '../core/market-timing';
import { Candlestick, InstantQuotes } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';
import { AtrIndicator } from '../calculations/indicators/atr-indicator';

interface IStopLossMarketTiming {
  /** The name of the asset to watch.*/
  assetName: string;

  /** The idientifier of this market timing.*/
  id?: string;

  /** The initial status.*/
  status?: BearBull;

  /** The number of periods used to calculate the ATR. */
  numberOfPeriods?: number;

  /** The multiple of ATR that triggers the stop loss. */
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

  private averageTrueRange: AtrIndicator;

  private countDown: number;
  private atr: number;
  private l1: number

  constructor(obj = {} as IStopLossMarketTiming) {
    let {
      assetName,
      id = 'STOPLOSS',
      status = BearBull.BULL,
      numberOfPeriods = 14,
      threshold = 2
    } = obj;
    this.assetName = assetName;
    this.id = id;
    this.status = status;
    this.threshold = threshold;
    this.countDown = numberOfPeriods;
    this.averageTrueRange = new AtrIndicator(numberOfPeriods);
  }

  record(instantQuotes: InstantQuotes): void {
    let instant: Date = instantQuotes.instant;
    let quote: Candlestick = instantQuotes.quote(this.assetName);
    if (quote) {
      this.recordQuote(instant, quote);
    }
  }

  private recordQuote(instant: Date, candlestick: Candlestick) {
    // Updates the ATR:
    this.atr = this.averageTrueRange.calculate(instant, candlestick);

    if (this.atr && --this.countDown <= 0) {
      // Updates the L1:
      let l1: number = candlestick.close - this.threshold * this.atr;
      if (!this.l1) {
        this.l1 = l1;
      } else {
        if (l1 > this.l1) {
          this.l1 = l1;
          this.status = BearBull.BULL;
        }
        if (candlestick.close < this.l1) {
          this.l1 = candlestick.close;
          this.status = BearBull.BEAR;
        }
      }
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
  }
}
