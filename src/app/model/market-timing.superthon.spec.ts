import { SuperthonMarketTiming } from "./market-timing.superthon";
import { Quote } from './core/asset'
import { BearBull } from './core/market-timing';

describe('SuperthonMarketTiming', () => {
  it('Can create a new instance', () => {
    expect(new SuperthonMarketTiming({
      periods: 12
    })).toBeTruthy();
  });

  let makeSuperthon = function(start: Date, values:number[]): SuperthonMarketTiming {
    let superthon: SuperthonMarketTiming = new SuperthonMarketTiming({
      periods: 12
    });
    for (let n: number = 0; n < values.length; n++){
      let instant =  new Date(start.getFullYear(), start.getMonth() + n, 1);
      let quote = new Quote({name: "ISIN1", partValue: values[n]});
      superthon.record(instant, quote);
    }
    return superthon;
  }

  it('Can detect a BEAR', () => {
    let superthon = makeSuperthon(new Date(2000, 0, 1),
      [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    expect(superthon.magnitude()).toBe(-6);
    expect(superthon.bearBull()).toBe(BearBull.BEAR);
  });

  it('Can detect a BULL', () => {
    let superthon = makeSuperthon(new Date(2000, 0, 1),
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(superthon.magnitude()).toBe(6);
    expect(superthon.bearBull()).toBe(BearBull.BULL);
  });

  it('Can follow a real case <<loscanalesdesuperthon>> Jun 2017', () => {
    let superthon = makeSuperthon(new Date(2016, 4, 1), [
      2067.17, 2093.94, 2099.34, 2173.15,
      2171.33, 2164.33, 2128.68, 2200.17,
      2251.57, 2285.59, 2380.13, 2362.34, 2388.50]);
    expect(superthon.magnitude()).toBe(2);
    expect(superthon.bearBull()).toBe(BearBull.BULL);
  });

  it('Can follow a real case <<loscanalesdesuperthon>> Nov 2017', () => {
    let superthon = makeSuperthon(new Date(2016, 4, 1), [
      2067.17, 2093.94, 2099.34, 2173.15,
      2171.33, 2164.33, 2128.68, 2200.17,
      2251.57, 2285.59, 2380.13, 2362.34, 2388.50, 2415.65, 2431.39, 2477.10, 2474.42, 2521.2]);
    expect(superthon.magnitude()).toBe(3);
    expect(superthon.bearBull()).toBe(BearBull.BULL);
  });

  it('Can follow a real case <<loscanalesdesuperthon>> Dic 2017', () => {
    let superthon = makeSuperthon(new Date(2016, 4, 1), [
      2067.17, 2093.94, 2099.34, 2173.15,
      2171.33, 2164.33, 2128.68, 2200.17,
      2251.57, 2285.59, 2380.13, 2362.34, 2388.50, 2415.65, 2431.39, 2477.10, 2474.42, 2521.2, 2583.21]);
    expect(superthon.magnitude()).toBe(4);
    expect(superthon.bearBull()).toBe(BearBull.BULL);
  });

});
