import { HistoricalQuotes, InstantQuotes, Quote } from "../core/quotes";
import { EnrichWithDividends, EnrichWithTotalReturn } from './quotes-enrich';
import { ApplyExchangeRate } from './quotes-exchange-rate';

let now: Date = new Date();
let tomorrow: Date =        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
let today: Date =           new Date(now.getFullYear(), now.getMonth(), now.getDate() + 0);
let yesterday: Date =       new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
let beforeYesterday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);

describe('ApplyExchangeRate', () => {

  it('Can apply exchange rate', () => {
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

    let applyExchangeRate: ApplyExchangeRate =
      new ApplyExchangeRate([
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
