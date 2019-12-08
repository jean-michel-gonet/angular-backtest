import { AssetOfInterest } from './asset';

class IStock {
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
  stock: Map<Date, Stock>;

  constructor(newStocks:Stock[]) {
    this.stock = new Map<Date, Stock>();
    newStocks.forEach(newStock => {
      this.stock.set(newStock.time, newStock);
    });
  }

  add(newStocks: Stock[]):void {
    newStocks.forEach(newStock => {
      let existingStock:Stock = this.stock.get(newStock.time);
      if (existingStock) {
        existingStock.add(newStock.assetsOfInterest);
      } else {
        this.stock.set(newStock.time, newStock);
      }
    });
  }

  get(time: Date): Stock {
    return this.stock.get(time);
  }
}
