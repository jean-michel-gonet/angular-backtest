import { Quote, InstantQuotes } from '../core/quotes'
import { BearBull } from '../core/market-timing';
import { MACDMarketTiming } from './market-timing.macd';
import { PeriodLength } from '../core/period';
import { MovingAverageSource, MovingAveragePreprocessing } from '../calculations/moving-calculator';

describe('MACDMarketTiming', () => {
  it('Can create a new instance', () => {
    expect(new MACDMarketTiming({assetName: "ANY"})).toBeTruthy();
  });

  /**
   * To verify this test:
   * - go to www.investing.com
   * - look for SPY data.
   * - Open interactive chart, and maximize it.
   * - select "1w - Weekly" data
   * - Navigate to zoom on a period between April and August 2019
   * - Add Indicators -> MACD with 26, 12 and 9
   * - Verify the values of the MACD and SIGNAL with your cursor.
   */
  it('Can calculate weekly MACD based on last closing price', () => {
    let macdFilter: MACDMarketTiming = new MACDMarketTiming({
      assetName: "SPY",
      id: "MACD",
      source: MovingAverageSource.CLOSE,
      preprocessing: MovingAveragePreprocessing.LAST,
      periodLength: PeriodLength.WEEKLY,
      slowPeriod: 26,
      fastPeriod: 12,
      signalPeriod: 9,
      status: BearBull.BULL
    });

    macdFilter.fastEma.setLastValue(282.78);
    macdFilter.slowEma.setLastValue(277.64);
    macdFilter.signalEma.setPreviousAverage(2.50);

    macdFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 29), quotes: [new Quote({name: 'SPY', close: 293.87})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 4 - 1, 30), quotes: [new Quote({name: 'SPY', close: 294.02})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1,  1), quotes: [new Quote({name: 'SPY', close: 291.81})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1,  2), quotes: [new Quote({name: 'SPY', close: 291.18})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1,  3), quotes: [new Quote({name: 'SPY', close: 294.03})]}));

    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1,  6), quotes: [new Quote({name: 'SPY', close: 292.82})]}));
    expect(macdFilter.macd)  .toBeCloseTo(5.66, 2);
    expect(macdFilter.signal).toBeCloseTo(3.13, 2);
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1,  7), quotes: [new Quote({name: 'SPY', close: 287.93})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1,  8), quotes: [new Quote({name: 'SPY', close: 287.53})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1,  9), quotes: [new Quote({name: 'SPY', close: 286.66})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 10), quotes: [new Quote({name: 'SPY', close: 288.10})]}));

    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 13), quotes: [new Quote({name: 'SPY', close: 280.86})]}));
    expect(macdFilter.macd)  .toBeCloseTo(5.52, 2);
    expect(macdFilter.signal).toBeCloseTo(3.61, 2);
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 14), quotes: [new Quote({name: 'SPY', close: 283.40})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 15), quotes: [new Quote({name: 'SPY', close: 285.06})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 16), quotes: [new Quote({name: 'SPY', close: 287.70})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 17), quotes: [new Quote({name: 'SPY', close: 285.84})]}));

    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 20), quotes: [new Quote({name: 'SPY', close: 283.95})]}));
    expect(macdFilter.macd)  .toBeCloseTo(5.18, 2);
    expect(macdFilter.signal).toBeCloseTo(3.92, 2);
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 21), quotes: [new Quote({name: 'SPY', close: 286.51})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 22), quotes: [new Quote({name: 'SPY', close: 285.63})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 23), quotes: [new Quote({name: 'SPY', close: 282.14})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 24), quotes: [new Quote({name: 'SPY', close: 282.78})]}));

    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 28), quotes: [new Quote({name: 'SPY', close: 280.15})]}));
    expect(macdFilter.macd)  .toBeCloseTo(4.60, 2);
    expect(macdFilter.signal).toBeCloseTo(4.06, 2);
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 29), quotes: [new Quote({name: 'SPY', close: 278.27})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 30), quotes: [new Quote({name: 'SPY', close: 279.03})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 5 - 1, 31), quotes: [new Quote({name: 'SPY', close: 275.27})]}));

    macdFilter.record(new InstantQuotes({instant: new Date(2019, 6 - 1,  3), quotes: [new Quote({name: 'SPY', close: 274.57})]}));
    expect(macdFilter.macd)  .toBeCloseTo(3.50, 2);
    expect(macdFilter.signal).toBeCloseTo(3.95, 2);
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 6 - 1,  4), quotes: [new Quote({name: 'SPY', close: 280.53})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 6 - 1,  5), quotes: [new Quote({name: 'SPY', close: 282.96})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 6 - 1,  6), quotes: [new Quote({name: 'SPY', close: 284.80})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 6 - 1,  7), quotes: [new Quote({name: 'SPY', close: 287.65})]}));

    macdFilter.record(new InstantQuotes({instant: new Date(2019, 6 - 1, 10), quotes: [new Quote({name: 'SPY', close: 288.97})]}));
    expect(macdFilter.macd)  .toBeCloseTo(3.58, 2);
    expect(macdFilter.signal).toBeCloseTo(3.87, 2);
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 6 - 1, 11), quotes: [new Quote({name: 'SPY', close: 288.90})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 6 - 1, 12), quotes: [new Quote({name: 'SPY', close: 288.39})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 6 - 1, 13), quotes: [new Quote({name: 'SPY', close: 289.58})]}));
    macdFilter.record(new InstantQuotes({instant: new Date(2019, 6 - 1, 14), quotes: [new Quote({name: 'SPY', close: 289.26})]}));
  });
});
