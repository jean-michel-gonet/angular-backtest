import { Candlestick } from '../core/quotes';
import { OnlineSma } from './online-sma';

/**
 * Calculates the True Range of the specified candlestick.
 * @class{OnlineTrueRange}
 */
export class OnlineTrueRange {
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
 * @class{OnlineTrueRange}
 */
export class OnlineAverageTrueRange {
  private onlineTrueRange: OnlineTrueRange;
  private onlineSma: OnlineSma;

  constructor(numberOfPeriods: number) {
    this.onlineTrueRange = new OnlineTrueRange();
    this.onlineSma = new OnlineSma(numberOfPeriods);
  }

  public atr(current: Candlestick): number {
    let trueRange = this.onlineTrueRange.trueRange(current);
    return this.onlineSma.smaOf(trueRange);
  }
}
