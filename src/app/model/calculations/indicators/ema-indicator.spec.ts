import { EmaIndicator } from "./ema-indicator";
import { PeriodLength } from '../../core/period';
import { Candlestick } from '../../core/quotes';
import { ConfigurableSource, ConfigurablePreprocessing } from './configurable-source';

describe('ExponentialMovingAverage', () => {

  it('Can calculate daily EMA as in https://investsolver.com/exponential-moving-average-in-excel/', () => {
    let ema = new EmaIndicator({numberOfPeriods: 13, periodLength: PeriodLength.DAILY});
    ema.setLastValue(38.68);

    expect(ema.calculate(new Date(2019, 7 - 1, 19), new Candlestick({close: 39.48}))).toBeCloseTo(38.79, 2);

    expect(ema.calculate(new Date(2019, 7 - 1, 22), new Candlestick({close: 39.86}))).toBeCloseTo(38.95, 2);
    expect(ema.calculate(new Date(2019, 7 - 1, 23), new Candlestick({close: 40.71}))).toBeCloseTo(39.20, 2);
    expect(ema.calculate(new Date(2019, 7 - 1, 24), new Candlestick({close: 40.88}))).toBeCloseTo(39.44, 2);
    expect(ema.calculate(new Date(2019, 7 - 1, 25), new Candlestick({close: 40.75}))).toBeCloseTo(39.63, 2);
    expect(ema.calculate(new Date(2019, 7 - 1, 26), new Candlestick({close: 40.77}))).toBeCloseTo(39.79, 2);
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
    let ema = new EmaIndicator({
      numberOfPeriods: 21,
      periodLength: PeriodLength.WEEKLY,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.LAST});
    ema.setLastValue(278.79);

    expect(ema.calculate(new Date(2019, 4 - 1, 29), new Candlestick({close: 293.87}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 4 - 1, 30), new Candlestick({close: 294.02}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1,  1), new Candlestick({close: 291.81}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1,  2), new Candlestick({close: 291.18}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1,  3), new Candlestick({close: 294.03}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 5 - 1,  6), new Candlestick({close: 292.82}))).toBeCloseTo(280.18, 2);
    expect(ema.calculate(new Date(2019, 5 - 1,  7), new Candlestick({close: 287.93}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1,  8), new Candlestick({close: 287.53}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1,  9), new Candlestick({close: 286.66}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1, 10), new Candlestick({close: 288.10}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 5 - 1, 13), new Candlestick({close: 280.86}))).toBeCloseTo(280.90, 2);
    expect(ema.calculate(new Date(2019, 5 - 1, 14), new Candlestick({close: 283.40}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1, 15), new Candlestick({close: 285.06}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1, 16), new Candlestick({close: 287.70}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1, 17), new Candlestick({close: 285.84}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 5 - 1, 20), new Candlestick({close: 283.95}))).toBeCloseTo(281.35, 2);
    expect(ema.calculate(new Date(2019, 5 - 1, 21), new Candlestick({close: 286.51}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1, 22), new Candlestick({close: 285.63}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1, 23), new Candlestick({close: 282.14}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1, 24), new Candlestick({close: 282.78}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 5 - 1, 28), new Candlestick({close: 280.15}))).toBeCloseTo(281.48, 2);
    expect(ema.calculate(new Date(2019, 5 - 1, 29), new Candlestick({close: 278.27}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1, 30), new Candlestick({close: 279.03}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 5 - 1, 31), new Candlestick({close: 275.27}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 6 - 1,  3), new Candlestick({close: 274.57}))).toBeCloseTo(280.91, 2);
    expect(ema.calculate(new Date(2019, 6 - 1,  4), new Candlestick({close: 280.53}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1,  5), new Candlestick({close: 282.96}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1,  6), new Candlestick({close: 284.80}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1,  7), new Candlestick({close: 287.65}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 6 - 1, 10), new Candlestick({close: 288.97}))).toBeCloseTo(281.52);
    expect(ema.calculate(new Date(2019, 6 - 1, 11), new Candlestick({close: 288.90}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1, 12), new Candlestick({close: 288.39}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1, 13), new Candlestick({close: 289.58}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1, 14), new Candlestick({close: 289.26}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 6 - 1, 17), new Candlestick({close: 289.37}))).toBeCloseTo(282.23);
    expect(ema.calculate(new Date(2019, 6 - 1, 18), new Candlestick({close: 292.40}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1, 19), new Candlestick({close: 293.06}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1, 20), new Candlestick({close: 295.86}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1, 21), new Candlestick({close: 294.00}))).toBeUndefined();

    expect(ema.calculate(new Date(2019, 6 - 1, 24), new Candlestick({close: 293.64}))).toBeCloseTo(283.30);
    expect(ema.calculate(new Date(2019, 6 - 1, 25), new Candlestick({close: 290.76}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1, 26), new Candlestick({close: 290.47}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1, 27), new Candlestick({close: 291.50}))).toBeUndefined();
    expect(ema.calculate(new Date(2019, 6 - 1, 28), new Candlestick({close: 293.00}))).toBeUndefined();
  });
});
