import { InstantQuotes, HistoricalQuotes, Candlestick, CandlestickType, Quote } from './quotes';

describe('Candlestick', () => {
  it('Can be green when open price is lesser than close price', () =>{
    let candlestick: Candlestick = new Candlestick({
      open: 10,
      close: 20
    });
    expect(candlestick.type()).toBe(CandlestickType.GREEN);
  });
  it('Can be green when open and close price are equal', () =>{
    let candlestick: Candlestick = new Candlestick({
      open: 10,
      close: 10
    });
    expect(candlestick.type()).toBe(CandlestickType.GREEN);
  });
  it('Can be red when open price is greater than close price', () =>{
    let candlestick: Candlestick = new Candlestick({
      open: 20,
      close: 10
    });
    expect(candlestick.type()).toBe(CandlestickType.RED);
  });

  it('Can merge with another candlestick', () =>{
    let candlestick1 = new Candlestick({
      open: 10,
      high: 23,
      low: 9,
      close: 20
    });
    let candlestick2 = new Candlestick({
      open: 19,
      high: 25,
      low: 15,
      close: 22
    });
    let candlestick = candlestick1.merge(candlestick2);
    expect(candlestick).toEqual(new Candlestick({
      open: 10,
      high: 25,
      low: 9,
      close: 22
    }));
  });
});

describe('Quote', () => {
  it('Can create a new instance', () => {
    expect(new Quote({
      name: "XX",
      close: 1.5,
      spread: 0.01,
      dividend: 0.01
    })).toBeTruthy();
  });

  it('Can use the open value as part value', () => {
    let quote: Quote = new Quote({
      name: "XX",
      open: 2.0,
      close: 1.5,
      spread: 0.01,
      dividend: 0.01
    });
    expect(quote.partValue()).toBe(2.0);
  });

  it('Can use the close value as part value when open value is not available', () => {
    let quote: Quote = new Quote({
      name: "XX",
      close: 1.5,
      spread: 0.01,
      dividend: 0.01
    });
    expect(quote.partValue()).toBe(1.5);
  });
});

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
          new Quote({name: "ISIN1", close: 1.1}),
          new Quote({name: "ISIN2", close: 1.2}),
          new Quote({name: "ISIN3", close: 1.3})
    ]});
    let quote: Quote = instantQuotes.quote("ISIN1");
    expect(quote).toEqual(new Quote({
      name: "ISIN1",
      close: 1.1
    }));
  });

  it('Can add more assets of interest', () =>{
    let instantQuotes: InstantQuotes = new InstantQuotes({
      instant: new Date(),
      quotes: [
          new Quote({name: "ISIN1", close: 1.1}),
          new Quote({name: "ISIN2", close: 1.2}),
          new Quote({name: "ISIN3", close: 1.3})
    ]});

    instantQuotes.add([
      new Quote({name: "ISIN2", close: 2.2}),
      new Quote({name: "ISIN3", close: 2.3}),
      new Quote({name: "ISIN4", close: 2.4})
    ]);

    expect(instantQuotes.quotes).toEqual(jasmine.arrayWithExactContents([
      new Quote({name: "ISIN1", close: 1.1}),
      new Quote({name: "ISIN2", close: 2.2}),
      new Quote({name: "ISIN3", close: 2.3}),
      new Quote({name: "ISIN4", close: 2.4})
    ]));

    instantQuotes.add([
      new Quote({name: "ISIN1", close: 3.1})
    ]);

    expect(instantQuotes.quotes).toEqual(jasmine.arrayWithExactContents([
      new Quote({name: "ISIN1", close: 3.1}),
      new Quote({name: "ISIN2", close: 2.2}),
      new Quote({name: "ISIN3", close: 2.3}),
      new Quote({name: "ISIN4", close: 2.4})
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
        new Quote({name: "ISIN1", close: 1.1}),
        new Quote({name: "ISIN2", close: 1.2}),
        new Quote({name: "ISIN3", close: 1.3})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 2.1}),
        new Quote({name: "ISIN2", close: 2.2}),
        new Quote({name: "ISIN3", close: 2.3})
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", close: 3.1}),
        new Quote({name: "ISIN2", close: 3.2}),
        new Quote({name: "ISIN3", close: 3.3})
      ]})
    ]);

    expect(historicalQuotes.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", close: 1.1}),
        new Quote({name: "ISIN2", close: 1.2}),
        new Quote({name: "ISIN3", close: 1.3})
      ]));

    expect(historicalQuotes.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", close: 2.1}),
        new Quote({name: "ISIN2", close: 2.2}),
        new Quote({name: "ISIN3", close: 2.3})
      ]));

    expect(historicalQuotes.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", close: 3.1}),
        new Quote({name: "ISIN2", close: 3.2}),
        new Quote({name: "ISIN3", close: 3.3})
      ]));
  });

  it('Can add more data', () =>{
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", close: 1.1}),
        new Quote({name: "ISIN2", close: 1.2})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 2.1}),
        new Quote({name: "ISIN2", close: 2.2})
      ]})
    ]);

    historicalQuotes.merge(
      new HistoricalQuotes([
        new InstantQuotes({instant: beforeYesterday, quotes: [
          new Quote({name: "ISIN3", close: 1.3})
        ]}),
        new InstantQuotes({instant: yesterday, quotes: [
          new Quote({name: "ISIN3", close: 2.3})
        ]}),
        new InstantQuotes({instant: today, quotes: [
          new Quote({name: "ISIN3", close: 3.3})
        ]})])
    );

    expect(historicalQuotes.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", close: 1.1}),
        new Quote({name: "ISIN2", close: 1.2}),
        new Quote({name: "ISIN3", close: 1.3})
      ]));

    expect(historicalQuotes.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", close: 2.1}),
        new Quote({name: "ISIN2", close: 2.2}),
        new Quote({name: "ISIN3", close: 2.3})
      ]));

    expect(historicalQuotes.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN3", close: 3.3})
      ]));
  });

  it('Can add more data (2)', () =>{
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: threeDaysAgo, quotes: [
        new Quote({name: "ISIN1", close: 3.1}),
        new Quote({name: "ISIN2", close: 3.2})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 1.1}),
        new Quote({name: "ISIN2", close: 1.2})
      ]})
    ]);

    historicalQuotes.merge(
      new HistoricalQuotes([
        new InstantQuotes({instant: beforeYesterday, quotes: [
          new Quote({name: "ISIN3", close: 2.3})
        ]}),
        new InstantQuotes({instant: today, quotes: [
          new Quote({name: "ISIN3", close: 0.3})
        ]})])
    );

    expect(historicalQuotes.get(threeDaysAgo2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", close: 3.1}),
        new Quote({name: "ISIN2", close: 3.2})
      ]));

    expect(historicalQuotes.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN3", close: 2.3})
      ]));

    expect(historicalQuotes.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", close: 1.1}),
        new Quote({name: "ISIN2", close: 1.2})
      ]));

    expect(historicalQuotes.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN3", close: 0.3})
      ]));
  });

  it('Can replace existing data', () => {

    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", close: 1.1}),
        new Quote({name: "ISIN2", close: 1.2})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 2.1}),
        new Quote({name: "ISIN2", close: 2.2})
      ]})
    ]);

    historicalQuotes.merge(
      new HistoricalQuotes([
        new InstantQuotes({instant: beforeYesterday, quotes: [
          new Quote({name: "ISIN2", close: 4.4})
        ]}),
        new InstantQuotes({instant: yesterday, quotes: [
          new Quote({name: "ISIN2", close: 4.5})
        ]}),
        new InstantQuotes({instant: today, quotes: [
          new Quote({name: "ISIN2", close: 4.6})
        ]})
      ])
    );

    expect(historicalQuotes.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", close: 1.1}),
        new Quote({name: "ISIN2", close: 4.4})
      ]));

    expect(historicalQuotes.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", close: 2.1}),
        new Quote({name: "ISIN2", close: 4.5})
      ]));

    expect(historicalQuotes.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN2", close: 4.6})
      ]));
  });

  it('Can iterate over all dates', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", close: 1.1}),
        new Quote({name: "ISIN2", close: 1.2}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 2.1}),
        new Quote({name: "ISIN2", close: 2.2}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", close: 3.1}),
        new Quote({name: "ISIN2", close: 3.2}),
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
        new Quote({name: "ISIN1", close: 1.1}),
        new Quote({name: "ISIN2", close: 1.2}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", close: 2.1}),
        new Quote({name: "ISIN2", close: 2.2}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN1", close: 3.1}),
        new Quote({name: "ISIN2", close: 3.2}),
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

  it('Can find the maximum date in the series', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", close: 1.1}),
        new Quote({name: "ISIN2", close: 1.2}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN2", close: 2.1}),
        new Quote({name: "ISIN3", close: 2.2}),
      ]}),
      new InstantQuotes({instant: today, quotes: [
        new Quote({name: "ISIN3", close: 3.1}),
        new Quote({name: "ISIN4", close: 3.2}),
      ]})
    ]);
    expect(historicalQuotes.maxDate("ISIN1")).toEqual(beforeYesterday);
    expect(historicalQuotes.maxDate("ISIN2")).toEqual(yesterday);
    expect(historicalQuotes.maxDate("ISIN3")).toEqual(today);
    expect(historicalQuotes.maxDate("ISIN4")).toEqual(today);
    expect(historicalQuotes.maxDate("ISIN5")).toBeFalsy();
    expect(historicalQuotes.maxDate()).toEqual(today);
  });

  it('Can adjust past prices based on a quote', () => {
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: threeDaysAgo, quotes: [
        new Quote({name: "ISIN1", open: 10, high: 20, low: 5, close: 10, adjustedClose: 9, volume: 1000}),
      ]}),
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN1", open: 9, high: 18, low: 4, close: 9, adjustedClose: 9, volume: 1000}),
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN1", open: 9, high: 12, low: 3, close: 5, adjustedClose: 5, volume: 1000}),
      ]})
    ]);

    historicalQuotes.adjust(yesterday, new Quote(new Quote({
      name: "ISIN1",
      open: 18,
      high: 24,
      low: 6,
      close: 10,
      adjustedClose: 10,
      volume: 2000
    })));

    expect(historicalQuotes.get(threeDaysAgo).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", open: 20, high: 40, low: 10, close: 20, adjustedClose: 18, volume: 2000})
      ]));

    expect(historicalQuotes.get(beforeYesterday).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", open: 18, high: 36, low: 8, close: 18, adjustedClose: 18, volume: 2000})
      ]));

    expect(historicalQuotes.get(yesterday).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({name: "ISIN1", open: 18, high: 24, low: 6, close: 10, adjustedClose: 10, volume: 2000})
      ]));
  });
});
