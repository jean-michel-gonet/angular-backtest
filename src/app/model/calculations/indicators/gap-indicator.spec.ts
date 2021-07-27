import { Periodicity } from '../../core/period';
import { Candlestick } from '../../core/quotes';
import { ConfigurableSource, ConfigurablePreprocessing } from './configurable-source';
import { GapIndicator, GapIndicatorConfigurationMaximumGapWidthError } from "./gap-indicator";

describe('GapIndicator', () => {
  it('Can create a new instance', () => {
    expect(new GapIndicator({
      numberOfPeriods: 20,
      periodicity: Periodicity.MONTHLY,
      source: ConfigurableSource.HIGH,
      preprocessing: ConfigurablePreprocessing.TYPICAL,
      maximumGapWidth: 2
    }))
    .toBeTruthy();
  });

  it('Can raise an exception if maximumGapWidth is larger than numberOfPeriods', () => {
    expect(() => {
      new GapIndicator({
        numberOfPeriods: 2,
        periodicity: Periodicity.MONTHLY,
        maximumGapWidth: 20
      });
    }).toThrow(new GapIndicatorConfigurationMaximumGapWidthError(2, 20))
  });

  it('Can calculate gap of only one value, and is always zero', () => {
    let gap = new GapIndicator({numberOfPeriods: 13, periodicity: Periodicity.DAILY});
    expect(gap.calculate(new Date(2019, 7 - 1, 19), new Candlestick({close: 30.00}))).toBeCloseTo(0, 2);
  });

  it('Can calculate gap over 5 days', () => {
    let gap = new GapIndicator({numberOfPeriods: 5, periodicity: Periodicity.DAILY});
    gap.calculate(new Date(2019, 7 - 1,   9), new Candlestick({close: 46.00}));
    gap.calculate(new Date(2019, 7 - 1,  10), new Candlestick({close: 47.00}));
    gap.calculate(new Date(2019, 7 - 1,  11), new Candlestick({close: 48.00}));
    gap.calculate(new Date(2019, 7 - 1,  12), new Candlestick({close: 49.00}));

    let maximumGap = gap.calculate(new Date(2019, 7 - 1,  13), new Candlestick({close: 50.00}));
    expect(maximumGap).toBeCloseTo(8.7, 2);
  });

  it('Can calculate gap as always a positive value', () => {
    let gap = new GapIndicator({numberOfPeriods: 5, periodicity: Periodicity.DAILY});
    gap.calculate(new Date(2019, 7 - 1,   9), new Candlestick({close: 50.00}));
    gap.calculate(new Date(2019, 7 - 1,  10), new Candlestick({close: 49.00}));
    gap.calculate(new Date(2019, 7 - 1,  11), new Candlestick({close: 48.00}));
    gap.calculate(new Date(2019, 7 - 1,  12), new Candlestick({close: 47.00}));

    let maximumGap = gap.calculate(new Date(2019, 7 - 1,  13), new Candlestick({close: 46.00}));
    expect(maximumGap).toBeCloseTo(8, 2);
  });

  it('Can calculate gap over 10 days', () => {
    let gap = new GapIndicator({numberOfPeriods: 10, periodicity: Periodicity.DAILY});
    gap.calculate(new Date(2019, 7 - 1,   3), new Candlestick({close: 40.00}));
    gap.calculate(new Date(2019, 7 - 1,   4), new Candlestick({close: 41.00}));
    gap.calculate(new Date(2019, 7 - 1,   5), new Candlestick({close: 42.00}));
    gap.calculate(new Date(2019, 7 - 1,   6), new Candlestick({close: 43.00}));
    gap.calculate(new Date(2019, 7 - 1,   7), new Candlestick({close: 44.00}));
    gap.calculate(new Date(2019, 7 - 1,   8), new Candlestick({close: 45.00}));
    gap.calculate(new Date(2019, 7 - 1,   9), new Candlestick({close: 46.00}));
    gap.calculate(new Date(2019, 7 - 1,  10), new Candlestick({close: 47.00}));
    gap.calculate(new Date(2019, 7 - 1,  11), new Candlestick({close: 48.00}));
    gap.calculate(new Date(2019, 7 - 1,  12), new Candlestick({close: 49.00}));

    let maximumGap = gap.calculate(new Date(2019, 7 - 1,  13), new Candlestick({close: 50.00}));
    expect(maximumGap).toBeCloseTo(25, 2);
  });
});
