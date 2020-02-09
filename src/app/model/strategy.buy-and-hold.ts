import { Strategy } from './core/strategy';
import { Stock } from './core/stock';
import { Account } from './core/account';
import { Quote } from './core/asset';
import { RegularTransfer } from './core/transfer';
import { Report } from './core/reporting';

class IBuyAndHoldStrategy {
  name?: string;
  transfer?: RegularTransfer;
}

/**
 * Implements the buy and hold strategy with specified ISIN over the
 * the whole simulation.
 * @class {BuyAndHoldStrategy}
 */
export class BuyAndHoldStrategy implements Strategy {
  name: string;
  transfer: RegularTransfer;

  constructor(obj = {} as IBuyAndHoldStrategy) {
    let {
      name = "",
      transfer = new RegularTransfer(),
    } = obj;
    this.name = name;
    this.transfer = transfer;
  }

  /**
   * Applies the Buy And Hold strategy.
   */
  applyStrategy(account: Account, stock: Stock): void {
    let quote: Quote = stock.quote(this.name);
    if (quote) {
      this.investAllYourCashInOneSingleBasket(account, quote);

      let amountToTransfer = this.transfer.amount(stock.time);
      if (amountToTransfer > 0) {
        this.performTransfer(account, quote, amountToTransfer);
      }
    }
  }

  /**
   * Initial order consists in investing the whole
   * capital into one single ISIN.
   */
  private investAllYourCashInOneSingleBasket(account: Account, quote: Quote): void {
    if (account.cash > 0) {
      let numberOfParts: number = account.cash / quote.partValue;
      account.order(quote, numberOfParts);
    }
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

  startReportingCycle(time: Date): void {
    // Don't care.
  }

  reportTo(report: Report): void {
    // Nothing to report.
  }
}
