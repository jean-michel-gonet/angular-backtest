import { Stock } from './stock';

/**
 * Base class for an asset.
 */
export class Asset {
  isin: string;
  name?: string;
  partValue?: number;

  constructor(obj: Asset = {} as Asset) {
    let {
      isin = "",
      name = "",
      partValue = 0
    } = obj;

    this.isin = isin;
    this.name = name;
    this.partValue = partValue;
  }
}

/**
 * An asset as described by a stock provider.
 * Contains the required information
 * to buy or sell it.
 */
export class AssetOfInterest extends Asset {
  spread?: number;
  dividend?: number;

  constructor(obj: AssetOfInterest = {} as AssetOfInterest) {
    super(obj);
    let {
      spread = 0,
      dividend = 0
    } = obj;

    this.spread = spread;
    this.dividend = dividend;
  }
}

class IPosition extends Asset {
  parts?: number;

  constructor(obj: IPosition = {} as IPosition) {
    super(obj);
    let {
      parts = 0
    } = obj;
    this.parts = parts;
  }
}

/**
 * An asset as described when held in a portfolio.
 * Contains the required information to calculate
 * the NAV.
 */
export class Position extends IPosition {
  constructor(obj: IPosition = {} as IPosition) {
    super(obj);
  }

  /**
   * Returns the net asset value based on the part value and
   * the number of parts.
   */
  nav():number {
    return this.partValue * this.parts;
  }

  /**
   * Updates the part value of this position based on the
   * provided asset.
   * @param {Asset} asset The update.
   */
  update(asset: Asset): void {
      this.partValue = asset.partValue;
  }
}
