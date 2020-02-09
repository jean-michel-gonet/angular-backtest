import { Stock, StockData, Dividend } from './stock';
import { Quote } from './asset';

describe('Stock', () => {
  it('Can create an instance', () => {
    expect(new Stock({
      time: new Date(),
      quotes: [
        new Quote(),
        new Quote()
      ]})).toBeTruthy();
  });

  it('Can obtain one quote', () => {
    let stock: Stock = new Stock({
      time: new Date(),
      quotes: [
          new Quote({isin: "ISIN1", partValue: 1.1}),
          new Quote({isin: "ISIN2", partValue: 1.2}),
          new Quote({isin: "ISIN3", partValue: 1.3})
    ]});
    let quote: Quote = stock.quote("ISIN1");
    expect(quote).toEqual(new Quote({
      isin: "ISIN1",
      partValue: 1.1
    }));
  });

  it('Can add more assets of interest', () =>{
    let stock: Stock = new Stock({
      time: new Date(),
      quotes: [
          new Quote({isin: "ISIN1", partValue: 1.1}),
          new Quote({isin: "ISIN2", partValue: 1.2}),
          new Quote({isin: "ISIN3", partValue: 1.3})
    ]});

    stock.add([
      new Quote({isin: "ISIN2", partValue: 2.2}),
      new Quote({isin: "ISIN3", partValue: 2.3}),
      new Quote({isin: "ISIN4", partValue: 2.4})
    ]);

    expect(stock.quotes).toEqual(jasmine.arrayWithExactContents([
      new Quote({isin: "ISIN1", partValue: 1.1}),
      new Quote({isin: "ISIN2", partValue: 2.2}),
      new Quote({isin: "ISIN3", partValue: 2.3}),
      new Quote({isin: "ISIN4", partValue: 2.4})
    ]));

    stock.add([
      new Quote({isin: "ISIN1", partValue: 3.1})
    ]);

    expect(stock.quotes).toEqual(jasmine.arrayWithExactContents([
      new Quote({isin: "ISIN1", partValue: 3.1}),
      new Quote({isin: "ISIN2", partValue: 2.2}),
      new Quote({isin: "ISIN3", partValue: 2.3}),
      new Quote({isin: "ISIN4", partValue: 2.4})
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

describe('StockData', () => {
  it('Can create an instance', () => {
    expect(new StockData(
      [
        new Stock({time: today}),
        new Stock({time: yesterday}),
        new Stock({time: beforeYesterday})
      ])).toBeTruthy();
  });

  it('Can return the stock of the required day', () => {

    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 1.1}),
        new Quote({isin: "ISIN2", partValue: 1.2}),
        new Quote({isin: "ISIN3", partValue: 1.3})
      ]}),
      new Stock({time: yesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 2.1}),
        new Quote({isin: "ISIN2", partValue: 2.2}),
        new Quote({isin: "ISIN3", partValue: 2.3})
      ]}),
      new Stock({time: today, quotes: [
        new Quote({isin: "ISIN1", partValue: 3.1}),
        new Quote({isin: "ISIN2", partValue: 3.2}),
        new Quote({isin: "ISIN3", partValue: 3.3})
      ]})
    ]);

    expect(stockData.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN1", partValue: 1.1}),
        new Quote({isin: "ISIN2", partValue: 1.2}),
        new Quote({isin: "ISIN3", partValue: 1.3})
      ]));

    expect(stockData.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN1", partValue: 2.1}),
        new Quote({isin: "ISIN2", partValue: 2.2}),
        new Quote({isin: "ISIN3", partValue: 2.3})
      ]));

    expect(stockData.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN1", partValue: 3.1}),
        new Quote({isin: "ISIN2", partValue: 3.2}),
        new Quote({isin: "ISIN3", partValue: 3.3})
      ]));
  });

  it('Can add more data', () =>{
    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 1.1}),
        new Quote({isin: "ISIN2", partValue: 1.2})
      ]}),
      new Stock({time: yesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 2.1}),
        new Quote({isin: "ISIN2", partValue: 2.2})
      ]})
    ]);

    stockData.merge(
      new StockData([
        new Stock({time: beforeYesterday, quotes: [
          new Quote({isin: "ISIN3", partValue: 1.3})
        ]}),
        new Stock({time: yesterday, quotes: [
          new Quote({isin: "ISIN3", partValue: 2.3})
        ]}),
        new Stock({time: today, quotes: [
          new Quote({isin: "ISIN3", partValue: 3.3})
        ]})])
    );

    expect(stockData.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN1", partValue: 1.1}),
        new Quote({isin: "ISIN2", partValue: 1.2}),
        new Quote({isin: "ISIN3", partValue: 1.3})
      ]));

    expect(stockData.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN1", partValue: 2.1}),
        new Quote({isin: "ISIN2", partValue: 2.2}),
        new Quote({isin: "ISIN3", partValue: 2.3})
      ]));

    expect(stockData.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN3", partValue: 3.3})
      ]));
  });

  it('Can add more data (2)', () =>{
    let stockData: StockData = new StockData([
      new Stock({time: threeDaysAgo, quotes: [
        new Quote({isin: "ISIN1", partValue: 3.1}),
        new Quote({isin: "ISIN2", partValue: 3.2})
      ]}),
      new Stock({time: yesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 1.1}),
        new Quote({isin: "ISIN2", partValue: 1.2})
      ]})
    ]);

    stockData.merge(
      new StockData([
        new Stock({time: beforeYesterday, quotes: [
          new Quote({isin: "ISIN3", partValue: 2.3})
        ]}),
        new Stock({time: today, quotes: [
          new Quote({isin: "ISIN3", partValue: 0.3})
        ]})])
    );

    expect(stockData.get(threeDaysAgo2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN1", partValue: 3.1}),
        new Quote({isin: "ISIN2", partValue: 3.2})
      ]));

    expect(stockData.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN3", partValue: 2.3})
      ]));

    expect(stockData.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN1", partValue: 1.1}),
        new Quote({isin: "ISIN2", partValue: 1.2})
      ]));

    expect(stockData.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN3", partValue: 0.3})
      ]));
  });

  it('Can replace existing data', () => {

    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 1.1}),
        new Quote({isin: "ISIN2", partValue: 1.2})
      ]}),
      new Stock({time: yesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 2.1}),
        new Quote({isin: "ISIN2", partValue: 2.2})
      ]})
    ]);

    stockData.merge(
      new StockData([
        new Stock({time: beforeYesterday, quotes: [
          new Quote({isin: "ISIN2", partValue: 4.4})
        ]}),
        new Stock({time: yesterday, quotes: [
          new Quote({isin: "ISIN2", partValue: 4.5})
        ]}),
        new Stock({time: today, quotes: [
          new Quote({isin: "ISIN2", partValue: 4.6})
        ]})
      ])
    );

    expect(stockData.get(beforeYesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN1", partValue: 1.1}),
        new Quote({isin: "ISIN2", partValue: 4.4})
      ]));

    expect(stockData.get(yesterday2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN1", partValue: 2.1}),
        new Quote({isin: "ISIN2", partValue: 4.5})
      ]));

    expect(stockData.get(today2).quotes)
      .toEqual(jasmine.arrayWithExactContents([
        new Quote({isin: "ISIN2", partValue: 4.6})
      ]));
  });

  it('Can enrich with dividends', () => {
    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 200}),
        new Quote({isin: "ISIN2", partValue: 200}),
      ]}),
      new Stock({time: yesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 100}),
        new Quote({isin: "ISIN2", partValue: 100}),
      ]}),
      new Stock({time: today, quotes: [
        new Quote({isin: "ISIN1", partValue: 300}),
        new Quote({isin: "ISIN2", partValue: 300}),
      ]})
    ]);

    stockData.enrichWithDividends([
      new Dividend({time: beforeYesterday, isin : "ISIN1", dividend: 2.5}),
      new Dividend({time: today, isin : "ISIN1", dividend: 1.5}),
    ]);

    expect(stockData.get(beforeYesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(stockData.get(today).quote("ISIN1").dividend).toBe(1.5);
  });

  it('Can enrich with dividends even when dates mismatch', () => {
    let stockData: StockData = new StockData([
      new Stock({time: yesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 100}),
        new Quote({isin: "ISIN2", partValue: 100}),
      ]}),
      new Stock({time: today, quotes: [
        new Quote({isin: "ISIN1", partValue: 300}),
        new Quote({isin: "ISIN2", partValue: 300}),
      ]})
    ]);

    stockData.enrichWithDividends([
      new Dividend({time: beforeYesterday, isin : "ISIN1", dividend: 2.5}),
      new Dividend({time: today, isin : "ISIN1", dividend: 1.5}),
    ]);

    expect(stockData.get(yesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(stockData.get(today).quote("ISIN1").dividend).toBe(1.5);
  });

  it('Can enrich with dividends even when dates mismatch (2)', () => {
    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 100}),
        new Quote({isin: "ISIN2", partValue: 100}),
      ]}),
      new Stock({time: today, quotes: [
        new Quote({isin: "ISIN1", partValue: 300}),
        new Quote({isin: "ISIN2", partValue: 300}),
      ]})
    ]);

    stockData.enrichWithDividends([
      new Dividend({time: yesterday, isin : "ISIN1", dividend: 2.5}),
      new Dividend({time: today, isin : "ISIN1", dividend: 1.5}),
    ]);

    expect(stockData.get(beforeYesterday).quote("ISIN1").dividend).toBe(2.5);
    expect(stockData.get(today).quote("ISIN1").dividend).toBe(1.5);
  });

  it('Can iterate over all dates', () => {
    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 1.1}),
        new Quote({isin: "ISIN2", partValue: 1.2}),
      ]}),
      new Stock({time: yesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 2.1}),
        new Quote({isin: "ISIN2", partValue: 2.2}),
      ]}),
      new Stock({time: today, quotes: [
        new Quote({isin: "ISIN1", partValue: 3.1}),
        new Quote({isin: "ISIN2", partValue: 3.2}),
      ]})
    ]);

    let numberOfCalls: number = 0;
    let time: Date = beforeYesterday;
    stockData.forEachDate((stock: Stock) => {
      numberOfCalls++;
      expect(stock.quotes.length).toBe(2);
      expect(stock.time.valueOf()).toBeGreaterThanOrEqual(time.valueOf());
      time = stock.time;
    });
    expect(numberOfCalls).toBe(3);
  });

  it('Can iterate over a range of dates', () => {
    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 1.1}),
        new Quote({isin: "ISIN2", partValue: 1.2}),
      ]}),
      new Stock({time: yesterday, quotes: [
        new Quote({isin: "ISIN1", partValue: 2.1}),
        new Quote({isin: "ISIN2", partValue: 2.2}),
      ]}),
      new Stock({time: today, quotes: [
        new Quote({isin: "ISIN1", partValue: 3.1}),
        new Quote({isin: "ISIN2", partValue: 3.2}),
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
