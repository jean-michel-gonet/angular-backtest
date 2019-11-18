import { AssetOfInterest } from './asset';
import { Stock } from './stock';
import { Trader } from './trader';

/**
 * A portfolio is an amount of cash, plus a list
 * of assets.
 * @class Portfolio
 */
export class Portfolio {
  cash: number;
  assetsOfInterest: AssetOfInterest[];

  /**
   * Receives a stock update, and a trader against
   * which it can perform trading operations.
   * @param {Stock} stock The current stock.
   * @param {Trader} trader To execute trading orders.
   */
  process(stock: Stock, trader:Trader) {

  }

  /**
   * Calculates the net asset value of the Portfolio
   * based on the last processed stock.
   * @return {number} The net asset value.
   */
  nav(): number {
    return 0;
  };
}
