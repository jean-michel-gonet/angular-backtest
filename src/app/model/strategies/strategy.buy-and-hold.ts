import { Strategy } from '../core/strategy';
import { InstantQuotes, Quote } from '../core/quotes';
import { Account, Position } from '../core/account';
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
  public assetName: string;
  public assetNameDuringBear: string;
  public transfer: RegularTransfer;
  public marketTiming: MarketTiming;
  public reinvestDivindends: boolean;
  public receivedDividends: number;
  public dueAmount: number;

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
    this.dueAmount = 0;
  }

  receiveDividends(dividends: number) {
    this.receivedDividends += dividends;
  }

  /**
   * Quotes of interest are the asset name, the asset name during bear, and
   * the quotes of interest for market timing.
   */
  listQuotesOfInterest(): string[] {
    let quotestOfInterest: string[] = [];
    quotestOfInterest.push(this.assetName);
    if (this.assetNameDuringBear) {
      quotestOfInterest.push(this.assetNameDuringBear);
    }
    if (this.marketTiming) {
      quotestOfInterest = quotestOfInterest.concat(this.marketTiming.listQuotesOfInterest());
    }
    return quotestOfInterest;
  }

  /**
   * Applies the Buy And Hold strategy when market timing is good,
   * and sells everything when market is bad.
   */
  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    let quote: Quote = instantQuotes.quote(this.assetName);
    let quoteDuringBear: Quote = instantQuotes.quote(this.assetNameDuringBear);

    this.marketTiming.record(instantQuotes);

    switch(this.marketTiming.bearBull()) {
        case BearBull.BEAR:
          this.sellEverything(account, quote);
          this.payRegularTransfers(account, instantQuotes.instant, quoteDuringBear);
          this.investAllYourCashInOneSingleBasket(account, quoteDuringBear);
          break;
        case BearBull.BULL:
          this.sellEverything(account, quoteDuringBear);
          this.payRegularTransfers(account, instantQuotes.instant, quote);
          this.investAllYourCashInOneSingleBasket(account, quote);
          break;
    }
  }

  private payRegularTransfers(account: Account, instant: Date, quote: Quote): void {
    this.dueAmount += this.transfer.amount(instant);
    if (this.dueAmount > 0) {
      let missingCash = this.dueAmount - account.cash;
      if (missingCash > 0 && quote) {
        let partsToSell = Math.ceil(missingCash / quote.close);
        account.order(quote.name, -partsToSell);
      } else {
        account.transfer(this.transfer.to, this.dueAmount);
        this.dueAmount = 0;
      }
    }
  }

  private investAllYourCashInOneSingleBasket(account: Account, quote:Quote):void {
    if (quote) {
      let numberOfParts: number = Math.floor(account.cash / quote.close);
      account.order(quote.name, numberOfParts);
    }
  }

  private sellEverything(account: Account, quote: Quote) {
    if (quote) {
      let position: Position = account.position(quote.name);
      if (position && position.parts > 0) {
        account.order(quote.name, -position.parts);
      }
    }
  }

  // ********************************************************************
  // **                        Report interface.                       **
  // ********************************************************************
  /**
   * This strategy has nothing to report, but maybe some of the dependencies
   * have?
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
