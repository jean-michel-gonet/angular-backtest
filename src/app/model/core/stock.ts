import { AssetOfInterest } from './asset';
import { Reporter, Report, ReportedData } from './reporting';

export class IStock {
  time: Date;
  assetsOfInterest?: AssetOfInterest[];

  constructor(obj : IStock) {
    let {
      time,
      assetsOfInterest = []
    } = obj;
    this.time = time;
    this.assetsOfInterest = assetsOfInterest;
  }
}

export class Dividend {
  time: Date;
  isin: string;
  dividend: number;
  constructor(obj : Dividend = {} as Dividend) {
    let {
      time,
      isin,
      dividend
    } = obj;
    this.time = time;
    this.isin = isin;
    this.dividend = dividend;
  }
}

export class Stock extends IStock {
  private mapOfAssets: Map<String, AssetOfInterest>;

  constructor(obj : IStock = {} as IStock) {
    super(obj);
    this.mapOfAssets = new Map<String, AssetOfInterest>();
    this.assetsOfInterest.forEach(assetOfInterest => {
      this.mapOfAssets.set(assetOfInterest.isin, assetOfInterest);
    });
  }

  /**
   * Handy to make expectations, as IStock is a simpler class.
   * @return {IStock} An instance of a simpler class.
   */
  asIStock(): IStock {
    return new IStock({time: this.time, assetsOfInterest: this.assetsOfInterest});
  }

  add(newAssetsOfInterest: AssetOfInterest[]): void {
    newAssetsOfInterest.forEach(newAssetOfInterest => {
      let existingAssetOfInterest = this.mapOfAssets.get(newAssetOfInterest.isin);
      if (existingAssetOfInterest) {
        let i = this.assetsOfInterest.indexOf(existingAssetOfInterest);
        this.assetsOfInterest.splice(i, 1);
        this.mapOfAssets.delete(existingAssetOfInterest.isin);
      }
      this.assetsOfInterest.push(newAssetOfInterest);
      this.mapOfAssets.set(newAssetOfInterest.isin, newAssetOfInterest);
    });
  }

  /**
   * Returns the specified asset of interest.
   * @param {string} isin The ISIN of the asset.
   * @return {AssetOfInterest} The asset of interest,
   * or null.
   */
  assetOfInterest(isin: String): AssetOfInterest {
    return this.assetsOfInterest.find(a => {
      return a.isin == isin;
    });
  }
}

export class StockData implements Reporter {
  private stock: Stock[] = [];

  constructor(newStocks:IStock[]) {
    newStocks.forEach(newStock => {
      this.stock.push(new Stock(newStock));
    });
    this.stock.sort((a: Stock, b:Stock) => {
      return a.time.valueOf() - b.time.valueOf();
    });
  }

  /**
   * Merge this stock data with another.
   * This stock data gets modified.
   * @param {StockData} otherStockData The other data.
   */
  merge(otherStockData: StockData):void {
    let mergedStockData: Stock[] = [];
    let otherIndex: number = 0;
    let thisIndex: number = 0;


    while(otherIndex < otherStockData.stock.length && thisIndex < this.stock.length) {
      let otherEntry = otherStockData.stock[otherIndex];
      let thisEntry = this.stock[thisIndex];
      if (thisEntry.time.valueOf() == otherEntry.time.valueOf()) {
        let mergedEntry: Stock = new Stock(thisEntry);
        mergedEntry.add(otherEntry.assetsOfInterest);
        mergedStockData.push(mergedEntry);
        thisIndex++;
        otherIndex++;
      }

      if (thisEntry.time.valueOf() < otherEntry.time.valueOf()) {
        let mergedEntry: Stock = new Stock(thisEntry);
        mergedStockData.push(mergedEntry);
        thisIndex++;
      }

      if (thisEntry.time.valueOf() > otherEntry.time.valueOf()) {
        let mergedEntry: Stock = new Stock(otherEntry);
        mergedStockData.push(mergedEntry);
        otherIndex++;
      }
    }

    while(otherIndex < otherStockData.stock.length) {
      let otherEntry = otherStockData.stock[otherIndex];
      mergedStockData.push(new Stock(otherEntry));
      otherIndex++;
    }

    while(thisIndex < this.stock.length) {
      let thisEntry = this.stock[thisIndex];
      mergedStockData.push(new Stock(thisEntry));
      thisIndex++;
    }

    this.stock = mergedStockData;
  }

  /**
   * Returns the stock at the specified date or, if date is not found,
   * then stock at the pior date.
   * @param {Date} time The relevant date.
   */
  get(time: Date): Stock {
    let valueOf: number = time.valueOf();
    let index: number = this.stock.findIndex(stock => {
      return stock.time.valueOf() >= valueOf;
    });
    if (index < 0) {
      return null;
    } else {
      let stockAtIndex: Stock = this.stock[index];
      if (stockAtIndex.time.valueOf() == valueOf) {
        return stockAtIndex;
      } else {
        if (index == 0) {
          return null;
        } else {
          return this.stock[index - 1];
        }
      }
    }
  }

  enrichWithDividends(dividends: Dividend[]):void {
    dividends.forEach(dividend => {
      let stock: Stock = this.get(dividend.time);
      if (stock) {
        let assetOfInterest = stock.assetOfInterest(dividend.isin);
        assetOfInterest.dividend = assetOfInterest.partValue * dividend.dividend / 100;
      }
    });
  }

  /**
   * Transform this stock data into an array of simpler
   * data, that can be displayed as JSON.
   * @return {IStock[]} The array of data.
   */
  asIStock():IStock[] {
    let iStock: IStock[] = [];

    this.stock.forEach(stock => {
      iStock.push(new IStock({
        time: stock.time,
        assetsOfInterest: stock.assetsOfInterest
      }));
    });

    return iStock;
  }

  forEachDate(callbackfn:(stock:Stock)=>void, start?:Date, end?: Date):void {
    let firstIndex: number;

    // Look for the index of the start date:
    if (start) {
      firstIndex = this.stock.findIndex(stock => {
        return stock.time.valueOf() >= start.valueOf();
      });
    } else {
      firstIndex = 0;
    }

    // Simulating until specified end date:
    let n: number;
    for(n = firstIndex; n < this.stock.length; n++) {
      let stock: Stock = this.stock[n];
      let time: Date = stock.time;
      if (end && time.valueOf() > end.valueOf()) {
        break;
      }
      this.reportingStock = stock;
      callbackfn(stock);
    }
  }

  // ********************************************************************
  // **                  DataProvider interface.                       **
  // ********************************************************************

  private reportingStock: Stock;

  /**
   * Turns itself in as a data provider to the data processor.
   * @param {Report} report The data processor.
   */
  doRegister(report: Report): void {
    report.register(this);
  }

  /**
   * Next report will be about the closing values of all the assets of interest.
   * @param {Date} time The date to report.
   */
  startReportingCycle(time: Date): void {
    // Let's do nothing.
  }

  /**
   * Reports to a data processor all assets of interest
   * corresponding to the reporting time.
   * @param {Report} report The data processor
   * to report.
   */
  reportTo(report: Report): void {
    this.reportingStock.assetsOfInterest.forEach(assetOfInterest => {
      report.receiveData(new ReportedData({
        y: assetOfInterest.partValue,
        sourceName: assetOfInterest.isin + ".CLOSE"
      }));
    });
  }
}
