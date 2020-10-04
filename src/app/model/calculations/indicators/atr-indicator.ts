import { Candlestick } from '../../core/quotes';
import { SmoothedMovingAverage } from '../moving-average/smoothed-moving-average';
import { Indicator } from './indicator';

/**
 * Calculates the True Range of the specified candlestick.
 * @class{OnlineTrueRange}
 */
export class TrueRange {
  private previous: Candlestick;

  public trueRange(current: Candlestick): number {
    let a: number, b: number;
    if (this.previous) {
      a = Math.max(this.previous.close, current.high);
      b = Math.min(this.previous.close, current.low);
    } else {
      a = current.high;
      b = current.low;
    }
    this.previous = current;
    return a - b;
  }
}

/**
 * Calculates the online true range using a simple moving average
 * of the specified number of periods.
 * @class{AtrIndicator}
 */
export class AtrIndicator implements Indicator {
  private trueRange: TrueRange;
  private sma: SmoothedMovingAverage;

  constructor(numberOfPeriods: number) {
    this.trueRange = new TrueRange();
    this.sma = new SmoothedMovingAverage(numberOfPeriods);
  }

  calculate(instant: Date, candlestick: Candlestick): number {
    let trueRange = this.trueRange.trueRange(candlestick);
    if (trueRange) {
      return this.sma.movingAverageOf(trueRange);
    }
  }
}
