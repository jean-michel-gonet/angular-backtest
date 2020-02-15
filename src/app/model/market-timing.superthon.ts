import { MarketTiming, BearBull } from './core/market-timing';
import { Quote } from './core/asset';
import { Report, ReportedData } from './core/reporting';

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
  name: string;
  months?: number;
  status?: BearBull;
}

/**
 * The Superthon Market Timing works by the number of monthly candles
 * that were positive in the last months (usually 12).
 * See http://www.loscanalesdesuperthon.com/p/mis-indicadores.html
 */
export class SuperthonMarketTiming implements MarketTiming {
  private name: string;
  private months: number;
  private candles: Candle[] = [];
  private status: BearBull;
  private numericalStatus: number;
  private lastInstant: Date;
  private currentCandle: Candle;

  constructor(obj = {} as ISuperthonMarketTiming){
    let {
      name = "",
      months = 12,
      status = BearBull.BULL
    } = obj;
    this.name = name;
    this.months = months;
    this.status = status;
  }

  record(instant: Date, quote: Quote): void {
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

  private recordCandles(instant: Date, quote: Quote): void {

    // At first day of the month...
    if (!this.lastInstant || instant.getMonth() != this.lastInstant.getMonth()) {

      // ... Close the current candle.
      if (this.currentCandle) {
        this.currentCandle.close(instant, quote.partValue);
        this.candles.push(this.currentCandle);
      }

      // ... Open the next candle.
      this.currentCandle = new Candle({
        firstDay: instant,
        quoteAtFirstDay: quote.partValue
      });
    }

    // Remember this day:
    this.lastInstant = instant;
  }

  private countCandles(): number {
    if (this.candles.length >= this.months) {
      let positiveCandles = 0;
      let relevantCandles: Candle[] = this.candles.slice(-this.months);
      relevantCandles.forEach(c => {
        if (c.trend > 0) {
          positiveCandles += 1;
        }
      });
      return positiveCandles - 6;
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
      sourceName: this.name + ".SUPERTHON",
      y: this.numericalStatus
    }));
  }

}
