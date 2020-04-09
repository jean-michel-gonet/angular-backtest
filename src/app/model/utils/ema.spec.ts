import { EMACalculator } from './ema';
import { PeriodLength } from '../core/period';
import { Quote } from '../core/quotes';

describe('EMACalculator', () => {
  it('Can calculate daily EMA as in https://investsolver.com/exponential-moving-average-in-excel/', () => {
    let ema = new EMACalculator(3, PeriodLength.DAILY);
    /*
    ema.ema(new Date(2019, 6 - 1, 28), new Quote({name: 'xx', close: 38.53}));

    ema.ema(new Date(2019, 7 - 1,  1), new Quote({name: 'xx', close: 38.75}));
    ema.ema(new Date(2019, 7 - 1,  2), new Quote({name: 'xx', close: 38.34}));
    ema.ema(new Date(2019, 7 - 1,  3), new Quote({name: 'xx', close: 38.16}));

    ema.ema(new Date(2019, 7 - 1,  5), new Quote({name: 'xx', close: 38.50}));


    ema.ema(new Date(2019, 7 - 1,  8), new Quote({name: 'xx', close: 38.23}));
    ema.ema(new Date(2019, 7 - 1,  9), new Quote({name: 'xx', close: 38.08}));
    ema.ema(new Date(2019, 7 - 1, 10), new Quote({name: 'xx', close: 38.10}));
    ema.ema(new Date(2019, 7 - 1, 11), new Quote({name: 'xx', close: 38.43}));
    ema.ema(new Date(2019, 7 - 1, 12), new Quote({name: 'xx', close: 39.21}));

    ema.ema(new Date(2019, 7 - 1, 15), new Quote({name: 'xx', close: 39.36}));
    ema.ema(new Date(2019, 7 - 1, 16), new Quote({name: 'xx', close: 39.43}));
    */
    expect(ema.ema(new Date(2019, 7 - 1, 17), new Quote({name: 'xx', close: 38.64}))).toBeUndefined();
    expect(ema.ema(new Date(2019, 7 - 1, 18), new Quote({name: 'xx', close: 39.12}))).toBe(38.71);
    expect(ema.ema(new Date(2019, 7 - 1, 19), new Quote({name: 'xx', close: 39.48}))).toBe(38.82);

    expect(ema.ema(new Date(2019, 7 - 1, 22), new Quote({name: 'xx', close: 39.86}))).toBe(38.97);
    expect(ema.ema(new Date(2019, 7 - 1, 23), new Quote({name: 'xx', close: 40.71}))).toBe(39.21);
    expect(ema.ema(new Date(2019, 7 - 1, 24), new Quote({name: 'xx', close: 40.88}))).toBe(39.45);
    expect(ema.ema(new Date(2019, 7 - 1, 25), new Quote({name: 'xx', close: 40.75}))).toBe(39.64);
    expect(ema.ema(new Date(2019, 7 - 1, 26), new Quote({name: 'xx', close: 40.77}))).toBe(39.80);

    expect(ema.ema(new Date(2019, 7 - 1, 29), new Quote({name: 'xx', close: 40.68}))).toBe(39.93);

  });
});
