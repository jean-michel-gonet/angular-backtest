import { MarketTiming, BearBull } from '../core/market-timing';
import { Quote, InstantQuotes } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';
import { Periodicity } from '../core/period';
import { ConfigurableSource, ConfigurablePreprocessing } from '../calculations/indicators/configurable-source';
import { ConfigurableSourceIndicator } from '../calculations/indicators/configurable-source-indicator';
import { EmaIndicator } from '../calculations/indicators/ema-indicator';
import { ImmediateIndicator } from '../calculations/indicators/immediate-indicator';

export class IEMAMarketTiming {
  assetName: string;
  id?: string;
  source?: ConfigurableSource;
  preprocessing?: ConfigurablePreprocessing;
  periodicity?: Periodicity;
  fastPeriod?: number;
  slowPeriod?: number;
  status?: BearBull;
  threshold?: number;
  offset?: number;
}

/**
 * This indicator measures the difference between two moving averages
 * (EMA), a fast one and a slow one.
 * When the fast is higher than the slow, then it is a BULL period.
 * See also the MACDMarketTiming.
 * @class {EMAMarketTiming}
 */
export class EMAMarketTiming implements MarketTiming {
  assetName: string;
  id: string;
  status: BearBull;
  threshold: number;
  offset: number;

  fastEMA: ConfigurableSourceIndicator;
  fastEMAValue: number;
  slowEMA: EmaIndicator;
  slowEMAValue: number;

  difference: number;

  numberOfTriggers: number = 0;

  constructor(obj = {} as IEMAMarketTiming){
    let {
      assetName,
      id = "EMA",
      source = ConfigurableSource.CLOSE,
      preprocessing = ConfigurablePreprocessing.LAST,
      periodicity = Periodicity.MONTHLY,
      fastPeriod = 5,
      slowPeriod = 15,
      status = BearBull.BEAR,
      threshold = 0,
      offset = 0
    } = obj;
    this.assetName = assetName;
    this.id = id;
    this.status = status;
    this.threshold = threshold;
    this.offset = offset;

    this.slowEMA = new EmaIndicator({
      numberOfPeriods: slowPeriod,
      periodicity: periodicity,
      source: source,
      preprocessing: preprocessing
    });

    if (fastPeriod) {
      this.fastEMA = new EmaIndicator({
        numberOfPeriods: fastPeriod,
        periodicity: periodicity,
        source: source,
        preprocessing: preprocessing
      });
    } else {
      this.fastEMA = new ImmediateIndicator({
        periodicity: periodicity,
        source: source,
        preprocessing: preprocessing
      })
    }
    console.log("EMAMarketTiming " + this.id, this);
  }

  listQuotesOfInterest(): string[] {
    return [this.assetName];
  }

  record(instantQuotes: InstantQuotes): void {
    let instant: Date = instantQuotes.instant;
    let quote: Quote = instantQuotes.quote(this.assetName);
    if (quote) {
      this.recordQuote(instant, quote);
    }
  }

  recordQuote(instant: Date, quote: Quote): void {
    this.slowEMAValue = this.slowEMA.calculate(instant, quote);
    this.fastEMAValue = this.fastEMA.calculate(instant, quote);
    if (this.slowEMAValue) {
      this.difference =
        (this.fastEMAValue - this.slowEMAValue) / (this.fastEMAValue + this.slowEMAValue);
      switch (this.status) {
        case BearBull.BULL:
          if (this.difference < this.offset - this.threshold) {
            this.status = BearBull.BEAR;
            console.log("EMAMarketTiming " + this.id,
              this.difference,
              this.offset - this.threshold,
              ++this.numberOfTriggers,
              BearBull.BEAR,
              instant);
          }
          break;
        case BearBull.BEAR:
          if (this.difference > this.offset + this.threshold) {
            this.status = BearBull.BULL;
            console.log("EMAMarketTiming " + this.id,
              this.difference,
              this.offset - this.threshold,
              ++this.numberOfTriggers,
              BearBull.BULL,
              instant);
          }
          break;
      }
    } else {
      this.difference = null;
    }
  }

  bearBull(): BearBull {
    return this.status;
  }

  doRegister(report :Report): void {
    report.register(this);
  }

  startReportingCycle(instant: Date): void {
    // Nothing to do.
  }

  reportTo(report: Report): void {
    if (this.difference) {
      report.receiveData(new ReportedData({
        sourceName: this.id + ".DIFF",
        y: this.difference
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".FAST",
        y: this.fastEMAValue
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".SLOW",
        y: this.slowEMAValue
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".TRI",
        y: this.numberOfTriggers
      }));
    }
  }

}
