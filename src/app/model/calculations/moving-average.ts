import { PeriodLength, Period } from '../core/period';
import { Quote } from '../core/quotes';
import { OnlineEma } from './online-ema';

export enum MovingAveragePreprocessing {
  TYPICAL = 'TYPICAL',
  MEDIAN = 'MEDIAN',
  LAST = 'LAST',
  FIRST = 'FIRST'
}

export enum MovingAverageSource {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  HIGH = 'HIGH',
  LOW = 'LOW',
  MID = 'MID'
}

class IMovingCalculator {
  numberOfPeriods: number;
  periodLength: PeriodLength;
  source?: MovingAverageSource;
  preprocessing?: MovingAveragePreprocessing;
}

abstract class MovingCalculator {
  public numberOfPeriods: number;
  public periodLength: PeriodLength;
  public source: MovingAverageSource;
  public preprocessing: MovingAveragePreprocessing;

  protected period: Period;

  private sourceValues: number[];

  constructor(obj = {} as IMovingCalculator) {
    let {
      numberOfPeriods,
      periodLength,
      source = MovingAverageSource.CLOSE,
      preprocessing = MovingAveragePreprocessing.LAST
    } = obj;

    this.numberOfPeriods = numberOfPeriods;
    this.periodLength = periodLength;
    this.source = source;
    this.preprocessing = preprocessing;

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
        ema = this.calculate(preprocessedValue);
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
      case MovingAverageSource.CLOSE:
        return quote.close;

      case MovingAverageSource.HIGH:
        return quote.high;

      case MovingAverageSource.LOW:
        return quote.low;

      case MovingAverageSource.OPEN:
        return quote.open;

      case MovingAverageSource.MID:
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
      case MovingAveragePreprocessing.LAST:
        return values[values.length - 1];

      case MovingAveragePreprocessing.FIRST:
        return values[0];

      case MovingAveragePreprocessing.TYPICAL:
        return this.meanOf(values);

      case MovingAveragePreprocessing.MEDIAN:
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
    let sortedValues = values.sort((a: number, b: number) => a - b);
    if (sortedValues.length % 2 == 0) {
      let middle = Math.floor(sortedValues.length / 2);
      let a = sortedValues[middle - 1];
      let b = sortedValues[middle];
      return (a + b) / 2;
    } else {
      let middle = Math.ceil(sortedValues.length / 2);
      return sortedValues[middle - 1];
    }
  }

  /**
   * Extend this method to implement the corresponding calculation.
   * @param {number}  value The value to perform the calculation on.
   * @return {number} The result of the calculation.
   */
  abstract calculate(value: number): number;
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
export class EmaCalculator extends MovingCalculator {

  public onlineEma: OnlineEma;

  /**
   * Class constructor.
   * @param {number} numberOfPeriods The number of periods over which calculating
   * the moving average.
   * @param {PeriodLength} periodLength The period period length.
   */
  constructor(obj = {} as IMovingCalculator) {
    super(obj);
    this.onlineEma = new OnlineEma(this.numberOfPeriods);
  }

  /**
   * Performs the EMA calculation.
   * @param {number} value The value.
   * @return {number} The EMA for this and all previously provided values.
   */
  calculate(value: number): number {
    return this.onlineEma.emaOf(value);
  }

  /**
   * Force the last EMA value.
   * A method useful for unit testing, for example.
   * @param {number} value The forced last ema value.
   */
  setLastValue(value: number): void  {
    this.onlineEma.setLastValue(value);
  }
}
