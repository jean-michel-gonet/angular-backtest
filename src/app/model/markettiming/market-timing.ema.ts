import { MarketTiming, BearBull } from '../core/market-timing';
import { Quote } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';
import { PeriodLength } from '../core/period';
import { EmaCalculator, MovingAverageSource, MovingAveragePreprocessing } from '../calculations/moving-average';

export class IEMAMarketTiming {
  id?: string;
  source?: MovingAverageSource;
  preprocessing?: MovingAveragePreprocessing;
  periodLength?: PeriodLength;
  fastPeriod?: number;
  slowPeriod?: number;
  status?: BearBull;

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
  fastEMA: EmaCalculator;
  slowEMA: EmaCalculator;

  status: BearBull;
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
      status = BearBull.BEAR
    } = obj;
    console.log("EMA Market Timing", id, periodLength, fastPeriod, slowPeriod, status);
    this.id = id;
    this.status = status;

    this.slowEMA = new EmaCalculator({
      numberOfPeriods: slowPeriod,
      periodLength: periodLength,
      source: source,
      preprocessing: preprocessing
    });

    this.fastEMA = new EmaCalculator({
      numberOfPeriods: fastPeriod,
      periodLength: periodLength,
      source: source,
      preprocessing: preprocessing
    });
  }

  record(instant: Date, quote: Quote): void {
    let slowEMA = this.slowEMA.ema(instant, quote);
    let fastEMA = this.fastEMA.ema(instant, quote);
    if (slowEMA) {
      this.difference = fastEMA - slowEMA;
      switch (this.status) {
        case BearBull.BULL:
          if (this.difference < 0) {
            this.status = BearBull.BEAR;
            console.log("EMA Market Timing", ++this.numberOfTriggers, BearBull.BEAR, instant);
          }
          break;
        case BearBull.BEAR:
          if (this.difference > 0) {
            this.status = BearBull.BULL;
            console.log("EMA Market Timing", ++this.numberOfTriggers, BearBull.BULL, instant);
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
        y: this.fastEMA.lastValue
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".SLOW",
        y: this.slowEMA.lastValue
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".TRI",
        y: this.numberOfTriggers
      }));
    }
  }

}
