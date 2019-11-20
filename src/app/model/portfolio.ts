import {AssetInPortfolio, AssetOfInterest} from './asset';
import { Stock } from './stock';
import { Trader } from './trader';


/**
 * A portfolio is an amount of cash, plus a list
 * of assets, and implements an investment strategy by extending the abstract methods.
 * @class Portfolio
 */
export abstract class Portfolio {

  cash?: number;
  assetsInPortfolio?: AssetInPortfolio[];

  protected constructor(obj: Portfolio = {} as Portfolio) {
    let {
      cash = 0,
      assetsInPortfolio = []
    } = obj;
    this.cash = cash;
    this.assetsInPortfolio = assetsInPortfolio;
  }

  /**
   * Receives a stock update, and a trader against
   * which it can perform trading operations.
   * @param {Stock} stock The current stock.
   * @param {Trader} trader To execute trading orders.
   */
  abstract process(stock: Stock, trader:Trader): void;

  /**
   * Calculates the net asset value of the Portfolio
   * based on the last processed stock.
   * @return {number} The net asset value.
   */
  nav(): number {
    let nav = this.cash;
    this.assetsInPortfolio.forEach(assetsInPortfolio => {
      nav += assetsInPortfolio.partValue * assetsInPortfolio.parts;
    });
    return nav;
  };
}
