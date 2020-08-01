import { MarketTiming, BearBull } from '../core/market-timing';
import { Quote } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';
import { PeriodLength } from '../core/period';
import { MovingAverageSource, MovingAveragePreprocessing } from '../calculations/moving-calculator';
import { ExponentialMovingAverage } from '../calculations/exponential-moving-average';

export class IEMAMarketTiming {
  id?: string;
  source?: MovingAverageSource;
  preprocessing?: MovingAveragePreprocessing;
  periodLength?: PeriodLength;
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
  id: string;
  status: BearBull;
  threshold: number;
  offset: number;

  fastEMA: ExponentialMovingAverage;
  fastEMAValue: number;
  slowEMA: ExponentialMovingAverage;
  slowEMAValue: number;

  difference: number;

  numberOfTriggers: number = 0;

  constructor(obj = {} as IEMAMarketTiming){
    let {
      id = "EMA",
      source = MovingAverageSource.CLOSE,
      preprocessing = MovingAveragePreprocessing.LAST,
      periodLength = PeriodLength.MONTHLY,
      fastPeriod = 5,
      slowPeriod = 15,
      status = BearBull.BEAR,
      threshold = 0,
      offset = 0
    } = obj;
    this.id = id;
    this.status = status;
    this.threshold = threshold;
    this.offset = offset;

    this.slowEMA = new ExponentialMovingAverage({
      numberOfPeriods: slowPeriod,
      periodLength: periodLength,
      source: source,
      preprocessing: preprocessing
    });

    this.fastEMA = new ExponentialMovingAverage({
      numberOfPeriods: fastPeriod,
      periodLength: periodLength,
      source: source,
      preprocessing: preprocessing
    });
    console.log("EMA Market Timing", this);
  }

  record(instant: Date, quote: Quote): void {
    this.slowEMAValue = this.slowEMA.calculate(instant, quote);
    this.fastEMAValue = this.fastEMA.calculate(instant, quote);
    if (this.slowEMAValue) {
      this.difference =
        (this.fastEMAValue - this.slowEMAValue) / (this.fastEMAValue + this.slowEMAValue);
      switch (this.status) {
        case BearBull.BULL:
          if (this.difference < this.offset - this.threshold) {
            this.status = BearBull.BEAR;
            console.log("EMA Market Timing",
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
            console.log("EMA Market Timing",
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
