import { AssetOfInterest } from './asset';

export class IStock {
  time?: Date;
  assetsOfInterest?: AssetOfInterest[];

  constructor(obj : IStock = {} as IStock) {
    let {
      time = new Date(),
      assetsOfInterest = []
    } = obj;
    this.time = time;
    this.assetsOfInterest = assetsOfInterest;
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

export class StockData {
  stock: Map<number, Stock>;

  constructor(newStocks:IStock[]) {
    this.stock = new Map<number, Stock>();
    newStocks.forEach(newStock => {
      this.stock.set(newStock.time.valueOf(), new Stock(newStock));
    });
  }

  /**
   * Merge this stock data with another.
   * This stock data gets modified.
   * @param {StockData} otherStockData The other data.
   */
  merge(otherStockData: StockData):void {
    otherStockData.stock.forEach(otherStock => {
      this.add(otherStock);
    });
  }

  /**
   * Adds one stock to this stock data.
   * @param {IStock} otherStock The stock.
   */
  add(...otherStock: IStock[]):void  {
    otherStock.forEach((other: IStock) => {
      let existingStock:Stock = this.stock.get(other.time.valueOf());
      if (existingStock) {
        existingStock.add(other.assetsOfInterest);
      } else {
        this.stock.set(other.time.valueOf(), new Stock(other));
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

    iStock.sort((s1: IStock, s2: IStock) => {
      return s1.time.valueOf() - s2.time.valueOf();
    });

    return iStock;
  }

  /**
   * Returns the stock at the specified date.
   * @param {Date} time The relevant date.
   */
  get(time: Date): Stock {
    return this.stock.get(time.valueOf());
  }

  forEachDate(callbackfn:(stock:Stock)=>void, start?:Date, end?: Date):void {
    let stockTimes: Date[] = [];

    for (let stock of this.stock.values()) {
      let time: Date = stock.time;
      if (start && time.valueOf() < start.valueOf()) {
        continue;
      }
      if (end && end.valueOf() < time.valueOf()) {
        continue;
      }
      stockTimes.push(stock.time);
    }

    stockTimes.sort((d1: Date, d2: Date) => {
      return d1.valueOf() - d2.valueOf();
    });

    stockTimes.forEach(time => {
      callbackfn(this.get(time));
    });
  }
}
