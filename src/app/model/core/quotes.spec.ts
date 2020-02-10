import { InstantQuotes, HistoricalQuotes, Dividend } from './quotes';
import { Quote } from './asset';

describe('InstantQuotes', () => {
  it('Can create an instance', () => {
    expect(new InstantQuotes({
      instant: new Date(),
      quotes: [
        new Quote(),
        new Quote()
      ]})).toBeTruthy();
  });

  it('Can obtain one quote', () => {
    let stock: InstantQuotes = new InstantQuotes({
      instant: new Date(),
      quotes: [
          new Quote({name: "ISIN1", partValue: 1.1}),
          new Quote({name: "ISIN2", partValue: 1.2}),
          new Quote({name: "ISIN3", partValue: 1.3})
    ]});
    let quote: Quote = stock.quote("ISIN1");
    expect(quote).toEqual(new Quote({
      name: "ISIN1",
      partValue: 1.1
    }));
  });

  it('Can add more assets of interest', () =>{
    let stock: InstantQuotes = new InstantQuotes({
      instant: new Date(),
      quotes: [
          new Quote({name: "ISIN1", partValue: 1.1}),
          new Quote({name: "ISIN2", partValue: 1.2}),
          new Quote({name: "ISIN3", partValue: 1.3})
    ]});

    stock.add([
      new Quote({name: "ISIN2", partValue: 2.2}),
      new Quote({name: "ISIN3", partValue: 2.3}),
      new Quote({name: "ISIN4", partValue: 2.4})
    ]);

    expect(stock.quotes).toEqual(jasmine.arrayWithExactContents([
      new Quote({name: "ISIN1", partValue: 1.1}),
      new Quote({name: "ISIN2", partValue: 2.2}),
      new Quote({name: "ISIN3", partValue: 2.3}),
      new Quote({name: "ISIN4", partValue: 2.4})
    ]));

    stock.add([
      new Quote({name: "ISIN1", partValue: 3.1})
    ]);

    expect(stock.quotes).toEqual(jasmine.arrayWithExactContents([
      new Quote({name: "ISIN1", partValue: 3.1}),
      new Quote({name: "ISIN2", partValue: 2.2}),
      new Quote({name: "ISIN3", partValue: 2.3}),
      new Quote({name: "ISIN4", partValue: 2.4})
    ]));
  });
});

let now: Date = new Date();
let today: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
let yesterday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
let beforeYesterday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
let threeDaysAgo: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);
let today2: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
let yesterday2: Date = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
let beforeYesterday2: Date = new Date(beforeYesterday.getFullYear(), beforeYesterday.getMonth(), beforeYesterday.getDate());
let threeDaysAgo2: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);

describe('HistoricalQuotes', () => {
  it('Can create an instance', () => {
    expect(new HistoricalQuotes(
      [
        new InstantQuotes({instant: today}),
        new InstantQuotes({instant: yesterday}),
        new InstantQuotes({instant: beforeYesterday})
      ])).toBeTruthy();
  });

  it('Can return the stock of the required day', () => {

    let stockData: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 1.1}),
        new Quote({name: "ISIN2", partValue: 1.2}),
        new Quote({name: "ISIN3", partValue: 1.3})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 2.1}),
        new Quote({name: "ISIN2", partValue: 2.2}),
        new Quote({name: "ISIN3", partValue: 2.3})
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: 3.1}),
        new Quote({name: "ISIN2", partValue: 3.2}),
        new Quote({name: "ISIN3", partValue: 3.3})
      ]})
    ]);

    expect(stockData.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: 1.1}),
        new Quote({name: "ISIN2", partValue: 1.2}),
        new Quote({name: "ISIN3", partValue: 1.3})
      ]));

    expect(stockData.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: 2.1}),
        new Quote({name: "ISIN2", partValue: 2.2}),
        new Quote({name: "ISIN3", partValue: 2.3})
      ]));

    expect(stockData.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: 3.1}),
        new Quote({name: "ISIN2", partValue: 3.2}),
        new Quote({name: "ISIN3", partValue: 3.3})
      ]));
  });

  it('Can add more data', () =>{
    let stockData: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 1.1}),
        new Quote({name: "ISIN2", partValue: 1.2})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 2.1}),
        new Quote({name: "ISIN2", partValue: 2.2})
      ]})
    ]);

    stockData.merge(
      new HistoricalQuotes([
        new InstantQuotes({instant: beforeYesterday, quotes: [
          new Quote({name: "ISIN3", partValue: 1.3})
        ]}),
        new InstantQuotes({instant: yesterday, quotes: [
          new Quote({name: "ISIN3", partValue: 2.3})
        ]}),
        new InstantQuotes({instant: today, quotes: [
          new Quote({name: "ISIN3", partValue: 3.3})
        ]})])
    );

    expect(stockData.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: 1.1}),
        new Quote({name: "ISIN2", partValue: 1.2}),
        new Quote({name: "ISIN3", partValue: 1.3})
      ]));

    expect(stockData.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: 2.1}),
        new Quote({name: "ISIN2", partValue: 2.2}),
        new Quote({name: "ISIN3", partValue: 2.3})
      ]));

    expect(stockData.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN3", partValue: 3.3})
      ]));
  });

  it('Can add more data (2)', () =>{
    let stockData: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: threeDaysAgo, quotes: [
        new Quote({name: "ISIN1", partValue: 3.1}),
        new Quote({name: "ISIN2", partValue: 3.2})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 1.1}),
        new Quote({name: "ISIN2", partValue: 1.2})
      ]})
    ]);

    stockData.merge(
      new HistoricalQuotes([
        new InstantQuotes({instant: beforeYesterday, quotes: [
          new Quote({name: "ISIN3", partValue: 2.3})
        ]}),
        new InstantQuotes({instant: today, quotes: [
          new Quote({name: "ISIN3", partValue: 0.3})
        ]})])
    );

    expect(stockData.get(threeDaysAgo2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: 3.1}),
        new Quote({name: "ISIN2", partValue: 3.2})
      ]));

    expect(stockData.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN3", partValue: 2.3})
      ]));

    expect(stockData.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: 1.1}),
        new Quote({name: "ISIN2", partValue: 1.2})
      ]));

    expect(stockData.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN3", partValue: 0.3})
      ]));
  });

  it('Can replace existing data', () => {

    let stockData: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 1.1}),
        new Quote({name: "ISIN2", partValue: 1.2})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 2.1}),
        new Quote({name: "ISIN2", partValue: 2.2})
      ]})
    ]);

    stockData.merge(
      new HistoricalQuotes([
        new InstantQuotes({instant: beforeYesterday, quotes: [
          new Quote({name: "ISIN2", partValue: 4.4})
        ]}),
        new InstantQuotes({instant: yesterday, quotes: [
          new Quote({name: "ISIN2", partValue: 4.5})
        ]}),
        new InstantQuotes({instant: today, quotes: [
          new Quote({name: "ISIN2", partValue: 4.6})
        ]})
      ])
    );

    expect(stockData.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: 1.1}),
        new Quote({name: "ISIN2", partValue: 4.4})
      ]));

    expect(stockData.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: 2.1}),
        new Quote({name: "ISIN2", partValue: 4.5})
      ]));

    expect(stockData.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN2", partValue: 4.6})
      ]));
  });

  it('Can enrich with dividends', () => {
    let stockData: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 200}),
        new Quote({name: "ISIN2", partValue: 200}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 100}),
        new Quote({name: "ISIN2", partValue: 100}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: 300}),
        new Quote({name: "ISIN2", partValue: 300}),
      ]})
    ]);

    stockData.enrichWithDividends([
      new Dividend({instant: beforeYesterday, name : "ISIN1", dividend: 2.5}),
      new Dividend({instant: today, name : "ISIN1", dividend: 1.5}),
    ]);

    expect(stockData.get(beforeYesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(stockData.get(today).quote("ISIN1").dividend).toBe(1.5);
  });

  it('Can enrich with dividends even when dates mismatch', () => {
    let stockData: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 100}),
        new Quote({name: "ISIN2", partValue: 100}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: 300}),
        new Quote({name: "ISIN2", partValue: 300}),
      ]})
    ]);

    stockData.enrichWithDividends([
      new Dividend({instant: beforeYesterday, name : "ISIN1", dividend: 2.5}),
      new Dividend({instant: today, name : "ISIN1", dividend: 1.5}),
    ]);

    expect(stockData.get(yesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(stockData.get(today).quote("ISIN1").dividend).toBe(1.5);
  });

  it('Can enrich with dividends even when dates mismatch (2)', () => {
    let stockData: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 100}),
        new Quote({name: "ISIN2", partValue: 100}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: 300}),
        new Quote({name: "ISIN2", partValue: 300}),
      ]})
    ]);

    stockData.enrichWithDividends([
      new Dividend({instant: yesterday, name : "ISIN1", dividend: 2.5}),
      new Dividend({instant: today, name : "ISIN1", dividend: 1.5}),
    ]);

    expect(stockData.get(beforeYesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(stockData.get(today).quote("ISIN1").dividend).toBe(1.5);
  });

  it('Can iterate over all dates', () => {
    let stockData: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 1.1}),
        new Quote({name: "ISIN2", partValue: 1.2}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 2.1}),
        new Quote({name: "ISIN2", partValue: 2.2}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: 3.1}),
        new Quote({name: "ISIN2", partValue: 3.2}),
      ]})
    ]);

    let numberOfCalls: number = 0;
    let instant: Date = beforeYesterday;
    stockData.forEachDate((stock: InstantQuotes) => {
      numberOfCalls++;
      expect(stock.quotes.length).toBe(2);
      expect(stock.instant.valueOf()).toBeGreaterThanOrEqual(instant.valueOf());
      instant = stock.instant;
    });
    expect(numberOfCalls).toBe(3);
  });

  it('Can iterate over a range of dates', () => {
    let stockData: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 1.1}),
        new Quote({name: "ISIN2", partValue: 1.2}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: 2.1}),
        new Quote({name: "ISIN2", partValue: 2.2}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: 3.1}),
        new Quote({name: "ISIN2", partValue: 3.2}),
      ]})
    ]);

    let numberOfCalls: number;

    numberOfCalls = 0;
    stockData.forEachDate(() => {
      numberOfCalls++;
    }, beforeYesterday, today);
    expect(numberOfCalls).toBe(3);

    numberOfCalls = 0;
    stockData.forEachDate(() => {
      numberOfCalls++;
    }, yesterday, today);
    expect(numberOfCalls).toBe(2);

    numberOfCalls = 0;
    stockData.forEachDate(() => {
      numberOfCalls++;
    }, beforeYesterday, beforeYesterday);
    expect(numberOfCalls).toBe(1);
  });
});
