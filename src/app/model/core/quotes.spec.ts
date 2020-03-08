import { InstantQuotes, HistoricalQuotes, Dividend } from './quotes';
import { Quote, Candlestick } from './asset';

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
    let instantQuotes: InstantQuotes = new InstantQuotes({
      instant: new Date(),
      quotes: [
          new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
          new Quote({name: "ISIN2", partValue: new Candlestick({close: 1.2})}),
          new Quote({name: "ISIN3", partValue: new Candlestick({close: 1.3})})
    ]});
    let quote: Quote = instantQuotes.quote("ISIN1");
    expect(quote).toEqual(new Quote({
      name: "ISIN1",
      partValue: new Candlestick({
        close: 1.1
      })
    }));
  });

  it('Can add more assets of interest', () =>{
    let instantQuotes: InstantQuotes = new InstantQuotes({
      instant: new Date(),
      quotes: [
          new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
          new Quote({name: "ISIN2", partValue: new Candlestick({close: 1.2})}),
          new Quote({name: "ISIN3", partValue: new Candlestick({close: 1.3})})
    ]});

    instantQuotes.add([
      new Quote({name: "ISIN2", partValue: new Candlestick({close: 2.2})}),
      new Quote({name: "ISIN3", partValue: new Candlestick({close: 2.3})}),
      new Quote({name: "ISIN4", partValue: new Candlestick({close: 2.4})})
    ]);

    expect(instantQuotes.quotes).toEqual(jasmine.arrayWithExactContents([
      new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
      new Quote({name: "ISIN2", partValue: new Candlestick({close: 2.2})}),
      new Quote({name: "ISIN3", partValue: new Candlestick({close: 2.3})}),
      new Quote({name: "ISIN4", partValue: new Candlestick({close: 2.4})})
    ]));

    instantQuotes.add([
      new Quote({name: "ISIN1", partValue: new Candlestick({close: 3.1})})
    ]);

    expect(instantQuotes.quotes).toEqual(jasmine.arrayWithExactContents([
      new Quote({name: "ISIN1", partValue: new Candlestick({close: 3.1})}),
      new Quote({name: "ISIN2", partValue: new Candlestick({close: 2.2})}),
      new Quote({name: "ISIN3", partValue: new Candlestick({close: 2.3})}),
      new Quote({name: "ISIN4", partValue: new Candlestick({close: 2.4})})
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

  it('Can return the instantQuotes of the required day', () => {

    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 1.2})}),
        new Quote({name: "ISIN3", partValue: new Candlestick({close: 1.3})})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 2.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 2.2})}),
        new Quote({name: "ISIN3", partValue: new Candlestick({close: 2.3})})
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 3.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 3.2})}),
        new Quote({name: "ISIN3", partValue: new Candlestick({close: 3.3})})
      ]})
    ]);

    expect(historicalQuotes.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 1.2})}),
        new Quote({name: "ISIN3", partValue: new Candlestick({close: 1.3})})
      ]));

    expect(historicalQuotes.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 2.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 2.2})}),
        new Quote({name: "ISIN3", partValue: new Candlestick({close: 2.3})})
      ]));

    expect(historicalQuotes.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 3.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 3.2})}),
        new Quote({name: "ISIN3", partValue: new Candlestick({close: 3.3})})
      ]));
  });

  it('Can add more data', () =>{
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 1.2})})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 2.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 2.2})})
      ]})
    ]);

    historicalQuotes.merge(
      new HistoricalQuotes([
        new InstantQuotes({instant: beforeYesterday, quotes: [
          new Quote({name: "ISIN3", partValue: new Candlestick({close: 1.3})})
        ]}),
        new InstantQuotes({instant: yesterday, quotes: [
          new Quote({name: "ISIN3", partValue: new Candlestick({close: 2.3})})
        ]}),
        new InstantQuotes({instant: today, quotes: [
          new Quote({name: "ISIN3", partValue: new Candlestick({close: 3.3})})
        ]})])
    );

    expect(historicalQuotes.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 1.2})}),
        new Quote({name: "ISIN3", partValue: new Candlestick({close: 1.3})})
      ]));

    expect(historicalQuotes.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 2.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 2.2})}),
        new Quote({name: "ISIN3", partValue: new Candlestick({close: 2.3})})
      ]));

    expect(historicalQuotes.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN3", partValue: new Candlestick({close: 3.3})})
      ]));
  });

  it('Can add more data (2)', () =>{
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: threeDaysAgo, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 3.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 3.2})})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 1.2})})
      ]})
    ]);

    historicalQuotes.merge(
      new HistoricalQuotes([
        new InstantQuotes({instant: beforeYesterday, quotes: [
          new Quote({name: "ISIN3", partValue: new Candlestick({close: 2.3})})
        ]}),
        new InstantQuotes({instant: today, quotes: [
          new Quote({name: "ISIN3", partValue: new Candlestick({close: 0.3})})
        ]})])
    );

    expect(historicalQuotes.get(threeDaysAgo2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 3.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 3.2})})
      ]));

    expect(historicalQuotes.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN3", partValue: new Candlestick({close: 2.3})})
      ]));

    expect(historicalQuotes.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 1.2})})
      ]));

    expect(historicalQuotes.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN3", partValue: new Candlestick({close: 0.3})})
      ]));
  });

  it('Can replace existing data', () => {

    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 1.2})})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 2.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 2.2})})
      ]})
    ]);

    historicalQuotes.merge(
      new HistoricalQuotes([
        new InstantQuotes({instant: beforeYesterday, quotes: [
          new Quote({name: "ISIN2", partValue: new Candlestick({close: 4.4})})
        ]}),
        new InstantQuotes({instant: yesterday, quotes: [
          new Quote({name: "ISIN2", partValue: new Candlestick({close: 4.5})})
        ]}),
        new InstantQuotes({instant: today, quotes: [
          new Quote({name: "ISIN2", partValue: new Candlestick({close: 4.6})})
        ]})
      ])
    );

    expect(historicalQuotes.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 4.4})})
      ]));

    expect(historicalQuotes.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 2.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 4.5})})
      ]));

    expect(historicalQuotes.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 4.6})})
      ]));
  });

  it('Can enrich with dividends', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 200})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 200})}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 100})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 100})}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 300})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 300})}),
      ]})
    ]);

    historicalQuotes.enrichWithDividends([
      new Dividend({instant: beforeYesterday, name : "ISIN1", dividend: 2.5}),
      new Dividend({instant: today, name : "ISIN1", dividend: 1.5}),
    ]);

    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(historicalQuotes.get(today).quote("ISIN1").dividend).toBe(1.5);
  });

  it('Can enrich with dividends even when dates mismatch', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 100})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 100})}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 300})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 300})}),
      ]})
    ]);

    historicalQuotes.enrichWithDividends([
      new Dividend({instant: beforeYesterday, name : "ISIN1", dividend: 2.5}),
      new Dividend({instant: today, name : "ISIN1", dividend: 1.5}),
    ]);

    expect(historicalQuotes.get(yesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(historicalQuotes.get(today).quote("ISIN1").dividend).toBe(1.5);
  });

  it('Can enrich with dividends even when dates mismatch (2)', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 100})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 100})}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 300})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 300})}),
      ]})
    ]);

    historicalQuotes.enrichWithDividends([
      new Dividend({instant: yesterday, name : "ISIN1", dividend: 2.5}),
      new Dividend({instant: today, name : "ISIN1", dividend: 1.5}),
    ]);

    expect(historicalQuotes.get(beforeYesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(historicalQuotes.get(today).quote("ISIN1").dividend).toBe(1.5);
  });

  it('Can iterate over all dates', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 1.2})}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 2.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 2.2})}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 3.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 3.2})}),
      ]})
    ]);

    let numberOfCalls: number = 0;
    let instant: Date = beforeYesterday;
    historicalQuotes.forEachDate((instantQuotes: InstantQuotes) => {
      numberOfCalls++;
      expect(instantQuotes.quotes.length).toBe(2);
      expect(instantQuotes.instant.valueOf()).toBeGreaterThanOrEqual(instant.valueOf());
      instant = instantQuotes.instant;
    });
    expect(numberOfCalls).toBe(3);
  });

  it('Can iterate over a range of dates', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 1.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 1.2})}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 2.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 2.2})}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", partValue: new Candlestick({close: 3.1})}),
        new Quote({name: "ISIN2", partValue: new Candlestick({close: 3.2})}),
      ]})
    ]);

    let numberOfCalls: number;

    numberOfCalls = 0;
    historicalQuotes.forEachDate(() => {
      numberOfCalls++;
    }, beforeYesterday, today);
    expect(numberOfCalls).toBe(3);

    numberOfCalls = 0;
    historicalQuotes.forEachDate(() => {
      numberOfCalls++;
    }, yesterday, today);
    expect(numberOfCalls).toBe(2);

    numberOfCalls = 0;
    historicalQuotes.forEachDate(() => {
      numberOfCalls++;
    }, beforeYesterday, beforeYesterday);
    expect(numberOfCalls).toBe(1);
  });
});
