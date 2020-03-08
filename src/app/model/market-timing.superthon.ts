import { MarketTiming, BearBull } from './core/market-timing';
import { Quote } from './core/asset';
import { Report, ReportedData } from './core/reporting';

export enum SuperthonPeriodLength {
  MONTHLY,
  SEMIMONTHLY,
  WEEKLY
}

interface ICandle {
  trend?: number,
  firstDay: Date;
  quoteAtFirstDay: number;
  lastDay?: Date;
  quoteAtLastDay?: number;
}

/**
 * A Candle is the difference between the quote at the begining of a period
 * and the quote at the end of a period.
 * @class {Candle}
 */
class Candle {
  public trend: number;
  public firstDay: Date;
  public quoteAtFirstDay: number;
  public lastDay: Date;
  public quoteAtLastDay: number;

  public constructor(obj: ICandle = {} as ICandle) {
    let {
      trend = 0,
      firstDay,
      quoteAtFirstDay,
      lastDay,
      quoteAtLastDay
    } = obj;
    this.trend = trend;
    this.firstDay = firstDay;
    this.quoteAtFirstDay = quoteAtFirstDay;
    this.lastDay = lastDay;
    this.quoteAtLastDay = quoteAtLastDay;
  }

  public close(lastDay: Date, quoteAtLastDay: number): void {
    this.lastDay = lastDay;
    this.quoteAtLastDay = quoteAtLastDay;
    if (this.quoteAtLastDay < this.quoteAtFirstDay) {
      this.trend = -1;
    }  else {
      this.trend = 1;
    }
  }
}

class ISuperthonMarketTiming {
  id?: string;
  periods?: number;
  periodLength?: SuperthonPeriodLength;
  status?: BearBull;
}

/**
 * The Superthon Market Timing works by the number of monthly candles
 * that were positive in the last periods (usually 12).
 * See http://www.loscanalesdesuperthon.com/p/mis-indicadores.html
 */
export class SuperthonMarketTiming implements MarketTiming {
  private id: string;
  private periods: number;
  private periodLength?: SuperthonPeriodLength;
  private candles: Candle[] = [];
  private status: BearBull;
  private numericalStatus: number;
  private lastInstant: Date;
  private currentCandle: Candle;

  constructor(obj = {} as ISuperthonMarketTiming){
    let {
      id = "SPT",
      periods = 12,
      periodLength = SuperthonPeriodLength.MONTHLY,
      status = BearBull.BULL
    } = obj;
    this.id = id;
    this.periods = periods;
    this.periodLength = periodLength;
    this.status = status;
  }

  record(instant: Date, quote: Quote): void {
    if (quote) {
      this.recordCandles(instant, quote);
      this.numericalStatus = this.countCandles();

      switch(this.status) {
        case BearBull.BEAR:
          if (this.numericalStatus >= 1) {
            this.status = BearBull.BULL;
          }
          break;

        case BearBull.BULL:
        if (this.numericalStatus <= -1) {
          this.status = BearBull.BEAR;
        }
        break;
      }
    }
  }

  private recordCandles(instant: Date, quote: Quote): void {

    // At first day of the month...
    if (this.changeOfPeriod(instant)) {

      // ... Close the current candle.
      if (this.currentCandle) {
        this.currentCandle.close(instant, quote.partValue.close);
        this.candles.push(this.currentCandle);
      }

      // ... Open the next candle.
      this.currentCandle = new Candle({
        firstDay: instant,
        quoteAtFirstDay: quote.partValue.close
      });
    }
  }

  private changeOfPeriod(instant: Date): boolean {
    let periodChanged: boolean;

    // If this is the first iteration, then it is also the beginning of
    // the first period:
    if (!this.lastInstant) {
      periodChanged = true;
    }
    // If this is not the first iteration, then we compare this instant
    // with previous instant:
    else {
      switch(this.periodLength) {
        case SuperthonPeriodLength.WEEKLY:
          periodChanged = instant.getDay() < this.lastInstant.getDay();
          break;
        case SuperthonPeriodLength.SEMIMONTHLY:
          periodChanged = (instant.getDate() >= 15 && this.lastInstant.getDate() < 15) ||
                          (instant.getDate() < this.lastInstant.getDate())
          break;
        default:
        case SuperthonPeriodLength.MONTHLY:
          periodChanged = !this.lastInstant || instant.getMonth() != this.lastInstant.getMonth();
          break;
      }
    }

    // Remember this day:
    this.lastInstant = instant;

    return periodChanged;
  }

  private countCandles(): number {
    if (this.candles.length >= this.periods) {
      let positiveCandles = 0;
      let relevantCandles: Candle[] = this.candles.slice(-this.periods);
      relevantCandles.forEach(c => {
        if (c.trend > 0) {
          positiveCandles += 1;
        }
      });
      return positiveCandles - this.periods / 2;
    }
  }

  bearBull(): BearBull {
    return this.status;
  }

  magnitude(): number {
    return this.numericalStatus;
  }

  doRegister(report :Report): void {
    report.register(this);
  }

  startReportingCycle(instant: Date): void {
    // Nothing to do.
  }

  reportTo(report: Report): void {
    report.receiveData(new ReportedData({
      sourceName: this.id + ".SUPERTHON",
      y: this.numericalStatus
    }));
  }

}
