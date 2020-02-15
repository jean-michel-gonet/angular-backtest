import { Strategy } from './core/strategy';
import { InstantQuotes } from './core/quotes';
import { Account } from './core/account';
import { Quote, Position } from './core/asset';
import { RegularTransfer } from './core/transfer';
import { Report } from './core/reporting';
import { MarketTiming, DefaultMarketTiming, BearBull } from './core/market-timing';

class IBuyAndHoldStrategy {
  name?: string;
  transfer?: RegularTransfer;
  reinvestDividends?: boolean;
  marketTiming?: MarketTiming;
  status?: BearBull;
}

/**
 * Implements the buy and hold strategy with specified ISIN over the
 * the whole simulation.
 * @class {BuyAndHoldStrategy}
 */
export class BuyAndHoldStrategyWithTiming implements Strategy {
  name: string;
  transfer: RegularTransfer;
  reinvestDividends: boolean;
  marketTiming: MarketTiming;
  status: BearBull;

  constructor(obj = {} as IBuyAndHoldStrategy) {
    let {
      name = "",
      transfer = new RegularTransfer(),
      reinvestDividends = false,
      marketTiming = new DefaultMarketTiming(),
      status = BearBull.BEAR
    } = obj;
    this.name = name;
    this.transfer = transfer;
    this.reinvestDividends = reinvestDividends;
    this.marketTiming = marketTiming;
    this.status = status;
  }

  /**
   * Applies the Buy And Hold strategy when market timing is good,
   * and sells everything when market is bad.
   */
  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    let quote: Quote = instantQuotes.quote(this.name);
    if (quote) {
      this.marketTiming.record(instantQuotes.instant, quote);
      let newStatus = this.marketTiming.bearBull();
      switch(this.status) {
          case BearBull.BEAR:
            if (newStatus == BearBull.BULL) {
              console.info(this.name + ": " + instantQuotes.instant + " - BULL - Let's invest!");
              this.investAllYourCashInOneSingleBasket(account, quote);
            }
            break;
          case BearBull.BULL:
          if (newStatus == BearBull.BEAR) {
              console.info(this.name + ": " + instantQuotes.instant + " - BEAR - Let's sell everything!");
              this.sellEverything(account, quote);
            }
      }
      this.status = newStatus;
    }
  }

  private investAllYourCashInOneSingleBasket(account: Account, quote:Quote):void {
    let numberOfParts: number = Math.floor(account.cash / quote.partValue);
    account.order(quote, numberOfParts);
  }

  private sellEverything(account: Account, quote: Quote) {
    let position: Position = account.position(this.name);
    if (position && position.parts > 0) {
      account.order(quote, -position.parts);
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
