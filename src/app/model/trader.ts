import { Stock } from './stock';
import { Portfolio } from './portfolio';
import { AssetOfInterest } from './asset';

/**
 * Represents the financial institution through which
 * it is possible to receive stock information and also
 * buy and sell assets.
 * Extend this class to implement the specificities of
 * each trader, like the trading costs, minimal amount,
 * availability limitations etc.
 * @class Trader
 */
export class Trader {
  portfolios: Portfolio[];

  process(stock: Stock) {
    this.portfolios.forEach(portfolio => {
      portfolio.process(stock, this);
    });
  }

  buy(asset: AssetOfInterest, parts: number): number {
    return 0;
  }

  sell(asset: AssetOfInterest, parts: number): number {
    return 0;
  }

}
