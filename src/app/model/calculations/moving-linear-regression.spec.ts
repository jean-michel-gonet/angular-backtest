import { MovingLinearRegression } from "./moving-linear-regression";
import { PeriodLength } from '../core/period';
import { Candlestick } from '../core/quotes'
import { ConfigurablePreprocessing, ConfigurableSource } from './indicators/configurable-source';
import { Indicator } from './indicators/indicator';
describe("MovingLinearRegression", () => {
  it("Can instantiate", () => {
    let mlr: Indicator = new MovingLinearRegression({
      numberOfPeriods: 10,
      periodLength: PeriodLength.MONTHLY,
      preprocessing: ConfigurablePreprocessing.FIRST,
      source: ConfigurableSource.CLOSE
    });
    expect(mlr).toBeTruthy();
  });

  it("Can calculate a moving linear regression over 5 days", () => {
    let mlr: Indicator = new MovingLinearRegression({
      numberOfPeriods: 5,
      periodLength: PeriodLength.DAILY,
      preprocessing: ConfigurablePreprocessing.FIRST,
      source: ConfigurableSource.CLOSE
    });

    expect(mlr.calculate(new Date(2001, 1 - 1,  1), new Candlestick({close: 30}))).toBeFalsy();
    expect(mlr.calculate(new Date(2001, 1 - 1,  2), new Candlestick({close: 22}))).toBeFalsy();
    expect(mlr.calculate(new Date(2001, 1 - 1,  3), new Candlestick({close: 18}))).toBeFalsy();
    expect(mlr.calculate(new Date(2001, 1 - 1,  4), new Candlestick({close: 35}))).toBeFalsy();
    expect(mlr.calculate(new Date(2001, 1 - 1,  5), new Candlestick({close: 25}))).toBeCloseTo(  431.102, 3);
    expect(mlr.calculate(new Date(2001, 1 - 1,  6), new Candlestick({close: 43}))).toBeCloseTo( 9513.298, 3);
    expect(mlr.calculate(new Date(2001, 1 - 1,  7), new Candlestick({close: 44}))).toBeCloseTo(10428.571, 3);
    expect(mlr.calculate(new Date(2001, 1 - 1,  8), new Candlestick({close: 23}))).toBeCloseTo( -521.429, 3);
    expect(mlr.calculate(new Date(2001, 1 - 1,  9), new Candlestick({close: 22}))).toBeCloseTo(-2592.896, 3);
    expect(mlr.calculate(new Date(2001, 1 - 1, 10), new Candlestick({close: 44}))).toBeCloseTo(-1862.245, 3);
    expect(mlr.calculate(new Date(2001, 1 - 1, 11), new Candlestick({close: 44}))).toBeCloseTo( 2456.731, 3);
    expect(mlr.calculate(new Date(2001, 1 - 1, 12), new Candlestick({close: 13}))).toBeCloseTo(  253.472, 3);
    expect(mlr.calculate(new Date(2001, 1 - 1, 13), new Candlestick({close: 28}))).toBeCloseTo(-2039.706, 3);
  });

  it("Can calculate a moving linear regression over 5 days unevenly distributed", () => {
    let mlr: Indicator = new MovingLinearRegression({
      numberOfPeriods: 5,
      periodLength: PeriodLength.DAILY,
      preprocessing: ConfigurablePreprocessing.FIRST,
      source: ConfigurableSource.CLOSE
    });

    expect(mlr.calculate(new Date(2001, 1 - 1,  1), new Candlestick({close: 30}))).toBeFalsy();
    expect(mlr.calculate(new Date(2001, 1 - 1,  5), new Candlestick({close: 22}))).toBeFalsy();
    expect(mlr.calculate(new Date(2001, 1 - 1, 17), new Candlestick({close: 18}))).toBeFalsy();
    expect(mlr.calculate(new Date(2001, 1 - 1, 18), new Candlestick({close: 35}))).toBeFalsy();
    expect(mlr.calculate(new Date(2001, 2 - 1,  7), new Candlestick({close: 25}))).toBeCloseTo(  -46.204, 3);
    expect(mlr.calculate(new Date(2001, 2 - 1,  8), new Candlestick({close: 43}))).toBeCloseTo(  636.796, 3);
    expect(mlr.calculate(new Date(2001, 2 - 1,  9), new Candlestick({close: 44}))).toBeCloseTo(  785.040, 3);
    expect(mlr.calculate(new Date(2001, 2 - 1, 13), new Candlestick({close: 23}))).toBeCloseTo( -137.003, 3);
    expect(mlr.calculate(new Date(2001, 2 - 1, 14), new Candlestick({close: 22}))).toBeCloseTo(-1968.283, 3);
    expect(mlr.calculate(new Date(2001, 3 - 1,  6), new Candlestick({close: 44}))).toBeCloseTo(  235.881, 3);
    expect(mlr.calculate(new Date(2001, 3 - 1, 11), new Candlestick({close: 44}))).toBeCloseTo(  594.684, 3);
    expect(mlr.calculate(new Date(2001, 3 - 1, 17), new Candlestick({close: 13}))).toBeCloseTo(  276.387, 3);
    expect(mlr.calculate(new Date(2001, 3 - 1, 24), new Candlestick({close: 28}))).toBeCloseTo(    6.133, 3);
  });
});
