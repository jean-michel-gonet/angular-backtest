import { MarketTiming, BearBull } from '../core/market-timing';
import { Quote, InstantQuotes } from '../core/quotes';
import { Report, ReportedData } from '../core/reporting';
import { Periodicity } from '../core/period';
import { ConfigurableSource, ConfigurablePreprocessing } from '../calculations/indicators/configurable-source';
import { MomentumIndicator } from '../calculations/indicators/momentum-indicator';

export class IMomentumMarketTiming {
  assetName: string;
  id?: string;
  status?: BearBull;
  source?: ConfigurableSource;
  preprocessing?: ConfigurablePreprocessing;
  periodicity?: Periodicity;
  numberOfPeriods?: number;

  upperThreshold?: number;
  lowerThreshold?: number;
}

/**
 * This indicator measures the exponential regression, multiplies it by the difference between two moving averages
 * (EMA), a fast one and a slow one.
 * When the fast is higher than the slow, then it is a BULL period.
 * See also the MACDMarketTiming.
 * @class {MomentumMarketTiming}
 */
export class MomentumMarketTiming implements MarketTiming {
  assetName: string;
  id: string;
  status: BearBull;
  upperThreshold: number;
  lowerThreshold: number;

  previousMomentum: number;
  cagr: number;
  r2: number;

  numberOfTriggers: number = 0;

  momentumIndicator: MomentumIndicator;

  constructor(obj = {} as IMomentumMarketTiming) {
    let {
      assetName,
      id = "MOM",
      status = BearBull.BEAR,
      source = ConfigurableSource.CLOSE,
      preprocessing = ConfigurablePreprocessing.LAST,
      periodicity = Periodicity.DAILY,
      numberOfPeriods = 14,
      upperThreshold = 70,
      lowerThreshold = 30
    } = obj;
    this.assetName = assetName;
    this.id = id;
    this.status = status;
    this.upperThreshold = upperThreshold;
    this.lowerThreshold = lowerThreshold;

    this.momentumIndicator = new MomentumIndicator({
      numberOfPeriods: numberOfPeriods,
      periodicity: periodicity,
      preprocessing: preprocessing,
      source: source});

    console.log("Momentum Market Timing", this);
  }

  record(instantQuotes: InstantQuotes): void {
    let instant: Date = instantQuotes.instant;
    let quote: Quote = instantQuotes.quote(this.assetName);
    if (quote) {
      this.recordQuote(instant, quote);
    }
  }

  recordQuote(instant: Date, quote: Quote): void {
    let momentum = this.momentumIndicator.calculate(instant, quote);

    if (momentum) {
      this.r2 = this.momentumIndicator.r2;
      this.cagr = this.momentumIndicator.cagr;
      if (momentum < this.lowerThreshold) {
        this.status = BearBull.BEAR;
      }
      if (momentum > this.upperThreshold) {
        this.status = BearBull.BULL;
      }
      this.previousMomentum = momentum;
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
    if (this.previousMomentum != undefined) {
      report.receiveData(new ReportedData({
        sourceName: this.id + ".M",
        y: this.previousMomentum
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".CAGR",
        y: this.cagr
      }));
      report.receiveData(new ReportedData({
        sourceName: this.id + ".R2",
        y: this.r2
      }));
    }
    report.receiveData(new ReportedData({
      sourceName: this.id + ".TRI",
      y: this.numberOfTriggers
    }));
  }
}
