import { AssetOfInterest } from './asset';

export class Stock {
  time?: Date;
  assetsOfInterest?: AssetOfInterest[];

  constructor(obj : Stock = {} as Stock) {
    let {
      time = new Date(),
      assetsOfInterest = []
    } = obj;
    this.time = time;
    this.assetsOfInterest = assetsOfInterest;
  }
}
