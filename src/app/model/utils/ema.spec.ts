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
});
