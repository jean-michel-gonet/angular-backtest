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
}

export class StockData {
  stock: Map<number, Stock>;

  constructor(newStocks:IStock[]) {
    this.stock = new Map<number, Stock>();
    newStocks.forEach(newStock => {
      this.stock.set(newStock.time.valueOf(), new Stock(newStock));
    });
  }

  add(newStocks: IStock[]):void {
    newStocks.forEach(newStock => {
      let existingStock:Stock = this.stock.get(newStock.time.valueOf());
      if (existingStock) {
        existingStock.add(newStock.assetsOfInterest);
      } else {
        this.stock.set(newStock.time.valueOf(), new Stock(newStock));
      }
    });
  }

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

  get(time: Date): Stock {
    return this.stock.get(time.valueOf());
  }
}
