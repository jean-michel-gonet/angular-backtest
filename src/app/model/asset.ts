/**
 * Base class for an asset.
 */
export class Asset {
  isin?: string;
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

/**
 * An asset as described when held in a portfolio.
 * Contains the required information to calculate
 * the NAV.
 */
export class AssetInPortfolio extends Asset {
  parts: number;

  constructor(obj: AssetInPortfolio = {} as AssetInPortfolio) {
    super(obj);
    let {
      parts = 0
    } = obj;
    this.parts = parts;
  }
}
