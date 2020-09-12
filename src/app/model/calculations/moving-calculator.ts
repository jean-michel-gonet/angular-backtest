import { PeriodLength, Period } from '../core/period';
import { Candlestick } from '../core/quotes';

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

export class IMovingCalculator {
  numberOfPeriods: number;
  periodLength: PeriodLength;
  source?: MovingAverageSource;
  preprocessing?: MovingAveragePreprocessing;
}

export abstract class MovingCalculator {
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
   * @param {Candlestick} candlestick The candlestick corresponding to this instant.
   * @return {number} If the provided instant is a change of period, returns
   * the moving average of the last period.
   */
  calculate(instant: Date, candlestick: Candlestick): number {
    let result: number;

    if (this.period.changeOfPeriod(instant)) {
      if (this.periodLength == PeriodLength.DAILY) {
        let sourceValue = this.extractSourceValue(candlestick);
        let preprocessedValue = this.preprocess([sourceValue]);
        result = this.compute(instant, preprocessedValue);
      } else {
        if (this.sourceValues) {
          let preprocessedValue = this.preprocess(this.sourceValues);
          result = this.compute(instant, preprocessedValue);
        }
      }
      this.sourceValues = [];
    }
    let sourceValue = this.extractSourceValue(candlestick);
    this.sourceValues.push(sourceValue);
    return result;
  }

  /**
   * Extracs from the provided quote the value that is going to be used
   * as source for subsequent calculations.
   * @param {Quote} quote The Quote.
   * @return {number} The value to use as source.
   */
  private extractSourceValue(candlestick: Candlestick): number {
    switch(this.source) {
      case MovingAverageSource.CLOSE:
        return candlestick.close;

      case MovingAverageSource.HIGH:
        return candlestick.high;

      case MovingAverageSource.LOW:
        return candlestick.low;

      case MovingAverageSource.OPEN:
        return candlestick.open;

      case MovingAverageSource.MID:
        return (candlestick.high + candlestick.low) / 2;
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
  protected abstract compute(instant: Date, value: number): number;
}
