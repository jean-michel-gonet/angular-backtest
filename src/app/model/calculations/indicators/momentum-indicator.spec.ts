import { Periodicity } from '../../core/period';
import { Candlestick } from '../../core/quotes';
import { MomentumIndicator } from './momentum-indicator';

describe('MomentumIndicator', () => {

  it('Can calculate daily regression', () => {
    let momentum = new MomentumIndicator({numberOfPeriods: 13, periodicity: Periodicity.DAILY});

    expect(momentum.calculate(new Date(2020, 1 - 1, 13), new Candlestick({close: 100.00}))).toBeUndefined();
    expect(momentum.calculate(new Date(2020, 1 - 1, 14), new Candlestick({close: 100.01}))).toBeUndefined();
    expect(momentum.calculate(new Date(2020, 1 - 1, 15), new Candlestick({close: 100.03}))).toBeUndefined();
    expect(momentum.calculate(new Date(2020, 1 - 1, 16), new Candlestick({close: 100.04}))).toBeUndefined();
    expect(momentum.calculate(new Date(2020, 1 - 1, 17), new Candlestick({close: 100.05}))).toBeUndefined();
    expect(momentum.calculate(new Date(2020, 1 - 1, 20), new Candlestick({close: 100.09}))).toBeUndefined();
    expect(momentum.calculate(new Date(2020, 1 - 1, 21), new Candlestick({close: 100.11}))).toBeUndefined();
    expect(momentum.calculate(new Date(2020, 1 - 1, 22), new Candlestick({close: 100.12}))).toBeUndefined();
    expect(momentum.calculate(new Date(2020, 1 - 1, 23), new Candlestick({close: 100.13}))).toBeUndefined();
    expect(momentum.calculate(new Date(2020, 1 - 1, 24), new Candlestick({close: 100.15}))).toBeUndefined();

    // The 13th + 13 days = 26th, but we skipped it, so first returned value is the 27th:
    expect(momentum.calculate(new Date(2020, 1 - 1, 27), new Candlestick({close: 100.19}))).toBeCloseTo(0.05, 2);
  });

  it('Can calculate semi-monthly regression', () => {
    let momentum = new MomentumIndicator({
      numberOfPeriods: 5,
      periodicity: Periodicity.SEMIMONTHLY});

      expect(momentum.calculate(new Date(2020, 1 - 1, 13), new Candlestick({close: 400.00}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 1 - 1, 18), new Candlestick({close: 400.21}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 1 - 1, 23), new Candlestick({close: 400.43}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 1 - 1, 28), new Candlestick({close: 400.65}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 2 - 1,  2), new Candlestick({close: 400.86}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 2 - 1,  7), new Candlestick({close: 401.08}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 2 - 1, 12), new Candlestick({close: 401.29}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 2 - 1, 17), new Candlestick({close: 401.51}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 2 - 1, 22), new Candlestick({close: 401.72}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 2 - 1, 27), new Candlestick({close: 401.94}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 3 - 1,  3), new Candlestick({close: 402.15}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 3 - 1,  8), new Candlestick({close: 402.37}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 3 - 1, 13), new Candlestick({close: 402.59}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 3 - 1, 18), new Candlestick({close: 402.80}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 3 - 1, 23), new Candlestick({close: 403.02}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 3 - 1, 28), new Candlestick({close: 403.24}))).toBeUndefined();

      expect(momentum.calculate(new Date(2020, 4 - 1,  2), new Candlestick({close: 403.45}))).toBeCloseTo(0.04, 2);

      expect(momentum.calculate(new Date(2020, 4 - 1,  7), new Candlestick({close: 403.67}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 4 - 1, 12), new Candlestick({close: 403.89}))).toBeUndefined();

      expect(momentum.calculate(new Date(2020, 4 - 1, 17), new Candlestick({close: 404.10}))).toBeCloseTo(0.04, 2);

      expect(momentum.calculate(new Date(2020, 4 - 1, 22), new Candlestick({close: 404.32}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 4 - 1, 27), new Candlestick({close: 404.54}))).toBeUndefined();

      expect(momentum.calculate(new Date(2020, 5 - 1,  2), new Candlestick({close: 404.76}))).toBeCloseTo(0.04, 2);

      expect(momentum.calculate(new Date(2020, 5 - 1,  7), new Candlestick({close: 404.97}))).toBeUndefined();
      expect(momentum.calculate(new Date(2020, 5 - 1, 12), new Candlestick({close: 405.19}))).toBeUndefined();
  });

});
