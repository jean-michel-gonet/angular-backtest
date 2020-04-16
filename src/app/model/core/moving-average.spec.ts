import { EmaCalculator, MovingAverageSource, MovingAveragePreprocessing } from './moving-average';
import { PeriodLength } from '../core/period';
import { Quote } from '../core/quotes';

describe('EMACalculator', () => {
  it('Can use the closing price as input ', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new EmaCalculator({
      numberOfPeriods:5,
      periodLength: PeriodLength.WEEKLY,
      source: MovingAverageSource.CLOSE,
      preprocessing: MovingAveragePreprocessing.LAST
    });

    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: values[0]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: values[1]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: values[2]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: values[3]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: values[4]}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(values[4]);
  });

  it('Can use the open price as input ', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new EmaCalculator({
      numberOfPeriods:5,
      periodLength: PeriodLength.WEEKLY,
      source: MovingAverageSource.OPEN,
      preprocessing: MovingAveragePreprocessing.LAST
    });

    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 0, open: values[0]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 0, open: values[1]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 0, open: values[2]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 0, open: values[3]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 0, open: values[4]}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(values[4]);
  });

  it('Can use the high price as input ', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new EmaCalculator({
      numberOfPeriods:5,
      periodLength: PeriodLength.WEEKLY,
      source: MovingAverageSource.HIGH,
      preprocessing: MovingAveragePreprocessing.LAST
    });

    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 0, high: values[0]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 0, high: values[1]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 0, high: values[2]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 0, high: values[3]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 0, high: values[4]}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(values[4]);
  });

  it('Can use the low price as input ', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new EmaCalculator({
      numberOfPeriods:5,
      periodLength: PeriodLength.WEEKLY,
      source: MovingAverageSource.LOW,
      preprocessing: MovingAveragePreprocessing.LAST
    });

    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 0, low: values[0]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 0, low: values[1]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 0, low: values[2]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 0, low: values[3]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 0, low: values[4]}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(values[4]);
  });

  it('Can use the mid price as input ', () => {
    let highValues: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];
    let lowValues: number[] = [38.86, 39.71, 38.88, 38.75, 38.77];

    let ema = new EmaCalculator({
      numberOfPeriods:5,
      periodLength: PeriodLength.WEEKLY,
      source: MovingAverageSource.MID,
      preprocessing: MovingAveragePreprocessing.LAST
    });

    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 0, high: highValues[0], low: lowValues[0]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 0, high: highValues[1], low: lowValues[1]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 0, high: highValues[2], low: lowValues[2]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 0, high: highValues[3], low: lowValues[3]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 0, high: highValues[4], low: lowValues[4]}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe((highValues[4] + lowValues[4])/2);
  });

  it('Can preprocess input as first value', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new EmaCalculator({
      numberOfPeriods:5,
      periodLength: PeriodLength.WEEKLY,
      source: MovingAverageSource.CLOSE,
      preprocessing: MovingAveragePreprocessing.FIRST
    });

    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: values[0]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: values[1]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: values[2]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: values[3]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: values[4]}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(values[0]);
  });

  it('Can preprocess input as mean (typical) value', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];
    let total = values.reduce((accumulator, value) => accumulator + value);
    let mean = total / values.length;

    let ema = new EmaCalculator({
      numberOfPeriods:5,
      periodLength: PeriodLength.WEEKLY,
      source: MovingAverageSource.CLOSE,
      preprocessing: MovingAveragePreprocessing.TYPICAL
    });

    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: values[0]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: values[1]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: values[2]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: values[3]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: values[4]}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(mean);
  });

  it('Can preprocess input as median value when there is an odd number of values', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];

    let ema = new EmaCalculator({
      numberOfPeriods:5,
      periodLength: PeriodLength.WEEKLY,
      source: MovingAverageSource.CLOSE,
      preprocessing: MovingAveragePreprocessing.MEDIAN
    });

    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: values[0]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: values[1]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: values[2]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: values[3]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: values[4]}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBe(40.75);
  });

  it('Can preprocess input as median value when there is an even number of values', () => {
    let values: number[] = [39.86, 40.71, 40.88, 40.75, 40.77, 39.93];

    let ema = new EmaCalculator({
      numberOfPeriods:5,
      periodLength: PeriodLength.WEEKLY,
      source: MovingAverageSource.CLOSE,
      preprocessing: MovingAveragePreprocessing.MEDIAN
    });

    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: values[0]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: values[1]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: values[2]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: values[3]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: values[4]}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 27), new Quote({name: 'xx', close: values[5]}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 0}))).toBeCloseTo(40.73, 3);
  });

  it('Can calculate daily EMA as in https://investsolver.com/exponential-moving-average-in-excel/', () => {
    let ema = new EmaCalculator({numberOfPeriods: 13, periodLength: PeriodLength.DAILY});
    ema.lastValue = 38.68;

    expect(ema.ema(new Date(2019, 7 - 1, 19), new Quote({name: 'xx', close: 39.48}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 39.86}))).toBeCloseTo(38.79, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 40.71}))).toBeCloseTo(38.95, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 40.88}))).toBeCloseTo(39.20, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 40.75}))).toBeCloseTo(39.44, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 40.77}))).toBeCloseTo(39.63, 2);

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 40.68}))).toBeCloseTo(39.79, 2);
  });

  /**
   * To verify this test:
   * - go to www.investing.com
   * - look for SPY data.
   * - Open interactive chart, and maximize it.
   * - select "1w - Weekly" data
   * - Navigate to zoom on a period between April and August 2019
   * - Add Indicators -> EMA, 21, Colsed
   */
  it('Can calculate weekly 21 period EMA based on last closing price', () => {
    let ema = new EmaCalculator({
      numberOfPeriods: 21,
      periodLength: PeriodLength.WEEKLY,
      source: MovingAverageSource.CLOSE,
      preprocessing: MovingAveragePreprocessing.LAST});
    ema.lastValue = 278.79;

    expect(ema.ema(new Date(2019, 4 - 1, 29), new Quote({name: 'xx', close: 293.87}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 4 - 1, 30), new Quote({name: 'xx', close: 294.02}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1,  1), new Quote({name: 'xx', close: 291.81}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1,  2), new Quote({name: 'xx', close: 291.18}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1,  3), new Quote({name: 'xx', close: 294.03}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 5 - 1,  6), new Quote({name: 'xx', close: 292.82}))).toBeCloseTo(280.18, 2);
    expect(ema.ema(new Date(2019, 5 - 1,  7), new Quote({name: 'xx', close: 287.93}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1,  8), new Quote({name: 'xx', close: 287.53}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1,  9), new Quote({name: 'xx', close: 286.66}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1, 10), new Quote({name: 'xx', close: 288.10}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 5 - 1, 13), new Quote({name: 'xx', close: 280.86}))).toBeCloseTo(280.90, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 14), new Quote({name: 'xx', close: 283.40}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1, 15), new Quote({name: 'xx', close: 285.06}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1, 16), new Quote({name: 'xx', close: 287.70}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1, 17), new Quote({name: 'xx', close: 285.84}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 5 - 1, 20), new Quote({name: 'xx', close: 283.95}))).toBeCloseTo(281.35, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 21), new Quote({name: 'xx', close: 286.51}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1, 22), new Quote({name: 'xx', close: 285.63}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1, 23), new Quote({name: 'xx', close: 282.14}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1, 24), new Quote({name: 'xx', close: 282.78}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 5 - 1, 28), new Quote({name: 'xx', close: 280.15}))).toBeCloseTo(281.48, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 29), new Quote({name: 'xx', close: 278.27}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1, 30), new Quote({name: 'xx', close: 279.03}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 5 - 1, 31), new Quote({name: 'xx', close: 275.27}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 6 - 1,  3), new Quote({name: 'xx', close: 274.57}))).toBeCloseTo(280.91, 2);
    expect(ema.ema(new Date(2019, 6 - 1,  4), new Quote({name: 'xx', close: 280.53}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1,  5), new Quote({name: 'xx', close: 282.96}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1,  6), new Quote({name: 'xx', close: 284.80}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1,  7), new Quote({name: 'xx', close: 287.65}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 6 - 1, 10), new Quote({name: 'xx', close: 288.97}))).toBeCloseTo(281.52);
    expect(ema.ema(new Date(2019, 6 - 1, 11), new Quote({name: 'xx', close: 288.90}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1, 12), new Quote({name: 'xx', close: 288.39}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1, 13), new Quote({name: 'xx', close: 289.58}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1, 14), new Quote({name: 'xx', close: 289.26}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 6 - 1, 17), new Quote({name: 'xx', close: 289.37}))).toBeCloseTo(282.23);
    expect(ema.ema(new Date(2019, 6 - 1, 18), new Quote({name: 'xx', close: 292.40}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1, 19), new Quote({name: 'xx', close: 293.06}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1, 20), new Quote({name: 'xx', close: 295.86}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1, 21), new Quote({name: 'xx', close: 294.00}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 6 - 1, 24), new Quote({name: 'xx', close: 293.64}))).toBeCloseTo(283.30);
    expect(ema.ema(new Date(2019, 6 - 1, 25), new Quote({name: 'xx', close: 290.76}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1, 26), new Quote({name: 'xx', close: 290.47}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1, 27), new Quote({name: 'xx', close: 291.50}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 6 - 1, 28), new Quote({name: 'xx', close: 293.00}))).toBeUndefined();
  });
});
