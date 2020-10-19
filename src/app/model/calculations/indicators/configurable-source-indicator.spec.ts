import { ConfigurableSourceIndicator } from './configurable-source-indicator';
import { ConfigurableSource, ConfigurablePreprocessing } from './configurable-source';
import { Periodicity } from '../../core/period';
import { Quote } from '../../core/quotes';

/**
 * Mock moving average calculator that does nothing much.
 */
class TestMovingCalculator extends ConfigurableSourceIndicator {
  public instant: Date;
  public value: number;
  protected compute(instant: Date, value: number): number {
    this.instant = instant;
    this.value = value;
    return value;
  }
}

describe('ConfigurableSourceIndicator', () => {
  it('Can use the closing price as input ', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new TestMovingCalculator({
      numberOfPeriods:5,
      periodicity: Periodicity.WEEKLY,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.LAST
    });

    expect(ema.calculate(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: values[0]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: values[1]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: values[2]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: values[3]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: values[4]}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(values[4]);
  });

  it('Can use the open price as input ', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new TestMovingCalculator({
      numberOfPeriods:5,
      periodicity: Periodicity.WEEKLY,
      source: ConfigurableSource.OPEN,
      preprocessing: ConfigurablePreprocessing.LAST
    });

    expect(ema.calculate(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 0, open: values[0]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 0, open: values[1]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 0, open: values[2]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 0, open: values[3]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 0, open: values[4]}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(values[4]);
  });

  it('Can use the high price as input ', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new TestMovingCalculator({
      numberOfPeriods:5,
      periodicity: Periodicity.WEEKLY,
      source: ConfigurableSource.HIGH,
      preprocessing: ConfigurablePreprocessing.LAST
    });

    expect(ema.calculate(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 0, high: values[0]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 0, high: values[1]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 0, high: values[2]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 0, high: values[3]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 0, high: values[4]}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(values[4]);
  });

  it('Can use the low price as input ', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new TestMovingCalculator({
      numberOfPeriods:5,
      periodicity: Periodicity.WEEKLY,
      source: ConfigurableSource.LOW,
      preprocessing: ConfigurablePreprocessing.LAST
    });

    expect(ema.calculate(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 0, low: values[0]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 0, low: values[1]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 0, low: values[2]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 0, low: values[3]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 0, low: values[4]}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(values[4]);
  });

  it('Can use the mid price as input ', () => {
    let highValues: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];
    let lowValues: number[] = [38.86, 39.71, 38.88, 38.75, 38.77];

    let ema = new TestMovingCalculator({
      numberOfPeriods:5,
      periodicity: Periodicity.WEEKLY,
      source: ConfigurableSource.MID,
      preprocessing: ConfigurablePreprocessing.LAST
    });

    expect(ema.calculate(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 0, high: highValues[0], low: lowValues[0]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 0, high: highValues[1], low: lowValues[1]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 0, high: highValues[2], low: lowValues[2]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 0, high: highValues[3], low: lowValues[3]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 0, high: highValues[4], low: lowValues[4]}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe((highValues[4] + lowValues[4])/2);
  });

  it('Can preprocess input as first value', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new TestMovingCalculator({
      numberOfPeriods:5,
      periodicity: Periodicity.WEEKLY,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.FIRST
    });

    expect(ema.calculate(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: values[0]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: values[1]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: values[2]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: values[3]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: values[4]}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(values[0]);
  });

  it('Can preprocess input as mean (typical) value', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];
    let total = values.reduce((accumulator, value) => accumulator + value);
    let mean = total / values.length;

    let ema = new TestMovingCalculator({
      numberOfPeriods:5,
      periodicity: Periodicity.WEEKLY,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.TYPICAL
    });

    expect(ema.calculate(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: values[0]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: values[1]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: values[2]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: values[3]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: values[4]}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(mean);
  });

  it('Can preprocess input as median value when there is an odd number of values', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new TestMovingCalculator({
      numberOfPeriods:5,
      periodicity: Periodicity.WEEKLY,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.MEDIAN
    });

    expect(ema.calculate(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: values[0]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: values[1]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: values[2]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: values[3]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: values[4]}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(40.75);
  });

  it('Can preprocess input as median value when there is an even number of values', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77, 39.93];

    let ema = new TestMovingCalculator({
      numberOfPeriods:5,
      periodicity: Periodicity.WEEKLY,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.MEDIAN
    });

    expect(ema.calculate(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: values[0]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: values[1]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: values[2]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: values[3]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: values[4]}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 7 - 1, 27), new Quote({name: 'xx', close: values[5]}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBeCloseTo(40.73, 3);
  });
});
