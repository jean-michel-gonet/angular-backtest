import { Strategy } from './core/strategy';
import { InstantQuotes } from './core/quotes';
import { Account } from './core/account';
import { Quote } from './core/asset';
import { RegularTransfer } from './core/transfer';
import { Report } from './core/reporting';

class IBuyAndHoldStrategy {
  name?: string;
  transfer?: RegularTransfer;
  reinvestDividends?: boolean;
}

/**
 * Implements the buy and hold strategy with specified ISIN over the
 * the whole simulation.
 * @class {BuyAndHoldStrategy}
 */
export class BuyAndHoldStrategy implements Strategy {
  name: string;
  transfer: RegularTransfer;
  reinvestDividends: boolean;

  constructor(obj = {} as IBuyAndHoldStrategy) {
    let {
      name = "",
      transfer = new RegularTransfer(),
      reinvestDividends = false
    } = obj;
    this.name = name;
    this.transfer = transfer;
    this.reinvestDividends = reinvestDividends;
  }

  /**
   * Applies the Buy And Hold strategy.
   */
  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    let quote: Quote = instantQuotes.quote(this.name);
    if (quote) {

      if (!account.position(this.name)) {
        this.investAllYourCashInOneSingleBasket(account, quote);
      }

      if (this.reinvestDividends && account.cash > quote.partValue) {
        this.investAllYourCashInOneSingleBasket(account, quote);
      }

      let amountToTransfer = this.transfer.amount(instantQuotes.instant);
      if (amountToTransfer > 0) {
        this.performTransfer(account, quote, amountToTransfer);
      }
    }
  }

  private investAllYourCashInOneSingleBasket(account: Account, quote:Quote):void {
    let numberOfParts: number = Math.floor(account.cash / quote.partValue);
    account.order(quote, numberOfParts);
  }

  /**
   * Periodically withdraw the cash amount required for
   * living.
   */
  private performTransfer(account: Account, quote: Quote, amountToTransfer: number): void {
    let numberOfParts: number = amountToTransfer / quote.partValue;
    account.order(quote, -numberOfParts);
    account.transfer(this.transfer.to, amountToTransfer);
  }

  // ********************************************************************
  // **                  DataProvider interface.                       **
  // ********************************************************************

  /**
   * Turns the transfer account in as a data provider.
   * @param {Report} report The data processor.
   */
  doRegister(report: Report): void {
    if (this.transfer.to) {
      this.transfer.to.doRegister(report);
    }
  }

  startReportingCycle(instant: Date): void {
    // Don't care.
  }

  reportTo(report: Report): void {
    // Nothing to report.
  }
}
