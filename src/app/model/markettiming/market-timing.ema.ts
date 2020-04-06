import { MarketTiming, BearBull } from '../core/market-timing';
import { Quote } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';
import { PeriodLength, Period } from '../core/period';

export class IEMAMarketTiming {
  id?: string;
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
  periodLength?: PeriodLength;
  shortPeriod: number;
  longPeriod: number;
  status: BearBull;

  period: Period;
  shortEMA: number;
  longEMA: number;
  difference: number;

  protected periodQuotes: number[] = [];

  constructor(obj = {} as IEMAMarketTiming){
    let {
      id = "EMA",
      periodLength = PeriodLength.MONTHLY,
      shortPeriod = 5,
      longPeriod = 15,
      status = BearBull.BEAR
    } = obj;
    this.id = id;
    this.periodLength = periodLength;
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
    this.status = status;

    this.period = new Period(periodLength);
  }

  record(instant: Date, quote: Quote): void {
    if (this.period.changeOfPeriod(instant)) {
        let periodMean = this.mean(this.periodQuotes);
        this.shortEMA = this.ema(this.shortEMA, this.shortPeriod, periodMean);
        this.longEMA  = this.ema(this.longEMA , this.longPeriod , periodMean);
        this.difference = this.shortEMA - this.longEMA;

        if (this.difference > 0) {
          this.status = BearBull.BULL;
        } else {
          this.status = BearBull.BEAR;
        }

        this.periodQuotes = [];
    }

    this.periodQuotes.push(quote.close);
  }

  bearBull(): BearBull {
    return this.status;
  }

  magnitude(): number {
    return this.difference;
  }

  protected mean(values: number[]):number {
    let mean: number = 0;
    for (let n: number = 0; n < values.length; n++) {
      mean += values[n];
    }
    mean /= values.length;
    return mean;
  }

  protected ema(previousEma: number, numberOfPeriods: number, latestQuote: number) {
    if (previousEma) {
      let k: number = 2 / (numberOfPeriods + 1);
      return latestQuote * k + previousEma * (1 - k);
    } else {
      return latestQuote;
    }
  }

  doRegister(report :Report): void {
    report.register(this);
  }

  startReportingCycle(instant: Date): void {
    // Nothing to do.
  }

  reportTo(report: Report): void {
    report.receiveData(new ReportedData({
      sourceName: this.id + ".DIFF",
      y: this.difference
    }));
    report.receiveData(new ReportedData({
      sourceName: this.id + ".SEMA",
      y: this.shortEMA
    }));
    report.receiveData(new ReportedData({
      sourceName: this.id + ".LEMA",
      y: this.longEMA
    }));
  }

}
