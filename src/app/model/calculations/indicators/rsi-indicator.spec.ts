import { RsiIndicator, RsiAverage } from "./rsi-indicator";
import { ConfigurablePreprocessing, ConfigurableSource } from './configurable-source';
import { Periodicity } from '../../core/period';
import { Candlestick } from '../../core/quotes';

describe("RsiIndicator" , () => {
  // https://www.tradingcampus.in/calculation-of-rsi-using-excel/
  it("Can calculate the Wilder RSI", () => {

    let rsiIndicator: RsiIndicator = new RsiIndicator({
      periodicity: Periodicity.DAILY,
      numberOfPeriods: 14,
      preprocessing: ConfigurablePreprocessing.LAST,
      source: ConfigurableSource.CLOSE,
      rsiAverage: RsiAverage.WILDER
    });

    rsiIndicator.calculate(new Date(2015, 10 + 1,  5), new Candlestick({close: 1181.75000}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  6), new Candlestick({close: 1154.59998}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  7), new Candlestick({close: 1133.19995}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  8), new Candlestick({close: 1132.15002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  9), new Candlestick({close: 1167.40002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 12), new Candlestick({close: 1122.90002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 13), new Candlestick({close: 1099.40002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 14), new Candlestick({close: 1097.59998}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 15), new Candlestick({close: 1097.34998}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 16), new Candlestick({close: 1094.90002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 19), new Candlestick({close: 1111.94995}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 20), new Candlestick({close: 1125.94995}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 21), new Candlestick({close: 1138.40002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 22), new Candlestick({close: 1138.40002}));


    expect(rsiIndicator.calculate(new Date(2015, 10 + 1, 23), new Candlestick({close: 1149.90002}))).toBeCloseTo(42.5005926536937, 3);
    expect(rsiIndicator.calculate(new Date(2015, 10 + 1, 26), new Candlestick({close: 1152.15002}))).toBeCloseTo(43.1493029203699, 3);
    expect(rsiIndicator.calculate(new Date(2015, 10 + 1, 27), new Candlestick({close: 1149.40002}))).toBeCloseTo(42.5179179330503, 3);
    expect(rsiIndicator.calculate(new Date(2015, 10 + 1, 28), new Candlestick({close: 1153.19995}))).toBeCloseTo(43.7428880282025, 3);
    expect(rsiIndicator.calculate(new Date(2015, 10 + 1, 29), new Candlestick({close: 1145.05005}))).toBeCloseTo(41.6908062815221, 3);
    expect(rsiIndicator.calculate(new Date(2015, 10 + 1, 30), new Candlestick({close: 1135.44995}))).toBeCloseTo(39.3491114641621, 3);
    expect(rsiIndicator.calculate(new Date(2015, 11 + 1,  2), new Candlestick({close: 1131.19995}))).toBeCloseTo(38.3228784573702, 3);
    expect(rsiIndicator.calculate(new Date(2015, 11 + 1,  3), new Candlestick({close: 1145.50000}))).toBeCloseTo(43.6482707530234, 3);
    expect(rsiIndicator.calculate(new Date(2015, 11 + 1,  4), new Candlestick({close: 1136.80005}))).toBeCloseTo(41.3112644656890, 3);
    expect(rsiIndicator.calculate(new Date(2015, 11 + 1,  5), new Candlestick({close: 1122.90002}))).toBeCloseTo(37.8265056442966, 3);
    expect(rsiIndicator.calculate(new Date(2015, 11 + 1,  6), new Candlestick({close: 1138.30005}))).toBeCloseTo(43.5117944288356, 3);
    expect(rsiIndicator.calculate(new Date(2015, 11 + 1,  9), new Candlestick({close: 1134.59998}))).toBeCloseTo(42.5060875015588, 3);
  })

  it("Can calculate the Cutler RSI", () => {

    let rsiIndicator: RsiIndicator = new RsiIndicator({
      periodicity: Periodicity.DAILY,
      numberOfPeriods: 14,
      preprocessing: ConfigurablePreprocessing.LAST,
      source: ConfigurableSource.CLOSE,
      rsiAverage: RsiAverage.CUTLER
    });

    rsiIndicator.calculate(new Date(2015, 10 + 1,  5), new Candlestick({close: 1181.75000}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  6), new Candlestick({close: 1154.59998}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  7), new Candlestick({close: 1133.19995}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  8), new Candlestick({close: 1132.15002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  9), new Candlestick({close: 1167.40002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 12), new Candlestick({close: 1122.90002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 13), new Candlestick({close: 1099.40002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 14), new Candlestick({close: 1097.59998}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 15), new Candlestick({close: 1097.34998}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 16), new Candlestick({close: 1094.90002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 19), new Candlestick({close: 1111.94995}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 20), new Candlestick({close: 1125.94995}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 21), new Candlestick({close: 1138.40002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 22), new Candlestick({close: 1138.40002}));


    expect(rsiIndicator.calculate(new Date(2015, 10 + 1, 23), new Candlestick({close: 1149.90002}))).toBeCloseTo(42.5005926536937, 3);
    expect(rsiIndicator.calculate(new Date(2015, 10 + 1, 26), new Candlestick({close: 1152.15002}))).toBeCloseTo(49.3465029280348, 3);
  })

  it("Can calculate the EMA RSI", () => {

    let rsiIndicator: RsiIndicator = new RsiIndicator({
      periodicity: Periodicity.DAILY,
      numberOfPeriods: 14,
      preprocessing: ConfigurablePreprocessing.LAST,
      source: ConfigurableSource.CLOSE,
      rsiAverage: RsiAverage.EMA
    });

    rsiIndicator.calculate(new Date(2015, 10 + 1,  5), new Candlestick({close: 1181.75000}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  6), new Candlestick({close: 1154.59998}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  7), new Candlestick({close: 1133.19995}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  8), new Candlestick({close: 1132.15002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1,  9), new Candlestick({close: 1167.40002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 12), new Candlestick({close: 1122.90002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 13), new Candlestick({close: 1099.40002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 14), new Candlestick({close: 1097.59998}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 15), new Candlestick({close: 1097.34998}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 16), new Candlestick({close: 1094.90002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 19), new Candlestick({close: 1111.94995}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 20), new Candlestick({close: 1125.94995}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 21), new Candlestick({close: 1138.40002}));
    rsiIndicator.calculate(new Date(2015, 10 + 1, 22), new Candlestick({close: 1138.40002}));


    expect(rsiIndicator.calculate(new Date(2015, 10 + 1, 23), new Candlestick({close: 1149.90002}))).toBeCloseTo(42.5005926536937, 3);
    expect(rsiIndicator.calculate(new Date(2015, 10 + 1, 26), new Candlestick({close: 1152.15002}))).toBeCloseTo(43.7835389434294, 3);
  })

})
