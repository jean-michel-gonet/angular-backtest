import { Candlestick } from '../core/quotes';
import { SmoothedMovingAverage } from './moving-average/smoothed-moving-average';

export class OnlineRelativeStrengthIndex {
  private previous: Candlestick;
  private smmaU: SmoothedMovingAverage;
  private smmaD: SmoothedMovingAverage;

  constructor(numberOfPeriods: number) {
    this.smmaU = new SmoothedMovingAverage(numberOfPeriods);
    this.smmaD = new SmoothedMovingAverage(numberOfPeriods);
  }

  public rsi(current: Candlestick): number {
    let u: number, d: number;
    let rsi: number;
    if (this.previous) {
      if (current.close > this.previous.close) {
        u = current.close - this.previous.close;
      } else {
        d = this.previous.close - current.close;
      }

      let smmaU: number = this.smmaU.movingAverageOf(u);
      let smmaD: number = this.smmaD.movingAverageOf(d);
      let rs: number = smmaU / smmaD;
      rsi = 100 - 100/(1 + rs);
    }
    this.previous = current;
    return rsi;
  }
}
