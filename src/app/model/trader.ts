import { Stock } from './stock';
import { Portfolio } from './portfolio';
import { AssetOfInterest } from './asset';

/**
 * Represents the financial institution through which
 * it is possible to receive stock information and also
 * buy and sell assets.
 * Extend this class to implement the particularities of
 * each trader, like the trading costs, minimal amount,
 * availability limitations etc.
 * @class Trader
 */
export abstract class Trader {
  portfolios: Portfolio[];

  protected constructor(obj: Trader = {} as Trader) {
    let {
      portfolios = []
    } = obj;
    this.portfolios = portfolios;
  }

  /**
   * Propagates the stock update to all portfolios.
   * @param stock The stock update.
   */
  process(stock: Stock) {
    this.portfolios.forEach(portfolio => {
      portfolio.process(stock, this);
    });
  }

  /**
   * Estimates the total cost of buying the specified number of parts of the specified asset.
   * The total cost is the sum of the part value (corrected with the spread) multiplied by the
   * number of parts, plus the operation costs, which differs from trader to trader.
   * @param asset The asset to buy.
   * @param parts The number of parts.
   * @return The total cost of the operation.
   */
  abstract buy(asset: AssetOfInterest, parts: number): number;

  /**
   * Estimates the total cost of selling the specified number of parts of the specified asset.
   * The total cost is the sum of the part value multiplied by the number of parts, plus the
   * operation costs, which differs from trader to trader.
   * @param asset The asset to sell.
   * @param parts The number of parts.
   * @return The total cost of the operation.
   */
  abstract sell(asset: AssetOfInterest, parts: number): number;

}
