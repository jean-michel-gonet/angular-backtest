/**
 * Base class for an asset.
 */
export class Asset {
  isin: string;
  name: string;
  partValue: number;
}

/**
 * An asset as described by a stock provider.
 * Contains the required informations
 * do by or sell it.
 */
export class AssetOfInterest extends Asset {
  spread: number;
  dividend: number;
}

/**
 * An asset as described when held in a portfolio.
 * Contains the required informations to calculate
 * the NAV.
 */
export class AssetInPortfolio extends Asset {
  parts: number;
}
