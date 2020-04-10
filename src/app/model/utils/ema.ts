import { PeriodLength, Period } from '../core/period';
import { Quote } from '../core/quotes';

/**
 * Calculates the Exponential Moving Average of the quotes provided
 * along time.
 * For example, suppose we calculate an EMA over 12 months. You need
 * to specify the following values to the constructor:
 * <dl>
 *  <dt>Number of periods</dt><dd>That will be 12</dd>
 *  <dt>Period length</dt><dd>That will be MONTHLY</dd>
 * </dl>
 * Then you can call {@link ema} once for every simulated day, providing
 * the instant and the corresponding quote. The calculation will return
 * {@code undefined} most of the time, except when there is a change of
 * period. In this case, the first day of each month.
 */
export class EMACalculator {
  private periodValues: number[];
  public lastValue: number;
  private period: Period;

  /**
   * Class constructor.
   * @param {number} numberOfPeriods The number of periods over which calculating
   * the moving average.
   * @param {PeriodLength} periodLength The period period length.
   */
  constructor(public numberOfPeriods: number, public periodLength: PeriodLength) {
    this.period = new Period(periodLength);
  }

  /**
   * Calculates the EMA of the last period.
   * @param {Date} instant The current date. Method assumes that instants
   * through subsequent calls always move forward.
   * @param {Quote} quote The quote corresponding to this instant.
   * @return {number} If the provided instant is a change of period, returns
   * the moving average of the last period.
   */
  ema(instant: Date, quote: Quote): number {
    let ema: number;
    if (this.period.changeOfPeriod(instant)) {
      if (this.periodValues) {
        let mean = this.meanOf(this.periodValues);
        ema = this.emaOf(mean);
      }
      this.periodValues = [];
    }
    this.periodValues.push(quote.close)
    return ema;
  }

  private meanOf(values: number[]):number {
    let mean: number = 0;
    for (let n: number = 0; n < values.length; n++) {
      mean += values[n];
    }
    mean /= values.length;
    return mean;
  }

  emaOf(latestQuote: number) {
    let ema: number;
    if (this.lastValue) {
      let k: number = 2 / (this.numberOfPeriods + 1);
      ema = latestQuote * k + this.lastValue * (1 - k);
    } else {
      ema = latestQuote;
    }
    this.lastValue = ema;
    return ema;
  }
}
