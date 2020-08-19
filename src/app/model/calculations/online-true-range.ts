import { Candlestick } from '../core/quotes';

export class OnlineTrueRange {
  private previous: Candlestick;

  public trueRange(last: Candlestick): number {
    let tr: number;
    if (this.previous) {
      let a: number = Math.max(this.previous.close, last.high);
      let b: number = Math.min(this.previous.close, last.low);
      tr = a - b;
    }
    this.previous = last;
    return tr;
  }
}
