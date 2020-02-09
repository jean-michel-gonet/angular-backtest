import { Strategy } from './core/strategy';
import { Stock } from './core/stock';
import { Account } from './core/account';
import { AssetOfInterest } from './core/asset';
import { RegularTransfer } from './core/transfer';
import { Report } from './core/reporting';

class IBuyAndHoldStrategy {
  isin?: string;
  transfer?: RegularTransfer;
}

/**
 * Implements the buy and hold strategy with specified ISIN over the
 * the whole simulation.
 * @class {BuyAndHoldStrategy}
 */
export class BuyAndHoldStrategy implements Strategy {
  isin: string;
  transfer: RegularTransfer;

  constructor(obj = {} as IBuyAndHoldStrategy) {
    let {
      isin = "",
      transfer = new RegularTransfer(),
    } = obj;
    this.isin = isin;
    this.transfer = transfer;
  }

  /**
   * Applies the Buy And Hold strategy.
   */
  applyStrategy(account: Account, stock: Stock): void {
    let assetOfInterest: AssetOfInterest = stock.assetOfInterest(this.isin);
    if (assetOfInterest) {
      this.investAllYourCashInOneSingleBasket(account, assetOfInterest);

      let amountToTransfer = this.transfer.amount(stock.time);
      if (amountToTransfer > 0) {
        this.performTransfer(account, assetOfInterest, amountToTransfer);
      }
    }
  }

  /**
   * Initial order consists in investing the whole
   * capital into one single ISIN.
   */
  private investAllYourCashInOneSingleBasket(account: Account, assetOfInterest: AssetOfInterest): void {
    if (account.cash > 0) {
      let numberOfParts: number = account.cash / assetOfInterest.partValue;
      account.order(assetOfInterest, numberOfParts);
    }
  }

  /**
   * Periodically withdraw the cash amount required for
   * living.
   */
  private performTransfer(account: Account, assetOfInterest: AssetOfInterest, amountToTransfer: number): void {
    let numberOfParts: number = amountToTransfer / assetOfInterest.partValue;
    account.order(assetOfInterest, -numberOfParts);
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
