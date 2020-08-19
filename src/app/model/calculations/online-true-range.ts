import { Candlestick } from '../core/quotes';

export class OnlineAverageTrueRange {
  private onlineTrueRange: OnlineTrueRange;
  private previousAtr: number;

  constructor(private numberOfPeriods: number) {
    this.onlineTrueRange = new OnlineTrueRange();
  }

  public atr(current: Candlestick): number {
    let trueRange = this.onlineTrueRange.trueRange(current);
    if (trueRange) {
      let averageTrueRange: number;
      if (this.previousAtr) {
        averageTrueRange = (this.previousAtr * (this.numberOfPeriods - 1) + trueRange)
            / this.numberOfPeriods;
      } else {
        averageTrueRange = trueRange;
      }
      this.previousAtr = averageTrueRange;
      return averageTrueRange;
    }
    return null;
  }
}

export class OnlineTrueRange {
  private previous: Candlestick;

  public trueRange(current: Candlestick): number {
    let tr: number;
    if (this.previous) {
      let a: number = Math.max(this.previous.close, current.high);
      let b: number = Math.min(this.previous.close, current.low);
      tr = a - b;
    }
    this.previous = current;
    return tr;
  }
}
