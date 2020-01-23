import { Stock, StockData } from './stock';
import { AssetOfInterest } from './asset';

describe('Stock', () => {
  it('Can create an instance', () => {
    expect(new Stock({
      time: new Date(),
      assetsOfInterest: [
        new AssetOfInterest(),
        new AssetOfInterest()
      ]})).toBeTruthy();
  });

  it('Can obtain one asset of interest', () => {
    let stock: Stock = new Stock({
      time: new Date(),
      assetsOfInterest: [
          new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
          new AssetOfInterest({isin: "ISIN2", partValue: 1.2}),
          new AssetOfInterest({isin: "ISIN3", partValue: 1.3})
    ]});
    let assetOfInterest: AssetOfInterest = stock.assetOfInterest("ISIN1");
    expect(assetOfInterest).toEqual(new AssetOfInterest({
      isin: "ISIN1",
      partValue: 1.1
    }));
  });

  it('Can add more assets of interest', () =>{
    let stock: Stock = new Stock({
      time: new Date(),
      assetsOfInterest: [
          new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
          new AssetOfInterest({isin: "ISIN2", partValue: 1.2}),
          new AssetOfInterest({isin: "ISIN3", partValue: 1.3})
    ]});

    stock.add([
      new AssetOfInterest({isin: "ISIN2", partValue: 2.2}),
      new AssetOfInterest({isin: "ISIN3", partValue: 2.3}),
      new AssetOfInterest({isin: "ISIN4", partValue: 2.4})
    ]);

    expect(stock.assetsOfInterest).toEqual(jasmine.arrayWithExactContents([
      new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
      new AssetOfInterest({isin: "ISIN2", partValue: 2.2}),
      new AssetOfInterest({isin: "ISIN3", partValue: 2.3}),
      new AssetOfInterest({isin: "ISIN4", partValue: 2.4})
    ]));

    stock.add([
      new AssetOfInterest({isin: "ISIN1", partValue: 3.1})
    ]);

    expect(stock.assetsOfInterest).toEqual(jasmine.arrayWithExactContents([
      new AssetOfInterest({isin: "ISIN1", partValue: 3.1}),
      new AssetOfInterest({isin: "ISIN2", partValue: 2.2}),
      new AssetOfInterest({isin: "ISIN3", partValue: 2.3}),
      new AssetOfInterest({isin: "ISIN4", partValue: 2.4})
    ]));
  });
});

describe('StockData', () => {
  it('Can create an instance', () => {
    expect(new StockData(
      [
        new Stock(),
        new Stock(),
        new Stock()
      ])).toBeTruthy();
  });
  let now: Date = new Date();
  let today: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let yesterday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  let beforeYesterday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
  let today2: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let yesterday2: Date = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  let beforeYesterday2: Date = new Date(beforeYesterday.getFullYear(), beforeYesterday.getMonth(), beforeYesterday.getDate());

  it('Can return the stock of the required day', () => {

    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 1.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 1.3})
      ]}),
      new Stock({time: yesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 2.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 2.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 2.3})
      ]}),
      new Stock({time: today, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 3.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 3.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 3.3})
      ]})
    ]);

    expect(stockData.get(beforeYesterday2).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 1.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 1.3})
      ]));

    expect(stockData.get(yesterday2).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 2.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 2.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 2.3})
      ]));

    expect(stockData.get(today2).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 3.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 3.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 3.3})
      ]));
  });

  it('Can add more data', () =>{
    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 1.2})
      ]}),
      new Stock({time: yesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 2.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 2.2})
      ]})
    ]);

    stockData.add(
      new Stock({time: beforeYesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN3", partValue: 1.3})
      ]}),
      new Stock({time: yesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN3", partValue: 2.3})
      ]}),
      new Stock({time: today, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN3", partValue: 3.3})
      ]})
    );

    expect(stockData.get(beforeYesterday2).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 1.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 1.3})
      ]));

    expect(stockData.get(yesterday2).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 2.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 2.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 2.3})
      ]));

    expect(stockData.get(today2).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN3", partValue: 3.3})
      ]));
  });

  it('Can replace existing data', () => {

    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 1.2})
      ]}),
      new Stock({time: yesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 2.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 2.2})
      ]})
    ]);

    stockData.add(
      new Stock({time: beforeYesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN2", partValue: 4.4})
      ]}),
      new Stock({time: yesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN2", partValue: 4.5})
      ]}),
      new Stock({time: today, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN2", partValue: 4.6})
      ]})
    );

    expect(stockData.get(beforeYesterday2).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 4.4})
      ]));

    expect(stockData.get(yesterday2).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 2.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 4.5})
      ]));

    expect(stockData.get(today2).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN2", partValue: 4.6})
      ]));
  });

  it('Can iterate over all dates', () => {
    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 1.2}),
      ]}),
      new Stock({time: yesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 2.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 2.2}),
      ]}),
      new Stock({time: today, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 3.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 3.2}),
      ]})
    ]);

    let numberOfCalls: number = 0;
    let time: Date = beforeYesterday;
    stockData.forEachDate((stock: Stock) => {
      numberOfCalls++;
      expect(stock.assetsOfInterest.length).toBe(2);
      expect(stock.time.valueOf()).toBeGreaterThanOrEqual(time.valueOf());
      time = stock.time;
    });
    expect(numberOfCalls).toBe(3);
  });

  it('Can iterate over a range of dates', () => {
    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 1.2}),
      ]}),
      new Stock({time: yesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 2.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 2.2}),
      ]}),
      new Stock({time: today, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN1", partValue: 3.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 3.2}),
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
