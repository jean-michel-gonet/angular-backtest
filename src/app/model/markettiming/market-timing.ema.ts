import { MarketTiming, BearBull } from '../core/market-timing';
import { Quote } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';
import { PeriodLength } from '../core/period';
import { EmaCalculator, MovingAverageSource, MovingAveragePreprocessing } from '../core/moving-average';

export class IEMAMarketTiming {
  id?: string;
  source?: MovingAverageSource;
  preprocessing?: MovingAveragePreprocessing;
  periodLength?: PeriodLength;
  shortPeriod?: number;
  longPeriod?: number;
  status?: BearBull;
}

/**
 * This indicator measures the difference between two moving averages
 * (EMA), a short one and a long one.
 * When the short is higher than the long, then it is a BULL period.
 * See also the MACDMarketTiming.
 * @class {EMAMarketTiming}
 */
export class EMAMarketTiming implements MarketTiming {
  id: string;
  shortEMA: EmaCalculator;
  longEMA: EmaCalculator;

  status: BearBull;
  difference: number;

  constructor(obj = {} as IEMAMarketTiming){
    let {
      id = "EMA",
      source = MovingAverageSource.CLOSE,
      preprocessing = MovingAveragePreprocessing.LAST,
      periodLength = PeriodLength.MONTHLY,
      shortPeriod = 5,
      longPeriod = 15,
      status = BearBull.BEAR
    } = obj;
    console.log("Starting EMAMarketTiming", id, periodLength, shortPeriod, longPeriod, status);
    this.id = id;
    this.status = status;

    this.longEMA = new EmaCalculator({
      numberOfPeriods: longPeriod,
      periodLength: periodLength,
      source: source,
      preprocessing: preprocessing
    });

    this.shortEMA = new EmaCalculator({
      numberOfPeriods: shortPeriod,
      periodLength: periodLength,
      source: source,
      preprocessing: preprocessing
    });
  }

  record(instant: Date, quote: Quote): void {
    let longEMA = this.longEMA.ema(instant, quote);
    let shortEMA = this.shortEMA.ema(instant, quote);
    if (longEMA) {
      this.difference = shortEMA - longEMA;
      if (this.difference > 0) {
        this.status = BearBull.BULL;
      } else {
        this.status = BearBull.BEAR;
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
        sourceName: this.id + ".SEMA",
        y: this.shortEMA.lastValue
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".LEMA",
        y: this.longEMA.lastValue
      }));
    }
  }

}
