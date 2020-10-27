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
  public status: BearBull;

  public atrIndicator: AtrIndicator;

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
    this.atrIndicator = new AtrIndicator(numberOfPeriods, threshold);
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
    this.l1 = this.atrIndicator.calculate(instant, candlestick);

    if (this.atrIndicator.downsInARow > 0) {
      this.status = BearBull.BEAR;
    }
    if (this.atrIndicator.upsInARow > 0) {
      this.status = BearBull.BULL;
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
    if (this.l1) {
      report.receiveData(new ReportedData({
        sourceName: this.id + ".L1",
        y: this.l1
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".ATR",
        y: this.atrIndicator.atr
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".UPS",
        y: this.atrIndicator.upsInARow
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".DOWNS",
        y: this.atrIndicator.downsInARow
      }));
    }
  }
}
