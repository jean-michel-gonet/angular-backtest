import { MarketTiming, BearBull } from '../core/market-timing';
import { Quote, InstantQuotes } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';
import { PeriodLength } from '../core/period';
import { MovingAverageSource, MovingAveragePreprocessing } from '../calculations/moving-calculator';
import { ExponentialMovingAverage } from '../calculations/exponential-moving-average';
import { OnlineEma } from '../calculations/online-ema';

class IMACDMarketTiming {
  assetName: string;
  id?: string;
  periodLength?: PeriodLength;
  source?: MovingAverageSource;
  preprocessing?: MovingAveragePreprocessing;

  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;

  status?: BearBull;
}

/**
 * Moving Average Convergence Divergence (MACD) is a trend-following momentum
 * indicator that shows the relationship between two moving averages of a
 * security’s price.
 * The MACD is calculated by subtracting the 26-period Exponential
 * Moving Average (EMA) from the 12-period EMA. The result of that calculation
 * is the MACD line. A nine-day EMA of the MACD called the "signal line,"
 * is then plotted on top of the MACD line, which can function as a trigger
 * for buy and sell signals.
 * Traders may buy the security when the MACD crosses above its signal line
 * and sell - or short - the security when the MACD crosses below the
 * signal line.
 * see https://www.investopedia.com/terms/m/macd.asp
 * @class {MACDMarketTiming}
 */
export class MACDMarketTiming implements MarketTiming {
  assetName: string;
  id: string;
  status: BearBull;
  slowEma: ExponentialMovingAverage;
  slowEmaValue: number;
  fastEma: ExponentialMovingAverage;
  fastEmaValue: number;
  signalEma: OnlineEma;
  macd: number;
  signal: number;

  constructor(obj = {} as IMACDMarketTiming){
    let {
      assetName,
      id = "MACD",
      source = MovingAverageSource.CLOSE,
      preprocessing = MovingAveragePreprocessing.LAST,
      periodLength = PeriodLength.MONTHLY,
      fastPeriod = 12,
      slowPeriod = 26,
      signalPeriod = 9,
      status = BearBull.BULL
    } = obj;
    this.assetName = assetName;
    this.id = id;
    this.status = status;
    this.slowEma = new ExponentialMovingAverage({
      numberOfPeriods: slowPeriod,
      periodLength: periodLength,
      source: source,
      preprocessing: preprocessing,
    });
    this.fastEma = new ExponentialMovingAverage({
      numberOfPeriods: fastPeriod,
      periodLength: periodLength,
      source: source,
      preprocessing: preprocessing,
    });
    this.signalEma = new OnlineEma(signalPeriod);
  }

  record(instantQuotes: InstantQuotes): void {
    let instant: Date = instantQuotes.instant;
    let quote: Quote = instantQuotes.quote(this.assetName);
    if (quote) {
      this.recordQuote(instant, quote);
    }
  }

  recordQuote(instant: Date, quote: Quote): void {
    this.slowEmaValue = this.slowEma.calculate(instant, quote);
    this.fastEmaValue = this.fastEma.calculate(instant, quote);
    if (this.slowEmaValue) {
        this.macd = this.fastEmaValue - this.slowEmaValue;
        this.signal = this.signalEma.emaOf(this.macd);

        switch(this.status) {
          case BearBull.BEAR:
            if (this.signal < this.macd) {
              this.status = BearBull.BULL;
            }
            break;

          case BearBull.BULL:
          if (this.signal > this.macd) {
            this.status = BearBull.BEAR;
          }
          break;
        }
    } else {
      this.macd = null;
      this.signal = null;
    }
  }

  reportTo(report: Report): void {
    if (this.macd) {
      report.receiveData(new ReportedData({
        sourceName: this.id + ".SLOW",
        y: this.slowEmaValue
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".FAST",
        y: this.fastEmaValue
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".MACD",
        y: this.macd
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".SIGNAL",
        y: this.signal
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".HISTOGRAM",
        y: this.macd - this.signal
      }));
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

}
