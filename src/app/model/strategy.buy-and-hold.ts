import { Strategy } from './core/strategy';
import { Stock } from './core/stock';
import { Account } from './core/account';

/**
 * Implements the buy and hold strategy with specified ISIN over the
 * the whole simulation.
 * @class {BuyAndHoldStrategy}
 */
export class BuyAndHoldStrategy extends Strategy {

  constructor(private isin: string) {
    super();
  }

  applyStrategy(account: Account, stock: Stock): void {
    throw new Error("Method not implemented.");
  }
}
