import { MarketTiming, BearBull } from './core/market-timing';
import { Quote } from './core/quotes';
import { Report, ReportedData } from './core/reporting';
import { IEMAMarketTiming, EMAMarketTiming } from './market-timing.ema';

export enum PeriodLength {
  DAY,
  WEEK,
  MONTH
}

class IMACDMarketTiming extends IEMAMarketTiming {
  triggerPeriod?: number;
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
export class MACDMarketTiming extends EMAMarketTiming implements MarketTiming {
  triggerPeriod: number;
  triggerEMA: number;

  constructor(obj = {} as IMACDMarketTiming){
    super(obj);
    let {
      triggerPeriod = 9,
    } = obj;
    this.triggerPeriod = triggerPeriod;
  }

  record(instant: Date, quote: Quote): void {
    if (this.endOfPeriod(instant, this.lastInstant)) {
        let periodMean = this.mean(this.periodQuotes);
        this.shortEMA = this.ema(this.shortEMA, this.shortPeriod, periodMean);
        this.longEMA  = this.ema(this.longEMA , this.longPeriod , periodMean);
        this.difference = this.shortEMA - this.longEMA;
        this.triggerEMA = this.ema(this.triggerEMA, this.triggerPeriod, this.difference);

        switch(this.status) {
          case BearBull.BEAR:
            if (this.triggerEMA < this.difference) {
              this.status = BearBull.BULL;
            }
            break;

          case BearBull.BULL:
          if (this.triggerEMA > this.difference) {
            this.status = BearBull.BEAR;
          }
          break;
        }

        this.periodQuotes = [];
    }

    this.periodQuotes.push(quote.close);
    this.lastInstant = instant;
  }

  reportTo(report: Report): void {
    report.receiveData(new ReportedData({
      sourceName: this.id + ".MACD",
      y: this.difference
    }));
    report.receiveData(new ReportedData({
      sourceName: this.id + ".TRIGGER",
      y: this.triggerEMA
    }));
  }

}
