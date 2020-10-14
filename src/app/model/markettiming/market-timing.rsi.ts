import { MarketTiming, BearBull } from '../core/market-timing';
import { Quote, InstantQuotes } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';
import { PeriodLength } from '../core/period';
import { ConfigurableSource, ConfigurablePreprocessing } from '../calculations/indicators/configurable-source';
import { RsiIndicator, RsiAverage } from '../calculations/indicators/rsi-indicator';

export class IRsiMarketTiming {
  assetName: string;
  id?: string;
  status?: BearBull;
  source?: ConfigurableSource;
  preprocessing?: ConfigurablePreprocessing;
  periodLength?: PeriodLength;
  numberOfPeriods?: number;

  rsiAverage?: RsiAverage;
  upperThreshold?: number;
  lowerThreshold?: number;
  lag?: number;
}

/**
 * This indicator measures the difference between two moving averages
 * (EMA), a fast one and a slow one.
 * When the fast is higher than the slow, then it is a BULL period.
 * See also the MACDMarketTiming.
 * @class {EMAMarketTiming}
 */
export class RsiMarketTiming implements MarketTiming {
  assetName: string;
  id: string;
  status: BearBull;
  upperThreshold: number;
  lowerThreshold: number;
  countDown: number;

  rsi: number;
  previousRsi: number;
  numberOfTriggers: number = 0;

  rsiIndicator: RsiIndicator;

  constructor(obj = {} as IRsiMarketTiming) {
    let {
      assetName,
      id = "RSI",
      status = BearBull.BEAR,
      source = ConfigurableSource.CLOSE,
      preprocessing = ConfigurablePreprocessing.LAST,
      periodLength = PeriodLength.DAILY,
      numberOfPeriods = 14,
      rsiAverage = RsiAverage.WILDER,
      upperThreshold = 70,
      lowerThreshold = 30
    } = obj;
    this.assetName = assetName;
    this.id = id;
    this.status = status;
    this.upperThreshold = upperThreshold;
    this.lowerThreshold = lowerThreshold;
    this.countDown = numberOfPeriods;

    this.rsiIndicator = new RsiIndicator({
      numberOfPeriods: numberOfPeriods,
      periodLength: periodLength,
      preprocessing: preprocessing,
      source: source,
      rsiAverage: rsiAverage});

    console.log("RSI Market Timing", this);
  }

  record(instantQuotes: InstantQuotes): void {
    let instant: Date = instantQuotes.instant;
    let quote: Quote = instantQuotes.quote(this.assetName);
    if (quote) {
      this.recordQuote(instant, quote);
    }
  }

  recordQuote(instant: Date, quote: Quote): void {
    this.rsi = this.rsiIndicator.calculate(instant, quote);

    if (this.rsi && --this.countDown < 0) {
      if (this.previousRsi >= this.upperThreshold && this.rsi < this.upperThreshold) {
        this.status = BearBull.BEAR;
      }
      if (this.previousRsi <= this.lowerThreshold && this.rsi > this.lowerThreshold) {
        this.status = BearBull.BULL;
      }
      this.previousRsi = this.rsi;
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
    if (this.rsi && this.countDown < 0) {
      report.receiveData(new ReportedData({
        sourceName: this.id + ".RSI",
        y: this.rsi
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".TRI",
        y: this.numberOfTriggers
      }));
    }
  }
}
