import { MarketTiming, BearBull } from './core/market-timing';
import { Report, ReportedData } from './core/reporting';
import { Candlestick, CandlestickType } from './core/quotes';
import { PeriodLength, Period } from './core/period';

class ISuperthonMarketTiming {
  id?: string;
  periods?: number;
  periodLength?: PeriodLength;
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
  private period?: Period;
  private candles: Candlestick[] = [];
  private status: BearBull;
  private numericalStatus: number;
  private currentCandle: Candlestick;

  constructor(obj = {} as ISuperthonMarketTiming){
    let {
      id = "SPT",
      periods = 12,
      periodLength = PeriodLength.MONTHLY,
      status = BearBull.BULL
    } = obj;
    this.id = id;
    this.periods = periods;
    this.period = new Period(periodLength);
    this.status = status;
  }

  record(instant: Date, candlestick: Candlestick): void {
    if (candlestick) {
      this.recordCandles(instant, candlestick);
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

  private recordCandles(instant: Date, candlestick: Candlestick): void {
    // First candlestick is used for initialization:
    if (!this.currentCandle) {
      this.currentCandle = candlestick;
      this.period.changeOfPeriod(instant);
    }

    // Subsequent candlestick are taken into account:
    else {
      if (this.period.changeOfPeriod(instant)) {
        this.candles.push(this.currentCandle);
        this.currentCandle = candlestick;
      } else {
        this.currentCandle = this.currentCandle.merge(candlestick);
      }
    }
  }

  private countCandles(): number {
    if (this.candles.length >= this.periods) {
      let positiveCandles = 0;
      let relevantCandles: Candlestick[] = this.candles.slice(-this.periods);
      relevantCandles.forEach(c => {
        if (c.type() == CandlestickType.GREEN) {
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
