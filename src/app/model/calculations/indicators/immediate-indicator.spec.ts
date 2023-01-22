import { Periodicity } from '../../core/period';
import { Candlestick } from '../../core/quotes';
import { ConfigurableSource, ConfigurablePreprocessing } from './configurable-source';
import { ImmediateIndicator } from './immediate-indicator';

describe('ImmediateIndicator', () => {
  it('Can return immediate daily values, as per configuration', () => {
    let indicator = new ImmediateIndicator({periodicity: Periodicity.DAILY});

    expect(indicator.calculate(new Date(2019, 7 - 1, 1), new Candlestick({close: 10}))).toBe(10);
    expect(indicator.calculate(new Date(2019, 7 - 1, 2), new Candlestick({close: 20}))).toBe(20);
    expect(indicator.calculate(new Date(2019, 7 - 1, 3), new Candlestick({close: 30}))).toBe(30);
  });

});
