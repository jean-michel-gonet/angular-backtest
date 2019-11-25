import {Asset, Position} from './asset';
import { Stock } from './stock';
import { Strategy } from './strategy';

/**
 * The account holds the cash and a list of asset positions.
 * It also handles the buy and sell operations.
 * @class Account
 */
export abstract class Account {
  cash: number;
  positions: Position[];
  strategy: Strategy;

  constructor(obj = {} as Account) {
    let {
      cash = 0,
      positions = Position[0]
    } = obj;
    this.cash = cash;
    this.positions = positions;
  }

  /**
   * Computes the net asset value of this portfolio, including
   * cash and assets positions.
   * @return The net asset value.
   */
  nav(): number {
    let nav = this.cash;
    this.positions.forEach(position => {
      nav += position.partValue * position.parts;
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
   * Buys the specified asset, updating the concerned position
   * and the cash.
   * Extend this method to reflect specific behavior of each
   * trending partner.
   * @param {Asset} asset The asset to buy.
   * @param {number} parts The number of parts to buy.
   **/
  abstract buy(asset: Asset, parts: number): void;

  /**
   * Sells the specified asset, updating the concerned position
   * and the cash.
   * Extend this method to reflect specific behavior of each
   * trending partner.
   * @param {Asset} asset The asset to sell.
   * @param {number} parts The number of parts to sell.
   **/
  abstract sell(asset: Asset, parts: number): void;

}
