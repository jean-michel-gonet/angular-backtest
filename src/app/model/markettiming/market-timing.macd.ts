import { MarketTiming, BearBull } from '../core/market-timing';
import { Quote } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';
import { PeriodLength } from '../core/period';
import { EMACalculator } from '../utils/ema';

class IMACDMarketTiming {
  id?: string;
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
  id: string;
  status: BearBull;
  longEMA: EMACalculator;
  shortEMA: EMACalculator;
  triggerEMA: EMACalculator;
  difference: number;

  constructor(obj = {} as IMACDMarketTiming){
    let {
      id = "MACD",
      periodLength = PeriodLength.MONTHLY,
      shortPeriod = 5,
      longPeriod = 15,
      triggerPeriod = 9,
      status = BearBull.BULL
    } = obj;
    this.id = id;
    this.status = status;
    this.longEMA = new EMACalculator(longPeriod, periodLength);
    this.shortEMA = new EMACalculator(shortPeriod, periodLength);
    this.triggerEMA = new EMACalculator(triggerPeriod, periodLength);
  }

  record(instant: Date, quote: Quote): void {
    let longEMA = this.longEMA.ema(instant, quote);
    let shortEMA = this.shortEMA.ema(instant, quote);
    if (longEMA) {
        this.difference = shortEMA - longEMA;
        let triggerEMA = this.triggerEMA.emaOf(this.difference);

        switch(this.status) {
          case BearBull.BEAR:
            if (triggerEMA < this.difference) {
              this.status = BearBull.BULL;
            }
            break;

          case BearBull.BULL:
          if (triggerEMA > this.difference) {
            this.status = BearBull.BEAR;
          }
          break;
        }
    }
  }

  reportTo(report: Report): void {
    report.receiveData(new ReportedData({
      sourceName: this.id + ".MACD",
      y: this.difference
    }));
    report.receiveData(new ReportedData({
      sourceName: this.id + ".TRIGGER",
      y: this.triggerEMA.lastValue
    }));
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

}
