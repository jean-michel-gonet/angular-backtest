import { HistoricalQuotes, InstantQuotes, Quote } from "../model/core/quotes";
import { EnrichWithDividends, EnrichWithTotalReturn } from './quotes-enrich';

let now: Date = new Date();
let tomorrow: Date =        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
let today: Date =           new Date(now.getFullYear(), now.getMonth(), now.getDate() + 0);
let yesterday: Date =       new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
let beforeYesterday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);

describe('EnrichWithDividends', () => {

  it('Can enrich with dividends', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", close: 200}),
        new Quote({name: "ISIN2", close: 200}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 100}),
        new Quote({name: "ISIN2", close: 100}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", close: 300}),
        new Quote({name: "ISIN2", close: 300}),
      ]})
    ]);

    let enrichWithDividends: EnrichWithDividends =
      new EnrichWithDividends([
          {instant: beforeYesterday, value: 2.5},
          {instant: today, value: 1.5}
        ]);
    enrichWithDividends.enrich("ISIN1", historicalQuotes);

    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(historicalQuotes.get(yesterday).quote("ISIN1").dividend).toBe(0);
    expect(historicalQuotes.get(today).quote("ISIN1").dividend).toBe(1.5);
  });

  it('When dates mismatch, dividend is reported to the next quote', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 100}),
        new Quote({name: "ISIN2", close: 100}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", close: 300}),
        new Quote({name: "ISIN2", close: 300}),
      ]})
    ]);

    let enrichWithDividends: EnrichWithDividends =
      new EnrichWithDividends([
        {instant: beforeYesterday, value: 2.5},
        {instant: today, value: 1.5},
      ]);
    enrichWithDividends.enrich("ISIN1", historicalQuotes);

    expect(historicalQuotes.get(yesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(historicalQuotes.get(today).quote("ISIN1").dividend).toBe(1.5);
  });

  it('When dates mismatch, dividend is reported to the next quote (2)', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", close: 100}),
        new Quote({name: "ISIN2", close: 100}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", close: 200}),
        new Quote({name: "ISIN2", close: 200}),
      ]}),
      new InstantQuotes({instant: tomorrow, quotes: [
        new Quote({name: "ISIN1", close: 300}),
        new Quote({name: "ISIN2", close: 300}),
      ]})
    ]);
    let enrichWithDividends: EnrichWithDividends =
      new EnrichWithDividends([
        {instant: yesterday, value: 2.5},
        {instant: today, value: 1.5},
      ]);
    enrichWithDividends.enrich("ISIN1", historicalQuotes);

    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").dividend).toBe(0);
    expect(historicalQuotes.get(today).quote("ISIN1").dividend).toBe(2.5);
    expect(historicalQuotes.get(tomorrow).quote("ISIN1").dividend).toBe(1.5);
  });

  it('Can handle dividends data end before historical quotes', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", close: 100}),
        new Quote({name: "ISIN2", close: 100}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 200}),
        new Quote({name: "ISIN2", close: 200}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", close: 300}),
        new Quote({name: "ISIN2", close: 300}),
      ]})
    ]);
    let enrichWithDividends: EnrichWithDividends =
      new EnrichWithDividends([
        {instant: beforeYesterday, value: 2.5},
        {instant: yesterday, value: 1.5},
      ]);
    enrichWithDividends.enrich("ISIN1", historicalQuotes);

    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(historicalQuotes.get(yesterday).quote("ISIN1").dividend).toBe(1.5);
    expect(historicalQuotes.get(today).quote("ISIN1").dividend).toBe(0);
  });
});

// 0*([0-9]+)\/0*([0-9]+)\/18\s([0-9]+)\,([0-9]+)
// new InstantQuotes({instant: new Date(2018, $2 - 1, $1), quotes: [new Quote({name:"SP500", close: $3.$4})]}),
describe('EnrichWithTotalReturn', () => {
  it('Can enrich with total return', () => {

    // Given S&P 500 Growth Total Return (weekly)
    // Downloaded from https://www.investing.com/indices/s-p-500-tr-historical-data
    let totalReturn: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: new Date(2017, 12 - 1, 31), quotes: [new Quote({name:"SP500TR", close: 5349.69})]}),
      new InstantQuotes({instant: new Date(2018,  1 - 1,  7), quotes: [new Quote({name:"SP500TR", close: 5435.92})]}),
      new InstantQuotes({instant: new Date(2018,  1 - 1, 14), quotes: [new Quote({name:"SP500TR", close: 5483.57})]}),
      new InstantQuotes({instant: new Date(2018,  1 - 1, 21), quotes: [new Quote({name:"SP500TR", close: 5606.09})]}),
      new InstantQuotes({instant: new Date(2018,  1 - 1, 28), quotes: [new Quote({name:"SP500TR", close: 5392.21})]}),
      new InstantQuotes({instant: new Date(2018,  2 - 1,  4), quotes: [new Quote({name:"SP500TR", close: 5116.99})]}),
      new InstantQuotes({instant: new Date(2018,  2 - 1, 11), quotes: [new Quote({name:"SP500TR", close: 5340.82})]}),
      new InstantQuotes({instant: new Date(2018,  2 - 1, 18), quotes: [new Quote({name:"SP500TR", close: 5371.56})]}),
      new InstantQuotes({instant: new Date(2018,  2 - 1, 25), quotes: [new Quote({name:"SP500TR", close: 5265.24})]}),
      new InstantQuotes({instant: new Date(2018,  3 - 1,  4), quotes: [new Quote({name:"SP500TR", close: 5454.03})]}),
      new InstantQuotes({instant: new Date(2018,  3 - 1, 11), quotes: [new Quote({name:"SP500TR", close: 5388.74})]}),
      new InstantQuotes({instant: new Date(2018,  3 - 1, 18), quotes: [new Quote({name:"SP500TR", close: 5069.03})]}),
      new InstantQuotes({instant: new Date(2018,  3 - 1, 25), quotes: [new Quote({name:"SP500TR", close: 5173.19})]}),
      new InstantQuotes({instant: new Date(2018,  4 - 1,  1), quotes: [new Quote({name:"SP500TR", close: 5103.35})]}),
      new InstantQuotes({instant: new Date(2018,  4 - 1,  8), quotes: [new Quote({name:"SP500TR", close: 5207.57})]}),
      new InstantQuotes({instant: new Date(2018,  4 - 1, 15), quotes: [new Quote({name:"SP500TR", close: 5235.75})]}),
      new InstantQuotes({instant: new Date(2018,  4 - 1, 22), quotes: [new Quote({name:"SP500TR", close: 5235.73})]}),
      new InstantQuotes({instant: new Date(2018,  4 - 1, 29), quotes: [new Quote({name:"SP500TR", close: 5224.71})]}),
      new InstantQuotes({instant: new Date(2018,  5 - 1,  6), quotes: [new Quote({name:"SP500TR", close: 5354.69})]}),
      new InstantQuotes({instant: new Date(2018,  5 - 1, 13), quotes: [new Quote({name:"SP500TR", close: 5329.66})]}),
      new InstantQuotes({instant: new Date(2018,  5 - 1, 20), quotes: [new Quote({name:"SP500TR", close: 5347.31})]}),
      new InstantQuotes({instant: new Date(2018,  5 - 1, 27), quotes: [new Quote({name:"SP500TR", close: 5376.29})]}),
      new InstantQuotes({instant: new Date(2018,  6 - 1,  3), quotes: [new Quote({name:"SP500TR", close: 5465.42})]}),
      new InstantQuotes({instant: new Date(2018,  6 - 1, 10), quotes: [new Quote({name:"SP500TR", close: 5469.37})]}),
      new InstantQuotes({instant: new Date(2018,  6 - 1, 17), quotes: [new Quote({name:"SP500TR", close: 5421.63})]}),
      new InstantQuotes({instant: new Date(2018,  6 - 1, 24), quotes: [new Quote({name:"SP500TR", close: 5350.83})]}),
      new InstantQuotes({instant: new Date(2018,  7 - 1,  1), quotes: [new Quote({name:"SP500TR", close: 5434.36})]}),
      new InstantQuotes({instant: new Date(2018,  7 - 1,  8), quotes: [new Quote({name:"SP500TR", close: 5518.33})]}),
      new InstantQuotes({instant: new Date(2018,  7 - 1, 15), quotes: [new Quote({name:"SP500TR", close: 5520.50})]}),
      new InstantQuotes({instant: new Date(2018,  7 - 1, 22), quotes: [new Quote({name:"SP500TR", close: 5554.31})]}),
      new InstantQuotes({instant: new Date(2018,  7 - 1, 29), quotes: [new Quote({name:"SP500TR", close: 5598.71})]}),
      new InstantQuotes({instant: new Date(2018,  8 - 1,  5), quotes: [new Quote({name:"SP500TR", close: 5588.66})]}),
      new InstantQuotes({instant: new Date(2018,  8 - 1, 12), quotes: [new Quote({name:"SP500TR", close: 5625.66})]}),
      new InstantQuotes({instant: new Date(2018,  8 - 1, 19), quotes: [new Quote({name:"SP500TR", close: 5675.12})]}),
      new InstantQuotes({instant: new Date(2018,  8 - 1, 26), quotes: [new Quote({name:"SP500TR", close: 5730.80})]}),
      new InstantQuotes({instant: new Date(2018,  9 - 1,  2), quotes: [new Quote({name:"SP500TR", close: 5674.58})]}),
      new InstantQuotes({instant: new Date(2018,  9 - 1,  9), quotes: [new Quote({name:"SP500TR", close: 5743.19})]}),
      new InstantQuotes({instant: new Date(2018,  9 - 1, 16), quotes: [new Quote({name:"SP500TR", close: 5792.72})]}),
      new InstantQuotes({instant: new Date(2018,  9 - 1, 23), quotes: [new Quote({name:"SP500TR", close: 5763.42})]}),
      new InstantQuotes({instant: new Date(2018,  9 - 1, 30), quotes: [new Quote({name:"SP500TR", close: 5708.90})]}),
      new InstantQuotes({instant: new Date(2018, 10 - 1,  7), quotes: [new Quote({name:"SP500TR", close: 5476.83})]}),
      new InstantQuotes({instant: new Date(2018, 10 - 1, 14), quotes: [new Quote({name:"SP500TR", close: 5479.30})]}),
      new InstantQuotes({instant: new Date(2018, 10 - 1, 21), quotes: [new Quote({name:"SP500TR", close: 5263.74})]}),
      new InstantQuotes({instant: new Date(2018, 10 - 1, 28), quotes: [new Quote({name:"SP500TR", close: 5392.53})]}),
      new InstantQuotes({instant: new Date(2018, 11 - 1,  4), quotes: [new Quote({name:"SP500TR", close: 5511.79})]}),
      new InstantQuotes({instant: new Date(2018, 11 - 1, 11), quotes: [new Quote({name:"SP500TR", close: 5426.86})]}),
      new InstantQuotes({instant: new Date(2018, 11 - 1, 18), quotes: [new Quote({name:"SP500TR", close: 5222.43})]}),
      new InstantQuotes({instant: new Date(2018, 11 - 1, 25), quotes: [new Quote({name:"SP500TR", close: 5478.91})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1,  2), quotes: [new Quote({name:"SP500TR", close: 5229.44})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1,  9), quotes: [new Quote({name:"SP500TR", close: 5165.60})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1, 16), quotes: [new Quote({name:"SP500TR", close: 4802.51})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1, 23), quotes: [new Quote({name:"SP500TR", close: 4941.61})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1, 30), quotes: [new Quote({name:"SP500TR", close: 5035.45})]}),
    ]);

    // Given S&P 500 Historical Data (weely)
    // Downloaded from https://www.investing.com/indices/us-spx-500-historical-data
    let price: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: new Date(2017, 12 - 1, 31), quotes: [new Quote({name:"SP500", close: 2743.15})]}),
      new InstantQuotes({instant: new Date(2018,  1 - 1,  7), quotes: [new Quote({name:"SP500", close: 2786.24})]}),
      new InstantQuotes({instant: new Date(2018,  1 - 1, 14), quotes: [new Quote({name:"SP500", close: 2810.30})]}),
      new InstantQuotes({instant: new Date(2018,  1 - 1, 21), quotes: [new Quote({name:"SP500", close: 2872.87})]}),
      new InstantQuotes({instant: new Date(2018,  1 - 1, 28), quotes: [new Quote({name:"SP500", close: 2762.13})]}),
      new InstantQuotes({instant: new Date(2018,  2 - 1,  4), quotes: [new Quote({name:"SP500", close: 2619.55})]}),
      new InstantQuotes({instant: new Date(2018,  2 - 1, 11), quotes: [new Quote({name:"SP500", close: 2732.22})]}),
      new InstantQuotes({instant: new Date(2018,  2 - 1, 18), quotes: [new Quote({name:"SP500", close: 2747.3})]}),
      new InstantQuotes({instant: new Date(2018,  2 - 1, 25), quotes: [new Quote({name:"SP500", close: 2691.25})]}),
      new InstantQuotes({instant: new Date(2018,  3 - 1,  4), quotes: [new Quote({name:"SP500", close: 2786.57})]}),
      new InstantQuotes({instant: new Date(2018,  3 - 1, 11), quotes: [new Quote({name:"SP500", close: 2752.01})]}),
      new InstantQuotes({instant: new Date(2018,  3 - 1, 18), quotes: [new Quote({name:"SP500", close: 2588.26})]}),
      new InstantQuotes({instant: new Date(2018,  3 - 1, 25), quotes: [new Quote({name:"SP500", close: 2640.87})]}),
      new InstantQuotes({instant: new Date(2018,  4 - 1,  1), quotes: [new Quote({name:"SP500", close: 2604.47})]}),
      new InstantQuotes({instant: new Date(2018,  4 - 1,  8), quotes: [new Quote({name:"SP500", close: 2656.30})]}),
      new InstantQuotes({instant: new Date(2018,  4 - 1, 15), quotes: [new Quote({name:"SP500", close: 2670.14})]}),
      new InstantQuotes({instant: new Date(2018,  4 - 1, 22), quotes: [new Quote({name:"SP500", close: 2669.91})]}),
      new InstantQuotes({instant: new Date(2018,  4 - 1, 29), quotes: [new Quote({name:"SP500", close: 2663.42})]}),
      new InstantQuotes({instant: new Date(2018,  5 - 1,  6), quotes: [new Quote({name:"SP500", close: 2727.72})]}),
      new InstantQuotes({instant: new Date(2018,  5 - 1, 13), quotes: [new Quote({name:"SP500", close: 2712.97})]}),
      new InstantQuotes({instant: new Date(2018,  5 - 1, 20), quotes: [new Quote({name:"SP500", close: 2721.33})]}),
      new InstantQuotes({instant: new Date(2018,  5 - 1, 27), quotes: [new Quote({name:"SP500", close: 2734.62})]}),
      new InstantQuotes({instant: new Date(2018,  6 - 1,  3), quotes: [new Quote({name:"SP500", close: 2779.03})]}),
      new InstantQuotes({instant: new Date(2018,  6 - 1, 10), quotes: [new Quote({name:"SP500", close: 2779.66})]}),
      new InstantQuotes({instant: new Date(2018,  6 - 1, 17), quotes: [new Quote({name:"SP500", close: 2754.88})]}),
      new InstantQuotes({instant: new Date(2018,  6 - 1, 24), quotes: [new Quote({name:"SP500", close: 2718.37})]}),
      new InstantQuotes({instant: new Date(2018,  7 - 1,  1), quotes: [new Quote({name:"SP500", close: 2759.82})]}),
      new InstantQuotes({instant: new Date(2018,  7 - 1,  8), quotes: [new Quote({name:"SP500", close: 2801.31})]}),
      new InstantQuotes({instant: new Date(2018,  7 - 1, 15), quotes: [new Quote({name:"SP500", close: 2801.83})]}),
      new InstantQuotes({instant: new Date(2018,  7 - 1, 22), quotes: [new Quote({name:"SP500", close: 2818.82})]}),
      new InstantQuotes({instant: new Date(2018,  7 - 1, 29), quotes: [new Quote({name:"SP500", close: 2840.35})]}),
      new InstantQuotes({instant: new Date(2018,  8 - 1,  5), quotes: [new Quote({name:"SP500", close: 2833.28})]}),
      new InstantQuotes({instant: new Date(2018,  8 - 1, 12), quotes: [new Quote({name:"SP500", close: 2850.13})]}),
      new InstantQuotes({instant: new Date(2018,  8 - 1, 19), quotes: [new Quote({name:"SP500", close: 2874.69})]}),
      new InstantQuotes({instant: new Date(2018,  8 - 1, 26), quotes: [new Quote({name:"SP500", close: 2901.52})]}),
      new InstantQuotes({instant: new Date(2018,  9 - 1,  2), quotes: [new Quote({name:"SP500", close: 2871.68})]}),
      new InstantQuotes({instant: new Date(2018,  9 - 1,  9), quotes: [new Quote({name:"SP500", close: 2904.98})]}),
      new InstantQuotes({instant: new Date(2018,  9 - 1, 16), quotes: [new Quote({name:"SP500", close: 2929.67})]}),
      new InstantQuotes({instant: new Date(2018,  9 - 1, 23), quotes: [new Quote({name:"SP500", close: 2913.98})]}),
      new InstantQuotes({instant: new Date(2018,  9 - 1, 30), quotes: [new Quote({name:"SP500", close: 2885.57})]}),
      new InstantQuotes({instant: new Date(2018, 10 - 1,  7), quotes: [new Quote({name:"SP500", close: 2767.13})]}),
      new InstantQuotes({instant: new Date(2018, 10 - 1, 14), quotes: [new Quote({name:"SP500", close: 2767.78})]}),
      new InstantQuotes({instant: new Date(2018, 10 - 1, 21), quotes: [new Quote({name:"SP500", close: 2658.69})]}),
      new InstantQuotes({instant: new Date(2018, 10 - 1, 28), quotes: [new Quote({name:"SP500", close: 2723.06})]}),
      new InstantQuotes({instant: new Date(2018, 11 - 1,  4), quotes: [new Quote({name:"SP500", close: 2781.01})]}),
      new InstantQuotes({instant: new Date(2018, 11 - 1, 11), quotes: [new Quote({name:"SP500", close: 2736.27})]}),
      new InstantQuotes({instant: new Date(2018, 11 - 1, 18), quotes: [new Quote({name:"SP500", close: 2632.56})]}),
      new InstantQuotes({instant: new Date(2018, 11 - 1, 25), quotes: [new Quote({name:"SP500", close: 2760.17})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1,  2), quotes: [new Quote({name:"SP500", close: 2633.08})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1,  9), quotes: [new Quote({name:"SP500", close: 2599.95})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1, 16), quotes: [new Quote({name:"SP500", close: 2416.62})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1, 23), quotes: [new Quote({name:"SP500", close: 2485.74})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1, 30), quotes: [new Quote({name:"SP500", close: 2531.94})]}),
    ]);

    // When enriching the price quote with total return quote:
    let enrichWithTotalReturn: EnrichWithTotalReturn =
      new EnrichWithTotalReturn("SP500TR", totalReturn);
    enrichWithTotalReturn.enrich("SP500", price);

    // Then calculated dividends should be actual dividends
    let calculatedDividends: number = 0;
    price.forEachDate(instantQuotes => {
      let quote: Quote = instantQuotes.quote("SP500");
      calculatedDividends += quote.dividend;
    });

    // Downloaded from: https://www.multpl.com/s-p-500-dividend-yield/table/by-month
    expect(calculatedDividends)
      .toBeCloseTo(2.1, 1);
  });

  it('Can enrich with total return (2)', () => {

    // Given S&P 500 Growth Total Return (weekly)
    // Downloaded from https://www.investing.com/indices/s-p-500-tr-historical-data
    let totalReturn: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: new Date(2017, 12 - 1, 31), quotes: [new Quote({name:"SP500TR", close: 5349.69})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1, 30), quotes: [new Quote({name:"SP500TR", close: 5035.45})]}),
    ]);

    // Given S&P 500 Historical Data (weely)
    // Downloaded from https://www.investing.com/indices/us-spx-500-historical-data
    let price: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: new Date(2017, 12 - 1, 31), quotes: [new Quote({name:"SP500", close: 2743.15})]}),
      new InstantQuotes({instant: new Date(2018, 12 - 1, 30), quotes: [new Quote({name:"SP500", close: 2531.94})]}),
    ]);

    // When enriching the price quote with total return quote:
    let enrichWithTotalReturn: EnrichWithTotalReturn =
      new EnrichWithTotalReturn("SP500TR", totalReturn);
    enrichWithTotalReturn.enrich("SP500", price);

    // Then calculated dividends should be actual dividends
    let calculatedDividends: number = 0;
    price.forEachDate(instantQuotes => {
      let quote: Quote = instantQuotes.quote("SP500");
      calculatedDividends += quote.dividend;
    });

    // Downloaded from: https://www.multpl.com/s-p-500-dividend-yield/table/by-month
    expect(calculatedDividends).toBe(2.1);
  });
});
