import { EMACalculator } from './ema';
import { PeriodLength } from '../core/period';
import { Quote } from '../core/quotes';

describe('EMACalculator', () => {
  it('Can give the simple mean at the end of the first period', () => {
    let firstWeekValues: number[] = [39.86, 40.71, 40.88, 40.75, 40.77];
    let total = firstWeekValues.reduce((accumulator, value) => accumulator + value);
    let mean = total / firstWeekValues.length;

    let ema = new EMACalculator(5, PeriodLength.WEEKLY);
    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 39.86}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 40.71}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 40.88}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 40.75}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 40.77}))).toBeUndefined();

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 40.77}))).toBe(mean);
  });

  it('Can calculate daily EMA as in https://investsolver.com/exponential-moving-average-in-excel/', () => {
    let ema = new EMACalculator(13, PeriodLength.DAILY);
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
    let ema = new EMACalculator(21, PeriodLength.WEEKLY);
    ema.lastValue = 278.79;

    expect(ema.ema(new Date(2019, 4 - 1, 22), new Quote({name: 'xx', close: 290.27}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 4 - 1, 23), new Quote({name: 'xx', close: 292.88}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 4 - 1, 24), new Quote({name: 'xx', close: 292.23}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 4 - 1, 25), new Quote({name: 'xx', close: 292.05}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 4 - 1, 26), new Quote({name: 'xx', close: 293.41}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 4 - 1, 29), new Quote({name: 'xx', close: 293.87}))).toBeCloseTo(280.18, 2);
    /*
    expect(ema.ema(new Date(2019, 4 - 1, 30), new Quote({name: 'xx', close: 294.02}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1,  1), new Quote({name: 'xx', close: 291.81}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1,  2), new Quote({name: 'xx', close: 291.18}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1,  3), new Quote({name: 'xx', close: 294.03}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1,  6), new Quote({name: 'xx', close: 292.82}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1,  7), new Quote({name: 'xx', close: 287.93}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1,  8), new Quote({name: 'xx', close: 287.53}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1,  9), new Quote({name: 'xx', close: 286.66}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 10), new Quote({name: 'xx', close: 288.10}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 13), new Quote({name: 'xx', close: 280.86}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 14), new Quote({name: 'xx', close: 283.40}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 15), new Quote({name: 'xx', close: 285.06}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 16), new Quote({name: 'xx', close: 287.70}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 17), new Quote({name: 'xx', close: 285.84}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 20), new Quote({name: 'xx', close: 283.95}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 21), new Quote({name: 'xx', close: 286.51}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 22), new Quote({name: 'xx', close: 285.63}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 23), new Quote({name: 'xx', close: 282.14}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 24), new Quote({name: 'xx', close: 282.78}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 28), new Quote({name: 'xx', close: 280.15}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 29), new Quote({name: 'xx', close: 278.27}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 30), new Quote({name: 'xx', close: 279.03}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 5 - 1, 31), new Quote({name: 'xx', close: 275.27}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1,  3), new Quote({name: 'xx', close: 274.57}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1,  4), new Quote({name: 'xx', close: 280.53}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1,  5), new Quote({name: 'xx', close: 282.96}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1,  6), new Quote({name: 'xx', close: 284.80}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1,  7), new Quote({name: 'xx', close: 287.65}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 10), new Quote({name: 'xx', close: 288.97}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 11), new Quote({name: 'xx', close: 288.90}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 12), new Quote({name: 'xx', close: 288.39}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 13), new Quote({name: 'xx', close: 289.58}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 14), new Quote({name: 'xx', close: 289.26}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 17), new Quote({name: 'xx', close: 289.37}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 18), new Quote({name: 'xx', close: 292.40}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 19), new Quote({name: 'xx', close: 293.06}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 20), new Quote({name: 'xx', close: 295.86}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 21), new Quote({name: 'xx', close: 294.00}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 24), new Quote({name: 'xx', close: 293.64}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 25), new Quote({name: 'xx', close: 290.76}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 26), new Quote({name: 'xx', close: 290.47}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 27), new Quote({name: 'xx', close: 291.50}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 6 - 1, 28), new Quote({name: 'xx', close: 293.00}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1,  1), new Quote({name: 'xx', close: 295.66}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1,  2), new Quote({name: 'xx', close: 296.43}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1,  3), new Quote({name: 'xx', close: 298.80}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1,  5), new Quote({name: 'xx', close: 298.46}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1,  8), new Quote({name: 'xx', close: 296.82}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1,  9), new Quote({name: 'xx', close: 297.19}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 10), new Quote({name: 'xx', close: 298.61}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 11), new Quote({name: 'xx', close: 299.31}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 12), new Quote({name: 'xx', close: 300.65}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 15), new Quote({name: 'xx', close: 300.75}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 16), new Quote({name: 'xx', close: 299.71}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 17), new Quote({name: 'xx', close: 297.74}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 18), new Quote({name: 'xx', close: 298.83}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 19), new Quote({name: 'xx', close: 297.17}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 297.90}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 300.03}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 301.44}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 300.00}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 302.01}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 301.46}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 30), new Quote({name: 'xx', close: 300.72}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 7 - 1, 31), new Quote({name: 'xx', close: 297.43}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1,  1), new Quote({name: 'xx', close: 294.84}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1,  2), new Quote({name: 'xx', close: 292.62}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1,  5), new Quote({name: 'xx', close: 283.82}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1,  6), new Quote({name: 'xx', close: 287.80}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1,  7), new Quote({name: 'xx', close: 287.97}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1,  8), new Quote({name: 'xx', close: 293.62}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1,  9), new Quote({name: 'xx', close: 291.62}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 12), new Quote({name: 'xx', close: 288.07}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 13), new Quote({name: 'xx', close: 292.55}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 14), new Quote({name: 'xx', close: 283.90}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 15), new Quote({name: 'xx', close: 284.65}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 16), new Quote({name: 'xx', close: 288.85}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 19), new Quote({name: 'xx', close: 292.33}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 20), new Quote({name: 'xx', close: 290.09}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 21), new Quote({name: 'xx', close: 292.45}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 22), new Quote({name: 'xx', close: 292.36}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 23), new Quote({name: 'xx', close: 284.85}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 26), new Quote({name: 'xx', close: 288.00}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 27), new Quote({name: 'xx', close: 286.87}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 28), new Quote({name: 'xx', close: 288.89}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 29), new Quote({name: 'xx', close: 292.58}))).toBeCloseTo(0, 2);
    expect(ema.ema(new Date(2019, 8 - 1, 30), new Quote({name: 'xx', close: 292.45}))).toBeCloseTo(0, 2);
    */
  });
});
