import { Stock } from './stock';
import { Account } from './account';

/**
 * Extend this class to implement a trading strategy.
 * @class Strategy.
 */
export abstract class Strategy {
  /**
   * Receives regular stock updates, and executes trading operations
   * against an existing account.
   */
  abstract applyStrategy(account: Account, stock: Stock): void;
}
