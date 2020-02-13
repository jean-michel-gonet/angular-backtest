import { Strategy } from './core/strategy';
import { InstantQuotes } from './core/quotes';
import { Account } from './core/account';
import { Quote, Position } from './core/asset';
import { RegularTransfer } from './core/transfer';
import { Report } from './core/reporting';
import { MarketTiming, EverGoodMarketTiming } from './core/market-timing';

class IBuyAndHoldStrategy {
  name?: string;
  transfer?: RegularTransfer;
  reinvestDividends?: boolean;
  marketTiming?: MarketTiming;
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

  constructor(obj = {} as IBuyAndHoldStrategy) {
    let {
      name = "",
      transfer = new RegularTransfer(),
      reinvestDividends = false,
      marketTiming = new EverGoodMarketTiming()
    } = obj;
    this.name = name;
    this.transfer = transfer;
    this.reinvestDividends = reinvestDividends;
    this.marketTiming = marketTiming;
  }

  /**
   * Applies the Buy And Hold strategy when market timing is good,
   * and sells everything when market is bad.
   */
  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    let quote: Quote = instantQuotes.quote(this.name);
    if (quote) {
      if (this.marketTiming.timeIsGood(instantQuotes) > 0) {
        this.investAllYourCashInOneSingleBasket(account, quote);
      } else {
        this.sellEverything(account, quote);
      }
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
  }

  startReportingCycle(instant: Date): void {
    // Don't care.
  }

  reportTo(report: Report): void {
    // Nothing to report.
  }
}
