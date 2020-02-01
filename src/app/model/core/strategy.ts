import { Stock } from './stock';
import { Account } from './account';
import { Reporter, Report } from './reporting';

/**
 * Extend this class to implement a trading strategy.
 * @class Strategy.
 */
export interface Strategy extends Reporter {
  /**
   * Receives regular stock updates, and executes trading operations
   * against an existing account.
   * @param {Account} account The account to execute the orders.
   * @param {Stock} stock The stock updates, to take useful decisions.
   */
  applyStrategy(account: Account, stock: Stock): void;
}

/**
 * A null strategy that does absolutely nothing, but it is handy
 * for default values and for extending only part of the interface.
 * @class{NullStrategy}
 */
export class NullStrategy implements Strategy {
  applyStrategy(account: Account, stock: Stock): void {
    // Let's do nothing.
  }
  doRegister(report: Report): void {
    // Let's do nothing.
  }
  startReportingCycle(time: Date): void {
    // Let's do nothing.
  }
  reportTo(report: Report): void {
    // Let's do nothing.
  }
}
