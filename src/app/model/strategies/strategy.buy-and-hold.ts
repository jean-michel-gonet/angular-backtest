import { Strategy } from '../core/strategy';
import { InstantQuotes } from '../core/quotes';
import { Account } from '../core/account';
import { Quote, Position } from '../core/asset';
import { RegularTransfer } from '../core/transfer';
import { Report } from '../core/reporting';
import { MarketTiming, DefaultMarketTiming, BearBull } from '../core/market-timing';

class IBuyAndHoldStrategy {
  assetName: string;
  assetNameDuringBear?: string;
  transfer?: RegularTransfer;
  marketTiming?: MarketTiming;
  reinvestDivindends?: boolean;
}

/**
 * Implements the buy and hold strategy with specified ISIN over the
 * the whole simulation.
 * @class {BuyAndHoldStrategy}
 */
export class BuyAndHoldStrategy implements Strategy {
  assetName: string;
  assetNameDuringBear: string;
  transfer: RegularTransfer;
  marketTiming: MarketTiming;
  reinvestDivindends: boolean;
  receivedDividends: number;

  constructor(obj = {} as IBuyAndHoldStrategy) {
    let {
      assetName,
      assetNameDuringBear,
      transfer = new RegularTransfer(),
      marketTiming = new DefaultMarketTiming(),
      reinvestDivindends = false
    } = obj;
    this.assetName = assetName;
    this.assetNameDuringBear = assetNameDuringBear;
    this.transfer = transfer;
    this.marketTiming = marketTiming;
    this.reinvestDivindends = reinvestDivindends;
    this.receivedDividends = 0;
  }

  receiveDividends(dividends: number) {
    this.receivedDividends += dividends;
  }

  /**
   * Applies the Buy And Hold strategy when market timing is good,
   * and sells everything when market is bad.
   */
  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    let quote: Quote = instantQuotes.quote(this.assetName);
    let quoteDuringBear: Quote = instantQuotes.quote(this.assetNameDuringBear);

    this.marketTiming.record(instantQuotes.instant, quote);

    switch(this.marketTiming.bearBull()) {
        case BearBull.BEAR:
          this.sellEverything(account, quote);
          this.investAllYourCashInOneSingleBasket(account, quoteDuringBear);
          this.payRegularTransfers(account, instantQuotes.instant, quoteDuringBear);
          break;
        case BearBull.BULL:
          this.sellEverything(account, quoteDuringBear);
          this.investAllYourCashInOneSingleBasket(account, quote);
          this.payRegularTransfers(account, instantQuotes.instant, quote);
          break;
    }
  }

  private payRegularTransfers(account: Account, instant: Date, quote: Quote): void {
    let dueAmount:number = this.transfer.amount(instant);
    if (dueAmount > 0) {
      let missingCash = dueAmount - account.cash;
      if (missingCash > 0 && quote) {
        let partsToSell = missingCash / quote.partValue;
        account.order(quote, -partsToSell);
      }
      account.transfer(this.transfer.to, dueAmount);
    }
  }

  private investAllYourCashInOneSingleBasket(account: Account, quote:Quote):void {
    if (quote) {
      let numberOfParts: number = Math.floor(account.cash / quote.partValue);
      account.order(quote, numberOfParts);
    }
  }

  private sellEverything(account: Account, quote: Quote) {
    if (quote) {
      let position: Position = account.position(quote.name);
      if (position && position.parts > 0) {
        account.order(quote, -position.parts);
      }
    }
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
    if (this.marketTiming) {
      this.marketTiming.doRegister(report);
    }
  }

  startReportingCycle(instant: Date): void {
    // Don't care.
  }

  reportTo(report: Report): void {
    // Nothing to report.
  }
}
