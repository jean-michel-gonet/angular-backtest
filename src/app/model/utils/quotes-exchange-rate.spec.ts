import { HistoricalQuotes, InstantQuotes, Quote } from "../core/quotes";
import { ApplyExchangeRate } from './quotes-exchange-rate';
import { ExchangeRateOperation } from 'src/app/services/quotes/quotes-configuration.service';

let now: Date = new Date();
let today: Date =           new Date(now.getFullYear(), now.getMonth(), now.getDate() + 0);
let yesterday: Date =       new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
let beforeYesterday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);

describe('ApplyExchangeRate', () => {

  it('Can apply exchange rate with MULTIPLY', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({
          name: "ISIN1",
          open: 210,
          high: 230,
          low: 190,
          close: 200,
          dividend: 0.5
        }),
        new Quote({name: "USD.CHF", close: 1.15}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 100}),
        new Quote({name: "USD.CHF", close: 1.1}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", close: 300}),
        new Quote({name: "USD.CHF", close: 1.05}),
      ]})
    ]);

    let applyExchangeRate: ApplyExchangeRate =
      new ApplyExchangeRate(ExchangeRateOperation.MULTIPLY, "USD.CHF", historicalQuotes);
    applyExchangeRate.applyTo("ISIN1", historicalQuotes);

    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").open).toBeCloseTo(241.5, 1);
    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").high).toBeCloseTo(264.5, 1);
    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").low).toBeCloseTo(218.5, 1);
    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").close).toBeCloseTo(230.0, 1);
    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").dividend).toBeCloseTo(0.575, 2);

    expect(historicalQuotes.get(yesterday).quote("ISIN1").close).toBeCloseTo(110.0, 1);
    expect(historicalQuotes.get(today).quote("ISIN1").close).toBeCloseTo(315.0, 1);
  });

  it('Can apply exchange rate with DIVIDE', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({
          name: "ISIN1",
          open: 210,
          high: 230,
          low: 190,
          close: 200,
          dividend: 0.3
        }),
        new Quote({name: "USD.CHF", close: 1.15}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 100}),
        new Quote({name: "USD.CHF", close: 1.1}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", close: 300}),
        new Quote({name: "USD.CHF", close: 1.05}),
      ]})
    ]);

    let applyExchangeRate: ApplyExchangeRate =
      new ApplyExchangeRate(ExchangeRateOperation.DIVIDE, "USD.CHF", historicalQuotes);
    applyExchangeRate.applyTo("ISIN1", historicalQuotes);

    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").open).toBeCloseTo(182.6, 1);
    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").high).toBeCloseTo(200.0, 1);
    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").low).toBeCloseTo(165.2, 1);
    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").close).toBeCloseTo(173.9, 1);
    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").dividend).toBeCloseTo(0.260, 2);

    expect(historicalQuotes.get(yesterday).quote("ISIN1").close).toBeCloseTo(90.9, 1);
    expect(historicalQuotes.get(today).quote("ISIN1").close).toBeCloseTo(285.7, 1);
  });

  it('Can apply previous exchange rate when dates are not matching - 1', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", close: 200}),
        new Quote({name: "USD.CHF", close: 1.15}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 100}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", close: 300}),
      ]})
    ]);

    let applyExchangeRate: ApplyExchangeRate =
      new ApplyExchangeRate(ExchangeRateOperation.MULTIPLY, "USD.CHF", historicalQuotes);
    applyExchangeRate.applyTo("ISIN1", historicalQuotes);

    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").close).toBeCloseTo(230.0, 1);
    expect(historicalQuotes.get(yesterday).quote("ISIN1").close).toBeCloseTo(115.0, 1);
    expect(historicalQuotes.get(today).quote("ISIN1").close).toBeCloseTo(345.0, 1);
  });

  it('Can apply previous exchange rate when dates are not matching - 2', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", close: 200}),
        new Quote({name: "USD.CHF", close: 1.15}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 100}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", close: 300}),
        new Quote({name: "USD.CHF", close: 1.2}),
      ]})
    ]);

    let applyExchangeRate: ApplyExchangeRate =
      new ApplyExchangeRate(ExchangeRateOperation.MULTIPLY, "USD.CHF", historicalQuotes);
    applyExchangeRate.applyTo("ISIN1", historicalQuotes);

    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").close).toBeCloseTo(230.0, 1);
    expect(historicalQuotes.get(yesterday).quote("ISIN1").close).toBeCloseTo(115.0, 1);
    expect(historicalQuotes.get(today).quote("ISIN1").close).toBeCloseTo(360.0, 1);
  });
});
