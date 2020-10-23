import { Candlestick } from '../../core/quotes';
import { AtrIndicator } from './atr-indicator';

/**
 * Examples from https://school.stockcharts.com/doku.php?id=technical_indicators:average_true_range_atr
 */
describe("AtrIndicator", () => {
  it("Can create a new instance", () => {
    let atrIndicator: AtrIndicator = new AtrIndicator(10, 3);
    expect(atrIndicator).toBeTruthy();
  });

  it("Can calculate the ATR using Simple Moving Average over 14 periods", () => {
    let atrIndicator: AtrIndicator = new AtrIndicator(14, 1.5);

    expect(atrIndicator.calculate(null, new Candlestick({low: 13, high: 14, close: 14}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close:  2}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close:  6}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close: 11}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close: 16}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close: 24}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close: 22}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close: 34}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close: 26}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close: 32}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close: 30}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close: 45}))).toBeFalsy();
    expect(atrIndicator.calculate(null, new Candlestick({close: 43}))).toBeFalsy();

    expect(atrIndicator.calculate(null, new Candlestick({close: 36}))).toBeCloseTo(26.46);
    expect(atrIndicator.downsInARow).toBe(0);
    expect(atrIndicator.upsInARow).toBe(0);

    expect(atrIndicator.calculate(null, new Candlestick({close:  43}))).toBeCloseTo( 33.40, 2);
    expect(atrIndicator.downsInARow).toBe(0);
    expect(atrIndicator.upsInARow).toBe(1);
    expect(atrIndicator.calculate(null, new Candlestick({close:  63}))).toBeCloseTo( 51.94, 2);
    expect(atrIndicator.downsInARow).toBe(0);
    expect(atrIndicator.upsInARow).toBe(2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  41}))).toBeCloseTo( 41.00, 2);
    expect(atrIndicator.downsInARow).toBe(1);
    expect(atrIndicator.upsInARow).toBe(0);
    expect(atrIndicator.calculate(null, new Candlestick({close:  62}))).toBeCloseTo( 48.02, 2);
    expect(atrIndicator.downsInARow).toBe(0);
    expect(atrIndicator.upsInARow).toBe(1);
    expect(atrIndicator.calculate(null, new Candlestick({close:  52}))).toBeCloseTo( 48.02, 2);
    expect(atrIndicator.downsInARow).toBe(0);
    expect(atrIndicator.upsInARow).toBe(0);
    expect(atrIndicator.calculate(null, new Candlestick({close:  61}))).toBeCloseTo( 48.02, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  48}))).toBeCloseTo( 48.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  61}))).toBeCloseTo( 48.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  65}))).toBeCloseTo( 50.86, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  85}))).toBeCloseTo( 69.73, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  85}))).toBeCloseTo( 70.82, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  79}))).toBeCloseTo( 70.82, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  72}))).toBeCloseTo( 70.82, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  70}))).toBeCloseTo( 70.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  94}))).toBeCloseTo( 79.52, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  94}))).toBeCloseTo( 80.56, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 108}))).toBeCloseTo( 94.02, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 110}))).toBeCloseTo( 96.80, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 103}))).toBeCloseTo( 96.80, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  88}))).toBeCloseTo( 88.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close:  95}))).toBeCloseTo( 88.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 103}))).toBeCloseTo( 89.65, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 111}))).toBeCloseTo( 97.74, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 103}))).toBeCloseTo( 97.74, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 117}))).toBeCloseTo(103.28, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 126}))).toBeCloseTo(112.29, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 108}))).toBeCloseTo(108.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 123}))).toBeCloseTo(108.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 127}))).toBeCloseTo(112.44, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 131}))).toBeCloseTo(117.05, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 141}))).toBeCloseTo(126.98, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 132}))).toBeCloseTo(126.98, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 135}))).toBeCloseTo(126.98, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 146}))).toBeCloseTo(132.46, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 148}))).toBeCloseTo(135.22, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 152}))).toBeCloseTo(139.70, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 160}))).toBeCloseTo(147.72, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 171}))).toBeCloseTo(158.42, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 165}))).toBeCloseTo(158.42, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 177}))).toBeCloseTo(164.27, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 163}))).toBeCloseTo(163.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 181}))).toBeCloseTo(166.70, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 163}))).toBeCloseTo(163.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 167}))).toBeCloseTo(163.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 180}))).toBeCloseTo(165.10, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 177}))).toBeCloseTo(165.10, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 172}))).toBeCloseTo(165.10, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 194}))).toBeCloseTo(178.94, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 184}))).toBeCloseTo(178.94, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 198}))).toBeCloseTo(182.52, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 210}))).toBeCloseTo(194.34, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 195}))).toBeCloseTo(194.34, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 209}))).toBeCloseTo(194.34, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 214}))).toBeCloseTo(198.15, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 195}))).toBeCloseTo(195.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 203}))).toBeCloseTo(195.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 209}))).toBeCloseTo(195.00, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 223}))).toBeCloseTo(206.75, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 227}))).toBeCloseTo(211.48, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 220}))).toBeCloseTo(211.48, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 212}))).toBeCloseTo(211.48, 2);
    expect(atrIndicator.calculate(null, new Candlestick({close: 214}))).toBeCloseTo(211.48, 2);

  });
});
