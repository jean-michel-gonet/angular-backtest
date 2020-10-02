import { Indicator } from './indicator';
import { PeriodLength, Period } from '../../core/period';
import { Candlestick } from '../../core/quotes';
import { ConfigurableSource, ConfigurablePreprocessing, IndicatorConfiguration } from './configurable-source';

/**
 * Base class for indicators whose source values can be configured.
 * For example: EMA, RSI...
 * Counter-example: ATR...
 */
export abstract class ConfigurableSourceIndicator implements Indicator {
  public numberOfPeriods: number;
  public periodLength: PeriodLength;
  public source: ConfigurableSource;
  public preprocessing: ConfigurablePreprocessing;

  protected period: Period;

  private sourceValues: number[];

  constructor(obj = {} as IndicatorConfiguration) {
    let {
      numberOfPeriods,
      periodLength,
      source = ConfigurableSource.CLOSE,
      preprocessing = ConfigurablePreprocessing.LAST
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
        result = this.compute(preprocessedValue);
      } else {
        if (this.sourceValues) {
          let preprocessedValue = this.preprocess(this.sourceValues);
          result = this.compute(preprocessedValue);
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
      case ConfigurableSource.CLOSE:
        return candlestick.close;

      case ConfigurableSource.HIGH:
        return candlestick.high;

      case ConfigurableSource.LOW:
        return candlestick.low;

      case ConfigurableSource.OPEN:
        return candlestick.open;

      case ConfigurableSource.MID:
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
      case ConfigurablePreprocessing.LAST:
        return values[values.length - 1];

      case ConfigurablePreprocessing.FIRST:
        return values[0];

      case ConfigurablePreprocessing.TYPICAL:
        return this.meanOf(values);

      case ConfigurablePreprocessing.MEDIAN:
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
  protected abstract compute(value: number): number;
}
