import { MarketTiming, BearBull } from './core/market-timing';
import { Quote } from './core/asset';
import { Report, ReportedData } from './core/reporting';

export enum PeriodLength {
  DAY,
  WEEK,
  MONTH
}

class IMonthlyMACDMarketTiming {
  name: string;
  periodLength?: PeriodLength;
  shortPeriod?: number;
  longPeriod?: number;
  triggerPeriod?: number;
  status?: BearBull;
}

/**
 * The MACD indicator measures the difference between two moving averages
 * (EMA) and is depicted as a line. The usual representation of the MACD
 * indicator has another line – a short 9-day EMA of MACD – plotted together
 * with the MACD in the chart, to act as a trigger indicator.
 * A buying signal is gotten from MACD when the MACD line crosses the 9-day
 * trigger EMA. In turn, a sell signal is gotten from the reverse.
 * See https://www.iexplain.org/calculate-macd/
 * See also https://investsolver.com/calculate-macd-in-excel/
 * @class {MACDMarketTiming}
 */
export class MACDMarketTiming implements MarketTiming {
  name: string;
  periodLength?: PeriodLength;
  shortPeriod: number;
  longPeriod: number;
  triggerPeriod: number;
  status: BearBull;

  shortEMA: number;
  longEMA: number;
  macd: number;
  triggerEMA: number;

  private lastInstant: Date;
  private periodQuotes: number[] = [];

  constructor(obj = {} as IMonthlyMACDMarketTiming){
    let {
      name,
      periodLength = PeriodLength.MONTH,
      shortPeriod = 12,
      longPeriod = 26,
      triggerPeriod = 9,
      status = BearBull.BEAR
    } = obj;
    this.name = name;
    this.periodLength = periodLength;
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
    this.triggerPeriod = triggerPeriod;
    this.status = status;
  }

  record(instant: Date, quote: Quote): void {
    if (this.endOfPeriod(instant, this.lastInstant)) {
        let periodMean = this.mean(this.periodQuotes);
        this.shortEMA = this.ema(this.shortEMA, this.shortPeriod, periodMean);
        this.longEMA  = this.ema(this.longEMA , this.longPeriod , periodMean);
        this.macd = this.shortEMA - this.longEMA;
        this.triggerEMA = this.ema(this.triggerEMA, this.triggerPeriod, this.macd);

        switch(this.status) {
          case BearBull.BEAR:
            if (this.triggerEMA < this.macd) {
              this.status = BearBull.BULL;
            }
            break;

          case BearBull.BULL:
          if (this.triggerEMA > this.macd) {
            this.status = BearBull.BEAR;
          }
          break;
        }

        this.periodQuotes = [];
    }

    this.periodQuotes.push(quote.partValue);
    this.lastInstant = instant;
  }

  private endOfPeriod(instant: Date, instantBefore: Date): boolean {
    if (this.lastInstant) {
      switch(this.periodLength) {
        case PeriodLength.MONTH:
          return instant.getMonth() != instantBefore.getMonth();

        case PeriodLength.WEEK:
          return instant.getDay() < instantBefore.getDay();

        case PeriodLength.DAY:
          return instant.getDate() != instantBefore.getDate();
      }
    } else {
      return false;
    }
  }

  private mean(values: number[]):number {
    let mean: number = 0;
    for (let n: number = 0; n < values.length; n++) {
      mean += values[n];
    }
    mean /= values.length;
    return mean;
  }

  private ema(previousEma: number, numberOfPeriods: number, latestQuote: number) {
    if (previousEma) {
      let k: number = 2 / (numberOfPeriods + 1);
      return latestQuote * k + previousEma * (1 - k);
    } else {
      return latestQuote;
    }
  }

  bearBull(): BearBull {
    return this.status;
  }

  magnitude(): number {
    return this.triggerEMA;
  }

  doRegister(report :Report): void {
    report.register(this);
  }

  startReportingCycle(instant: Date): void {
    // Nothing to do.
  }

  reportTo(report: Report): void {
    report.receiveData(new ReportedData({
      sourceName: this.name + ".MACD",
      y: this.macd
    }));
    report.receiveData(new ReportedData({
      sourceName: this.name + ".TRIGGER",
      y: this.triggerEMA
    }));
  }

}
