import { SmoothedMovingAverage } from '../moving-average/smoothed-moving-average';
import { ConfigurableSourceIndicator } from './configurable-source-indicator';
import { IndicatorConfiguration } from './configurable-source';
import { SimpleMovingAverage } from '../moving-average/simple-moving-average';
import { MovingAverage } from '../moving-average/moving-average';
import { ExponentialMovingAverage } from '../moving-average/exponential-moving-average';

export enum RsiAverage {
  /**
   * Wilder originally formulated the calculation of the moving average as
   * using Smoothed Moving Average.
   */
  WILDER,
  /**
   * A variation called Cutler's RSI is based on a simple moving average of U and D.
   */
  CUTLER,
  /**
   * Some commercial packages, like AIQ, use a standard exponential
   * moving average (EMA).
   */
   EMA
}

export interface RsiIndicatorConfiguration extends IndicatorConfiguration {
  rsiAverage?: RsiAverage;
}

export class RsiIndicator extends ConfigurableSourceIndicator {
  private previous: number;
  private smmaU: MovingAverage;
  private smmaD: MovingAverage;

  constructor(configuration = {} as RsiIndicatorConfiguration) {
    super(configuration);
    let {
      rsiAverage = RsiAverage.WILDER,
      numberOfPeriods = 14
    } = configuration;

    switch(rsiAverage) {
      case RsiAverage.WILDER:
        this.smmaU = new SmoothedMovingAverage(numberOfPeriods);
        this.smmaD = new SmoothedMovingAverage(numberOfPeriods);
        break;

      case RsiAverage.CUTLER:
        this.smmaU = new SimpleMovingAverage(numberOfPeriods);
        this.smmaD = new SimpleMovingAverage(numberOfPeriods);
        break;

      case RsiAverage.EMA:
        this.smmaU = new ExponentialMovingAverage(numberOfPeriods);
        this.smmaD = new ExponentialMovingAverage(numberOfPeriods);
        break;

      default:
        throw new TypeError(rsiAverage + ": Illegal value for rsiAverage");
    }
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
