import { Quote, Candlestick } from './core/asset'
import { BearBull } from './core/market-timing';
import { MACDMarketTiming, PeriodLength } from './market-timing.macd';

describe('MACDMarketTiming', () => {
  it('Can create a new instance', () => {
    expect(new MACDMarketTiming({
    })).toBeTruthy();
  });

  let makeMacd = function(start: Date, values:number[]): MACDMarketTiming {
    let macd: MACDMarketTiming = new MACDMarketTiming({
      id: "MACD",
      periodLength: PeriodLength.DAY,
      longPeriod: 26,
      shortPeriod: 12,
      triggerPeriod: 9,
      status: BearBull.BEAR
    });

    for (let n: number = 0; n < values.length; n++){
      let instant =  new Date(start.getFullYear(), start.getMonth(), n);
      let quote = new Quote({name: "ISIN1", partValue: new Candlestick({close: values[n]})});
      macd.record(instant, quote);
    }
    return macd;
  }

  it('Can follow a real case https://investsolver.com/calculate-macd-in-excel/ (1)', () => {
    let macd = makeMacd(new Date(2014, 7, 0), [
      58.66, 58.95, 59.88, 59.48, 59.16, 59.47, 58.80, 58.11, 57.83, 56.70,
      57.08, 56.64]);
    expect(Math.abs(macd.shortEMA - 58.21)).toBeLessThan(0.01);
  });

  it('Can follow a real case https://investsolver.com/calculate-macd-in-excel/ (2)', () => {
    let macd = makeMacd(new Date(2014, 7, 0), [
      58.66, 58.95, 59.88, 59.48, 59.16, 59.47, 58.80, 58.11, 57.83, 56.70,
      57.08, 56.64, 57.11, 56.73, 56.98, 57.48, 57.92, 57.46, 57.58, 57.60,
      58.61, 57.79, 57.89, 58.58, 57.64, 58.81, 58.77, 60.21, 60.12, 59.76,
      56.47, 57.84, 57.45, 58.04, 58.95, 60.09, 60.70, 61.77, 62.35, 62.59,
      62.58, 62.36]);

      expect(macd.shortEMA).toBeCloseTo(60.61, 2);
      expect(macd.longEMA).toBeCloseTo(59.58, 2);
      expect(macd.difference).toBeCloseTo(1.028, 3);
  });
});
