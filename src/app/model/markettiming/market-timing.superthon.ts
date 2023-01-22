import { MarketTiming, BearBull } from '../core/market-timing';
import { Report, ReportedData } from '../core/reporting';
import { Candlestick, CandlestickType, InstantQuotes } from '../core/quotes';
import { Periodicity, Period } from '../core/period';

class ISuperthonMarketTiming {
  assetName: string;
  id?: string;
  periods?: number;
  periodicity?: Periodicity;
  threshold?: number;
  status?: BearBull;
}

/**
 * The Superthon Market Timing works by the number of monthly candles
 * that were positive in the last periods (usually 12).
 * See http://www.loscanalesdesuperthon.com/p/mis-indicadores.html
 */
export class SuperthonMarketTiming implements MarketTiming {
  assetName: string;
  id: string;
  periods: number;
  periodicity: Periodicity;
  threshold: number;
  private period?: Period;
  private candles: Candlestick[] = [];
  private status: BearBull;
  private numericalStatus: number;
  private currentCandle: Candlestick;
  private numberOfTriggers: number = 0;

  constructor(obj = {} as ISuperthonMarketTiming){
    let {
      assetName,
      id = "SPT",
      periods = 12,
      periodicity = Periodicity.MONTHLY,
      threshold = 1,
      status = BearBull.BULL
    } = obj;
    this.assetName = assetName;
    this.id = id;
    this.periods = periods;
    this.periodicity = periodicity;
    this.threshold = threshold;
    this.period = new Period(periodicity);
    this.status = status;
    console.log("Superthon id=" + this.id +
                " periods=" + this.periods +
                " periodicity=" + this.periodicity +
                " threshold=" + this.threshold +
                " status=" + this.status);
  }

  listQuotesOfInterest(): string[] {
    return [this.assetName];
  }

  record(instantQuotes: InstantQuotes): void {
    let instant = instantQuotes.instant;
    let quote: Candlestick = instantQuotes.quote(this.assetName);
    if (quote) {
      this.recordQuote(instant, quote);
    }
  }

  recordQuote(instant: Date, candlestick: Candlestick): void {
    if (candlestick) {
      this.recordCandles(instant, candlestick);
      this.numericalStatus = this.countCandles();

      switch(this.status) {
        case BearBull.BEAR:
          if (this.numericalStatus >= this.threshold) {
            console.log("Market Timing Superthon", ++this.numberOfTriggers, BearBull.BULL, instant);
            this.status = BearBull.BULL;
          }
          break;

        case BearBull.BULL:
        if (this.numericalStatus <= - this.threshold) {
          console.log("Market Timing Superthon", ++this.numberOfTriggers, BearBull.BEAR, instant);
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
    report.receiveData(new ReportedData({
      sourceName: this.id + ".TRI",
      y: this.numberOfTriggers
    }));
  }

}
