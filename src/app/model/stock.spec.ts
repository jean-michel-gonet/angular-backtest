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

  it('Can return the stock of the required day', () => {
    let today: Date = new Date();
    let yesterday: Date = new Date(today.valueOf() - 1);
    let beforeYesterday: Date = new Date(yesterday.valueOf() - 1);

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

    expect(stockData.get(beforeYesterday).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 1.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 1.3})
      ]));

    expect(stockData.get(yesterday).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 2.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 2.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 2.3})
      ]));

    expect(stockData.get(today).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 3.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 3.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 3.3})
      ]));
  });
  it('Can add more data', () =>{
    let today: Date = new Date();
    let yesterday: Date = new Date(today.valueOf() - 1);
    let beforeYesterday: Date = new Date(yesterday.valueOf() - 1);

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

    stockData.add([
      new Stock({time: beforeYesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN3", partValue: 1.3})
      ]}),
      new Stock({time: yesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN3", partValue: 2.3})
      ]}),
      new Stock({time: today, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN3", partValue: 3.3})
      ]})
    ]);

    expect(stockData.get(beforeYesterday).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 1.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 1.3})
      ]));

    expect(stockData.get(yesterday).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 2.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 2.2}),
        new AssetOfInterest({isin: "ISIN3", partValue: 2.3})
      ]));

    expect(stockData.get(today).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN3", partValue: 3.3})
      ]));
  });
  it('Can replace existing data', () => {
    let today: Date = new Date();
    let yesterday: Date = new Date(today.valueOf() - 1);
    let beforeYesterday: Date = new Date(yesterday.valueOf() - 1);

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

    stockData.add([
      new Stock({time: beforeYesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN2", partValue: 4.4})
      ]}),
      new Stock({time: yesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN2", partValue: 4.5})
      ]}),
      new Stock({time: today, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN2", partValue: 4.6})
      ]})
    ]);

    expect(stockData.get(beforeYesterday).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 1.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 4.4})
      ]));

    expect(stockData.get(yesterday).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN1", partValue: 2.1}),
        new AssetOfInterest({isin: "ISIN2", partValue: 4.5})
      ]));

    expect(stockData.get(today).assetsOfInterest)
      .toEqual(jasmine.arrayWithExactContents([
        new AssetOfInterest({isin: "ISIN2", partValue: 4.6})
      ]));

  });
});
