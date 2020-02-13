import { InstantQuotes } from './quotes';
import { Account } from './account';
import { Reporter, Report } from './reporting';

/**
 * Extend this class to implement a trading strategy.
 * @class Strategy.
 */
export interface Strategy extends Reporter {
  /**
   * Receives regular quote updates, and executes trading operations
   * against an existing account.
   * @param {Account} account The account to execute the orders.
   * @param {InstantQuotes} instantQuotes The instantQuotes updates, to take useful decisions.
   */
  applyStrategy(account: Account, instantQuotes: InstantQuotes): void;
}

/**
 * A null strategy that does absolutely nothing, but it is handy
 * for default values and for extending only part of the interface.
 * @class{NullStrategy}
 */
export class NullStrategy implements Strategy {
  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    // Let's do nothing.
  }
  doRegister(report: Report): void {
    // Let's do nothing.
  }
  startReportingCycle(instant: Date): void {
    // Let's do nothing.
  }
  reportTo(report: Report): void {
    // Let's do nothing.
  }
}
