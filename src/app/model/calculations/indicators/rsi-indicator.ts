import { SmoothedMovingAverage } from '../moving-average/smoothed-moving-average';
import { ConfigurableSourceIndicator } from './configurable-source-indicator';
import { IndicatorConfiguration } from './configurable-source';

export class RsiIndicator extends ConfigurableSourceIndicator {
  public numberOfPeriods: number;
  public periodLength: import("../../core/period").PeriodLength;
  public source: import("./configurable-source").ConfigurableSource;
  public preprocessing: import("./configurable-source").ConfigurablePreprocessing;
  protected period: import("../../core/period").Period;

  private previous: number;
  private smmaU: SmoothedMovingAverage;
  private smmaD: SmoothedMovingAverage;

  constructor(configuration: IndicatorConfiguration) {
    super(configuration)
    this.smmaU = new SmoothedMovingAverage(configuration.numberOfPeriods);
    this.smmaD = new SmoothedMovingAverage(configuration.numberOfPeriods);
  }

  compute(value: number): number {
    let u: number, d: number;
    let rsi: number;
    if (this.previous) {
      if (value > this.previous) {
        u = value - this.previous;
        d = 0;
      } else {
        u = 0;
        d = this.previous - value;
      }

      let smmaU: number = this.smmaU.movingAverageOf(u);
      let smmaD: number = this.smmaD.movingAverageOf(d);
      let rs: number = smmaU / smmaD;
      rsi = 100 - 100/(1 + rs);
    }
    this.previous = value;
    return rsi;
  }
}
