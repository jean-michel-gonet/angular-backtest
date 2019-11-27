import {Position, AssetOfInterest} from './asset';
import { Stock } from './stock';
import { Strategy } from './strategy';

class IAccount {
  cash?: number;
  positions?: Position[];
  strategy?: Strategy;

  constructor(obj = {} as IAccount) {
    let {
      cash = 0,
      positions = [],
      strategy = null
    } = obj;
    this.cash = cash;
    this.positions = positions;
    this.strategy = strategy;
  }
}

/**
 * The account holds the cash and a list of asset positions.
 * It also handles the buy and sell operations.
 * @class Account
 */
export class Account extends IAccount {
  constructor(obj = {} as IAccount) {
    super(obj);
  }

  /**
   * Returns the position designated by the provided ISIN.
   * @param {string} isin The required isin.
   * @return {Position} The corresponding position, or null.
   */
  position(isin: string): Position {
    return this.positions.find(position => {
      position.isin == isin;
    });
  }

  /**
   * Computes the net asset value of this portfolio, including
   * cash and assets positions.
   * @return The net asset value.
   */
  nav(): number {
    let nav = this.cash;
    this.positions.forEach(position => {
      nav += position.nav();
    });
    return nav;
  }

  /**
   * Receives the stock updates and propagates them to the positions
   * and to the strategy.
   * @param{Stock} stock The stock update.
   */
  process(stock: Stock): void {
    // Update the positions:
    this.positions.forEach(position => {
      position.update(stock);
    });

    // Call the strategy:
    this.strategy.applyStrategy(this, stock);
  }

  /**
   * Calculates the absolute cost of buying or selling the specified number
   * of parts of the specified asset. The cost is the difference between the
   * exchanged amount of cash and the variation of net asset value.
   * The basic behavior is to consider only the cost of the spread.
   * Extend this method to reflect specific behavior of each
   * trending partner.
   * @param {AssetOfInterest} asset The asset to buy.
   * @param {number} parts When positive, the number of parts to buy. When
   *                       negative, the number of parts to sell.
   * @return {number} The cost, always positive.
   **/
  costs(asset: AssetOfInterest, parts: number): number {
    return Math.abs(parts * asset.partValue * asset.spread / 2);
  }

  /**
   * Sells or buys the specified asset, updating the concerned position
   * and the cash.
   * @param {AssetOfInterest} asset The asset to buy.
   * @param {number} parts When positive, the number of parts to buy. When
   *                       negative, the number of parts to sell.
   **/
  order(asset: AssetOfInterest, parts: number): void {

    // Looks for the corresponding position:
    let position: Position;
    this.positions.forEach(p => {
      if (p.isin == asset.isin) {
        position = p;
      }
    });
    if (!position) {
      position = new Position(asset);
      this.positions.push(position);
    }

    // If possible, corrects the position accordingly:
    if (position.parts + parts < 0) {
      parts =  -position.parts;
    }
    position.parts += parts;

    // Removes from cash the part value and the costs.
    this.cash = this.cash -
                parts * asset.partValue -
                this.costs(asset, parts);
  }
}
