import { Periodicity } from '../../core/period';
import { Candlestick } from '../../core/quotes';
import { ConfigurableSource, ConfigurablePreprocessing } from './configurable-source';
import { GapIndicator } from "./gap-indicator";

describe('GapIndicator', () => {
  it('Can create a new instance', () => {
    expect(new GapIndicator({
      gapDistance: 20,
      numberOfPeriods: 2,
      periodicity: Periodicity.MONTHLY,
      source: ConfigurableSource.HIGH,
      preprocessing: ConfigurablePreprocessing.TYPICAL
    }))
    .toBeTruthy();
  });

  it('Can calculate gap of only one value, and is always zero', () => {
    let gap = new GapIndicator({gapDistance: 13, periodicity: Periodicity.DAILY});
    expect(gap.calculate(new Date(2019, 7 - 1, 19), new Candlestick({close: 30.00}))).toBeCloseTo(0, 2);
  });

  it('Can calculate gap of 1 period over 5 days', () => {
    let gap = new GapIndicator({gapDistance: 5, numberOfPeriods: 1, periodicity: Periodicity.DAILY});
    gap.calculate(new Date(2019, 7 - 1,   9), new Candlestick({close: 40.00}));
    gap.calculate(new Date(2019, 7 - 1,  10), new Candlestick({close: 41.00}));
    gap.calculate(new Date(2019, 7 - 1,  11), new Candlestick({close: 42.00}));
    gap.calculate(new Date(2019, 7 - 1,  12), new Candlestick({close: 43.00}));
    gap.calculate(new Date(2019, 7 - 1,  13), new Candlestick({close: 44.00}));

    let gapValue = gap.calculate(new Date(2019, 7 - 1,  14), new Candlestick({close: 45.00}));
    expect(gapValue).withContext("The 14th").toBeCloseTo(0.0250, 4);

    gapValue = gap.calculate(new Date(2019, 7 - 1,  15), new Candlestick({close: 46.00}));
    expect(gapValue).withContext("The 15th").toBeCloseTo(0.0244, 4);
  });

  it('Can calculate gap of 2 periods over 5 days', () => {
    let gap = new GapIndicator({gapDistance: 5, numberOfPeriods: 2, periodicity: Periodicity.DAILY});
    gap.calculate(new Date(2019, 7 - 1,   9), new Candlestick({close: 40.00}));
    gap.calculate(new Date(2019, 7 - 1,  10), new Candlestick({close: 41.00}));
    gap.calculate(new Date(2019, 7 - 1,  11), new Candlestick({close: 42.00}));
    gap.calculate(new Date(2019, 7 - 1,  12), new Candlestick({close: 43.00}));
    gap.calculate(new Date(2019, 7 - 1,  13), new Candlestick({close: 44.00}));

    let gapValue = gap.calculate(new Date(2019, 7 - 1,  14), new Candlestick({close: 45.00}));
    expect(gapValue).withContext("The 14th").toBeCloseTo(0.0500, 4);

    gapValue = gap.calculate(new Date(2019, 7 - 1,  15), new Candlestick({close: 46.00}));
    expect(gapValue).withContext("The 15th").toBeCloseTo(0.0500, 4);

    gapValue = gap.calculate(new Date(2019, 7 - 1,  16), new Candlestick({close: 47.00}));
    expect(gapValue).withContext("The 16th").toBeCloseTo(0.0488, 4);
  });

});
