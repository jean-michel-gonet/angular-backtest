import { PeriodLength, Period } from '../core/period';
import { Quote } from '../core/quotes';

export enum EmaPreprocessing {
  TYPICAL,
  MEDIAN,
  LAST,
  FIRST
}

export enum EmaSource {
  OPEN,
  CLOSE,
  HIGH,
  LOW,
  MID
}

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
  private sourceValues: number[];
  public lastValue: number;
  private period: Period;
  private source: EmaSource = EmaSource.CLOSE;
  private preprocessing: EmaPreprocessing = EmaPreprocessing.LAST;

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
      if (this.sourceValues) {
        let preprocessedValue = this.preprocess(this.sourceValues);
        ema = this.emaOf(preprocessedValue);
      }
      this.sourceValues = [];
    }
    let sourceValue = this.extractSourceValue(quote);
    this.sourceValues.push(sourceValue);
    return ema;
  }

  /**
   * Extracs from the provided quote the value that is going to be used
   * as source for subsequent calculations.
   * @param {Quote} quote The Quote.
   * @return {number} The value to use as source.
   */
  private extractSourceValue(quote: Quote): number {
    switch(this.source) {
      case EmaSource.CLOSE:
        return quote.close;

      case EmaSource.HIGH:
        return quote.high;

      case EmaSource.LOW:
        return quote.low;

      case EmaSource.OPEN:
        return quote.open;

      case EmaSource.MID:
        return (quote.high + quote.low) / 2;
    }
  }

  /**
   * Preprocess the values according to the algorithm
   * selected in {@link #preprocessing}.
   * @param {number[]} values The source values.
   * @param {number} The value resulting of pre-processing.
   */
  private preprocess(values: number[]):number {
    switch(this.preprocessing) {
      case EmaPreprocessing.LAST:
        return values[values.length - 1];

      case EmaPreprocessing.FIRST:
        return values[0];

      case EmaPreprocessing.TYPICAL:
        return this.meanOf(values);

      case EmaPreprocessing.MEDIAN:
        return this.medianOf(values);
    }
  }

  private meanOf(values: number[]): number {
    let mean: number = 0;
    for (let n: number = 0; n < values.length; n++) {
      mean += values[n];
    }
    mean /= values.length;
    return mean;
  }

  private medianOf(values: number[]): number {
    return 0; // TODO
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
