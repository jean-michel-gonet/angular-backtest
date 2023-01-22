import { Quote, InstantQuotes } from '../core/quotes'
import { BearBull } from '../core/market-timing';
import { EMAMarketTiming } from './market-timing.ema';
import { Periodicity } from '../core/period';
import { ConfigurableSource, ConfigurablePreprocessing } from '../calculations/indicators/configurable-source';
import { EmaIndicator } from '../calculations/indicators/ema-indicator';

describe('EMAMarketTiming', () => {
  it('Can create a new instance with two EMA indicators', () => {
    let emaFilter = new EMAMarketTiming({assetName: "ANY"});
    expect(emaFilter).toBeTruthy();
    expect(emaFilter.listQuotesOfInterest()).toEqual(["ANY"]);
  });

  it('Can detect short EMA crossing long EMA', () => {
    let emaFilter = new EMAMarketTiming({
      assetName: "ANY",
      fastPeriod: 15,
      slowPeriod: 90,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.LAST,
      periodicity: Periodicity.DAILY,
      status: BearBull.BULL
    });

    let fastEMA = emaFilter.fastEMA as EmaIndicator;
    fastEMA.setLastValue(110);
    emaFilter.slowEMA.setLastValue(100);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 1), quotes: [new Quote({name: 'ANY', close: 90})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(107.50, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo( 99.78, 2);
    expect(emaFilter.bearBull()).toBe(BearBull.BULL);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 2), quotes: [new Quote({name: 'ANY', close: 90})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(105.31, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo( 99.57, 2);
    expect(emaFilter.bearBull()).toBe(BearBull.BULL);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 3), quotes: [new Quote({name: 'ANY', close: 90})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(103.40, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo( 99.36, 2);
    expect(emaFilter.bearBull()).toBe(BearBull.BULL);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 4), quotes: [new Quote({name: 'ANY', close: 90})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(101.72, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo( 99.15, 2);
    expect(emaFilter.bearBull()).toBe(BearBull.BULL);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 5), quotes: [new Quote({name: 'ANY', close: 90})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(100.26, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo( 98.95, 2);
    expect(emaFilter.bearBull()).toBe(BearBull.BULL);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 6), quotes: [new Quote({name: 'ANY', close: 90})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo( 98.98, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo( 98.75, 2);
    expect(emaFilter.bearBull()).toBe(BearBull.BULL);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 7), quotes: [new Quote({name: 'ANY', close: 90})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo( 97.85, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo( 98.56, 2);
    expect(emaFilter.bearBull()).toBe(BearBull.BEAR);
  });

  it('Can detect short EMA crossing long EMA, using threshold', () => {
    let emaFilter = new EMAMarketTiming({
      assetName: "ANY",
      fastPeriod: 5,
      slowPeriod: 15,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.LAST,
      periodicity: Periodicity.DAILY,
      status: BearBull.BEAR,
      threshold: 0.07
    });

    let fastEMA = emaFilter.fastEMA as EmaIndicator;
    fastEMA.setLastValue(30);
    emaFilter.slowEMA.setLastValue(40);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 1), quotes: [new Quote({name: 'ANY', close: 70})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(43.33, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo(43.75, 2);
    expect(emaFilter.bearBull()).withContext("April the 1st").toBe(BearBull.BEAR);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 2), quotes: [new Quote({name: 'ANY', close: 70})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(52.22, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo(47.03, 2);
    expect(emaFilter.bearBull()).withContext("April the 2nd").toBe(BearBull.BEAR);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 3), quotes: [new Quote({name: 'ANY', close: 70})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(58.15, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo(49.90, 2);
    expect(emaFilter.bearBull()).withContext("April the 3rd").toBe(BearBull.BULL);
  });

  it('Can detect short EMA crossing long EMA, using threshold and offset', () => {
    let emaFilter = new EMAMarketTiming({
      assetName: "ANY",
      fastPeriod: 5,
      slowPeriod: 15,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.LAST,
      periodicity: Periodicity.DAILY,
      status: BearBull.BEAR,
      threshold: 0.06,
      offset: 0.02
    });

    let fastEMA = emaFilter.fastEMA as EmaIndicator;
    fastEMA.setLastValue(30);
    emaFilter.slowEMA.setLastValue(40);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 1), quotes: [new Quote({name: 'ANY', close: 70})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(43.33, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo(43.75, 2);
    expect(emaFilter.bearBull()).withContext("April the 1st").toBe(BearBull.BEAR);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 2), quotes: [new Quote({name: 'ANY', close: 70})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(52.22, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo(47.03, 2);
    expect(emaFilter.bearBull()).withContext("April the 2nd").toBe(BearBull.BEAR);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 3), quotes: [new Quote({name: 'ANY', close: 70})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(58.15, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo(49.90, 2);
    expect(emaFilter.bearBull()).withContext("April the 3rd").toBe(BearBull.BEAR);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 4), quotes: [new Quote({name: 'ANY', close: 70})]}));
    expect(emaFilter.fastEMAValue).toBeCloseTo(62.10, 2);
    expect(emaFilter.slowEMAValue).toBeCloseTo(52.41, 2);
    expect(emaFilter.bearBull()).withContext("April the 4th").toBe(BearBull.BULL);
  });

  it('Can detect instant quote crossing long EMA', () => {
    let emaFilter = new EMAMarketTiming({
      assetName: "ANY",
      fastPeriod: 0,
      slowPeriod: 15,
      source: ConfigurableSource.CLOSE,
      preprocessing: ConfigurablePreprocessing.LAST,
      periodicity: Periodicity.DAILY,
      status: BearBull.BULL,
    });

    emaFilter.slowEMA.setLastValue(200);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 1), quotes: [new Quote({name: 'ANY', close: 210})]}));
    expect(emaFilter.fastEMAValue).toBe(210);
    expect(emaFilter.slowEMAValue).toBeCloseTo(201.25, 2);
    expect(emaFilter.bearBull()).withContext("April the 1st").toBe(BearBull.BULL);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 2), quotes: [new Quote({name: 'ANY', close: 205})]}));
    expect(emaFilter.fastEMAValue).toBe(205);
    expect(emaFilter.slowEMAValue).toBeCloseTo(201.72, 2);
    expect(emaFilter.bearBull()).withContext("April the 2nd").toBe(BearBull.BULL);

    emaFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 3), quotes: [new Quote({name: 'ANY', close: 200})]}));
    expect(emaFilter.fastEMAValue).toBe(200);
    expect(emaFilter.slowEMAValue).toBeCloseTo(201.50, 2);
    expect(emaFilter.bearBull()).withContext("April the 3rd").toBe(BearBull.BEAR);
  });
});
