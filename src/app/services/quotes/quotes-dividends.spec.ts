import { HistoricalQuotes, InstantQuotes, Quote } from "../../model/core/quotes";
import { ComputeDividends } from './quotes-dividends';

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

    ComputeDividends.withDirectDividends([
          {instant: beforeYesterday, value: 2.5},
          {instant: today, value: 1.5}
        ]).of("ISIN1", historicalQuotes);

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

    ComputeDividends.withDirectDividends([
        {instant: beforeYesterday, value: 2.5},
        {instant: today, value: 1.5},
      ]).of("ISIN1", historicalQuotes);

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
    ComputeDividends.withDirectDividends([
        {instant: yesterday, value: 2.5},
        {instant: today, value: 1.5},
      ]).of("ISIN1", historicalQuotes);

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
    ComputeDividends.withDirectDividends([
        {instant: beforeYesterday, value: 2.5},
        {instant: yesterday, value: 1.5},
      ]).of("ISIN1", historicalQuotes);

    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(historicalQuotes.get(yesterday).quote("ISIN1").dividend).toBe(1.5);
    expect(historicalQuotes.get(today).quote("ISIN1").dividend).toBe(0);
  });
});

describe('ComputeDividendsWithAdjustedClose', () => {
  it('Can calculate dividends of VTI in Dec 2020, without false dividends due to rounding errors', () => {
    // Price of VTI, with adjusted close: https://finance.yahoo.com/quote/VTI/history?p=VTI
    let quotesWithAdjustedClose: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: new Date(2020, 12 - 1,  7), quotes: [new Quote({name:"VTI", close: 191.300003, adjustedClose: 190.526016})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1,  8), quotes: [new Quote({name:"VTI", close: 192.130005, adjustedClose: 191.352661})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1,  9), quotes: [new Quote({name:"VTI", close: 190.240005, adjustedClose: 189.470306})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 10), quotes: [new Quote({name:"VTI", close: 190.520004, adjustedClose: 189.749161})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 11), quotes: [new Quote({name:"VTI", close: 190.179993, adjustedClose: 189.410538})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 14), quotes: [new Quote({name:"VTI", close: 189.639999, adjustedClose: 188.872726})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 15), quotes: [new Quote({name:"VTI", close: 192.240005, adjustedClose: 191.462204})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 16), quotes: [new Quote({name:"VTI", close: 192.509995, adjustedClose: 191.731110})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 17), quotes: [new Quote({name:"VTI", close: 194.020004, adjustedClose: 193.235001})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 18), quotes: [new Quote({name:"VTI", close: 193.470001, adjustedClose: 192.687225})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 21), quotes: [new Quote({name:"VTI", close: 192.910004, adjustedClose: 192.129501})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 22), quotes: [new Quote({name:"VTI", close: 192.949997, adjustedClose: 192.169327})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 23), quotes: [new Quote({name:"VTI", close: 193.279999, adjustedClose: 192.498001})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 24), quotes: [new Quote({name:"VTI", close: 192.820007, adjustedClose: 192.820007})]}),
    ]);

    ComputeDividends.withAdjustedClose().of("VTI", quotesWithAdjustedClose);

    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1,  8)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1,  9)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 10)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 11)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 14)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 15)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 16)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 17)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 18)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 21)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 22)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 23)).quote("VTI").dividend).toBe(0);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 24)).quote("VTI").dividend).toBeCloseTo(0.783, 3);
  });

  it('Can calculate dividends of AGG in 2021', () => {
    // Price of AGG, with adjusted close: https://finance.yahoo.com/quote/AGG/history?p=AGG
    let quotesWithAdjustedClose: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: new Date(2020, 11 - 1, 30), quotes: [new Quote({name:"AGG", close: 118.419998, adjustedClose: 117.895477})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1,  1), quotes: [new Quote({name:"AGG", close: 117.839996, adjustedClose: 117.522484})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1,  2), quotes: [new Quote({name:"AGG", close: 117.709999, adjustedClose: 117.392838})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1,  3), quotes: [new Quote({name:"AGG", close: 117.910004, adjustedClose: 117.592300})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1,  4), quotes: [new Quote({name:"AGG", close: 117.589996, adjustedClose: 117.273163})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1,  7), quotes: [new Quote({name:"AGG", close: 117.769997, adjustedClose: 117.452675})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1,  8), quotes: [new Quote({name:"AGG", close: 117.779999, adjustedClose: 117.462646})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1,  9), quotes: [new Quote({name:"AGG", close: 117.610001, adjustedClose: 117.293114})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 10), quotes: [new Quote({name:"AGG", close: 117.900002, adjustedClose: 117.582329})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 11), quotes: [new Quote({name:"AGG", close: 118.029999, adjustedClose: 117.711983})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 14), quotes: [new Quote({name:"AGG", close: 117.959999, adjustedClose: 117.642166})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 15), quotes: [new Quote({name:"AGG", close: 118.029999, adjustedClose: 117.711983})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 16), quotes: [new Quote({name:"AGG", close: 117.980003, adjustedClose: 117.662109})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 17), quotes: [new Quote({name:"AGG", close: 117.849998, adjustedClose: 117.657112})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 18), quotes: [new Quote({name:"AGG", close: 117.790001, adjustedClose: 117.597214})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 21), quotes: [new Quote({name:"AGG", close: 117.790001, adjustedClose: 117.597214})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 22), quotes: [new Quote({name:"AGG", close: 117.959999, adjustedClose: 117.766937})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 23), quotes: [new Quote({name:"AGG", close: 117.879997, adjustedClose: 117.687065})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 24), quotes: [new Quote({name:"AGG", close: 117.989998, adjustedClose: 117.796883})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 28), quotes: [new Quote({name:"AGG", close: 118.010002, adjustedClose: 117.816856})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 29), quotes: [new Quote({name:"AGG", close: 118.029999, adjustedClose: 117.836823})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 30), quotes: [new Quote({name:"AGG", close: 118.099998, adjustedClose: 117.906708})]}),
      new InstantQuotes({instant: new Date(2020, 12 - 1, 31), quotes: [new Quote({name:"AGG", close: 118.190002, adjustedClose: 117.996559})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1,  4), quotes: [new Quote({name:"AGG", close: 118.040001, adjustedClose: 117.846809})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1,  5), quotes: [new Quote({name:"AGG", close: 117.919998, adjustedClose: 117.726997})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1,  6), quotes: [new Quote({name:"AGG", close: 117.339996, adjustedClose: 117.147949})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1,  7), quotes: [new Quote({name:"AGG", close: 117.220001, adjustedClose: 117.028152})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1,  8), quotes: [new Quote({name:"AGG", close: 117.080002, adjustedClose: 116.888382})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 11), quotes: [new Quote({name:"AGG", close: 116.889999, adjustedClose: 116.698685})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 12), quotes: [new Quote({name:"AGG", close: 116.989998, adjustedClose: 116.798523})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 13), quotes: [new Quote({name:"AGG", close: 117.360001, adjustedClose: 117.167923})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 14), quotes: [new Quote({name:"AGG", close: 117.129997, adjustedClose: 116.938293})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 15), quotes: [new Quote({name:"AGG", close: 117.250000, adjustedClose: 117.058098})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 19), quotes: [new Quote({name:"AGG", close: 117.410004, adjustedClose: 117.217842})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 20), quotes: [new Quote({name:"AGG", close: 117.419998, adjustedClose: 117.227821})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 21), quotes: [new Quote({name:"AGG", close: 117.250000, adjustedClose: 117.058098})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 22), quotes: [new Quote({name:"AGG", close: 117.250000, adjustedClose: 117.058098})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 25), quotes: [new Quote({name:"AGG", close: 117.550003, adjustedClose: 117.357613})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 26), quotes: [new Quote({name:"AGG", close: 117.510002, adjustedClose: 117.317673})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 27), quotes: [new Quote({name:"AGG", close: 117.519997, adjustedClose: 117.327652})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 28), quotes: [new Quote({name:"AGG", close: 117.440002, adjustedClose: 117.247787})]}),
      new InstantQuotes({instant: new Date(2021,  1 - 1, 29), quotes: [new Quote({name:"AGG", close: 117.309998, adjustedClose: 117.117996})]}),
      new InstantQuotes({instant: new Date(2021,  2 - 1,  1), quotes: [new Quote({name:"AGG", close: 117.230003, adjustedClose: 117.230003})]}),
      new InstantQuotes({instant: new Date(2021,  2 - 1,  2), quotes: [new Quote({name:"AGG", close: 117.050003, adjustedClose: 117.050003})]}),
      new InstantQuotes({instant: new Date(2021,  2 - 1,  3), quotes: [new Quote({name:"AGG", close: 116.910004, adjustedClose: 116.910004})]}),
      new InstantQuotes({instant: new Date(2021,  2 - 1,  4), quotes: [new Quote({name:"AGG", close: 116.860001, adjustedClose: 116.860001})]}),
      new InstantQuotes({instant: new Date(2021,  2 - 1,  5), quotes: [new Quote({name:"AGG", close: 116.709999, adjustedClose: 116.709999})]})
    ]);

    // Dividends of AGG: https://www.ishares.com/us/products/239458/ishares-core-total-us-bond-market-etf
    // | Record date  | Ex date      | Payable date | total distribution |
    // | Dec 02, 2020 | Dec 01, 2020 | Dec 07, 2020 | $0.205967          |
    // | Dec 18, 2020 | Dec 17, 2020 | Dec 23, 2020 | $0.125266          |
    // | Feb 02, 2021 | Feb 01, 2021 | Feb 05, 2021 | $0.191959          |
    ComputeDividends.withAdjustedClose().of("AGG", quotesWithAdjustedClose);

    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1,  1)).quote("AGG").dividend).toBeCloseTo(0.205, 3);
    expect(quotesWithAdjustedClose.get(new Date(2020, 12 - 1, 17)).quote("AGG").dividend).toBeCloseTo(0.125, 3);
    expect(quotesWithAdjustedClose.get(new Date(2021,  2 - 1,  1)).quote("AGG").dividend).toBeCloseTo(0.192, 3);
  });
});

// 0*([0-9]+)\/0*([0-9]+)\/18\s([0-9]+)\,([0-9]+)
// new InstantQuotes({instant: new Date(2018, $2 - 1, $1), quotes: [new Quote({name:"SP500", close: $3.$4})]}),
describe('ComputeDividends.withTotalReturn', () => {

  it('Can calculate dividends of SP500 in 2018', () => {

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
    ComputeDividends
      .withTotalReturn("SP500TR", totalReturn)
      .of("SP500", price);

    // Then calculated dividends should be actual dividends
    let calculatedDividends: number = 0;
    price.forEachDate(instantQuotes => {
      let quote: Quote = instantQuotes.quote("SP500");
      calculatedDividends += quote.dividend;
    });

    // Downloaded from: https://www.multpl.com/s-p-500-dividend-yield/table/by-month
    expect(calculatedDividends).toBe(2.1);
  });

  it('Can calculate dividends over a period of time without rounding error', () => {

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
    ComputeDividends
      .withTotalReturn("SP500TR", totalReturn)
      .of("SP500", price);

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

  it('Can handle TR starting and finishing before PR', () => {
    // Given a TR increasing 20% per month:
    let totalReturn: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: new Date(2018, 1 - 1, 1), quotes: [new Quote({name:"TR", close: 1000})]}),
      new InstantQuotes({instant: new Date(2018, 2 - 1, 1), quotes: [new Quote({name:"TR", close: 1200})]}),
      new InstantQuotes({instant: new Date(2018, 3 - 1, 1), quotes: [new Quote({name:"TR", close: 1440})]}),
      new InstantQuotes({instant: new Date(2018, 4 - 1, 1), quotes: [new Quote({name:"TR", close: 1728})]}),
    ]);

    // Given a PR increasing 10% per month:
    let price: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: new Date(2018, 3 - 1, 1), quotes: [new Quote({name:"PR", close: 100.0})]}),
      new InstantQuotes({instant: new Date(2018, 4 - 1, 1), quotes: [new Quote({name:"PR", close: 110.0})]}),
      new InstantQuotes({instant: new Date(2018, 5 - 1, 1), quotes: [new Quote({name:"PR", close: 121.0})]}),
      new InstantQuotes({instant: new Date(2018, 6 - 1, 1), quotes: [new Quote({name:"PR", close: 133.1})]}),
    ]);

    // When enriching the price quote with total return quote:
    ComputeDividends
      .withTotalReturn("TR", totalReturn)
      .of("PR", price);

    // Then calculated dividends should be 10% per month:
    let calculatedDividends: number = 0;
    price.forEachDate(instantQuotes => {
      let quote: Quote = instantQuotes.quote("PR");
      calculatedDividends += quote.dividend;
    });
    expect(calculatedDividends).toBe(7.58);

  });

  it('Can handle TR starting and finishing after PR', () => {
    // Given a TR increasing 20% per month:
    let totalReturn: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: new Date(2018, 3 - 1, 1), quotes: [new Quote({name:"TR", close: 1000})]}),
      new InstantQuotes({instant: new Date(2018, 4 - 1, 1), quotes: [new Quote({name:"TR", close: 1200})]}),
      new InstantQuotes({instant: new Date(2018, 5 - 1, 1), quotes: [new Quote({name:"TR", close: 1440})]}),
      new InstantQuotes({instant: new Date(2018, 6 - 1, 1), quotes: [new Quote({name:"TR", close: 1728})]}),
    ]);

    // Given a PR increasing 10% per month:
    let price: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: new Date(2018, 1 - 1, 1), quotes: [new Quote({name:"PR", close: 100.0})]}),
      new InstantQuotes({instant: new Date(2018, 2 - 1, 1), quotes: [new Quote({name:"PR", close: 110.0})]}),
      new InstantQuotes({instant: new Date(2018, 3 - 1, 1), quotes: [new Quote({name:"PR", close: 121.0})]}),
      new InstantQuotes({instant: new Date(2018, 4 - 1, 1), quotes: [new Quote({name:"PR", close: 133.1})]}),
    ]);

    // When enriching the price quote with total return quote:
    ComputeDividends
      .withTotalReturn("TR", totalReturn)
      .of("PR", price);

    // Then calculated dividends should be 10% per month:
    let calculatedDividends: number = 0;
    price.forEachDate(instantQuotes => {
      let quote: Quote = instantQuotes.quote("PR");
      calculatedDividends += quote.dividend;
    });
    expect(calculatedDividends).toBe(7.58);


  });
});
