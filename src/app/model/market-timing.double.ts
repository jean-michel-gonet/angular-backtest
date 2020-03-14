import { MarketTiming, BearBull } from './core/market-timing';
import { Quote } from './core/quotes';
import { Report } from './core/reporting';

interface IDoubleMarketTiming {
  bull: MarketTiming;
  bear: MarketTiming;
  status?: BearBull;
}

/**
 * A Market Timing that wraps two market indicators into one.
 * The idea is using one indicator to detect BULL market and
 * another to detect BEAR market.
 * <em>It’s however always important to remember that an indicator showing
 * good entries rarely shows good exits.</em>
 * See https://www.iexplain.org/calculate-macd/
 */
export class DoubleMarketTiming implements MarketTiming {
  private bull: MarketTiming;
  private bear: MarketTiming;
  private status: BearBull;
  private bullStatus: BearBull;
  private bearStatus: BearBull;

  constructor(obj: IDoubleMarketTiming = {} as IDoubleMarketTiming) {
    let {
      bull,
      bear,
      status = BearBull.BULL
    } = obj;
    this.bear = bear;
    this.bull = bull;
    this.status = status;
  }

  /**
   * Sends the instant and quote data to both market timings.
   * @param {Date} instant The current instant.
   * @param {Quote} quote The releveant quote at specified instant.
   */
  record(instant: Date, quote: Quote): void {
    this.bear.record(instant, quote);
    this.bull.record(instant, quote);
  }

  /**
   * When in BULL looks at the bear indicator, when in
   * BEAR, looks at the bull indicator.
   * @return {BearBull} The market status.
   */
  bearBull(): BearBull {
    let newBullStatus = this.bull.bearBull();
    let newBearStatus = this.bear.bearBull();
    let bullSwitchesToBull = this.bullStatus == BearBull.BEAR && newBullStatus == BearBull.BULL;
    let bearSwitchesToBull = this.bearStatus == BearBull.BEAR && newBearStatus == BearBull.BULL;
    let bullSwitchesToBear = this.bullStatus == BearBull.BULL && newBullStatus == BearBull.BEAR;
    let bearSwitchesToBear = this.bearStatus == BearBull.BULL && newBearStatus == BearBull.BEAR;
    this.bullStatus = newBullStatus;
    this.bearStatus = newBearStatus;

    switch(this.status) {
      case BearBull.BEAR:
        if (bullSwitchesToBull || (bearSwitchesToBull && newBullStatus == BearBull.BULL)) {
          this.status = BearBull.BULL;
        }
        break;
      case BearBull.BULL:
      if (bearSwitchesToBear || (bullSwitchesToBear && newBearStatus == BearBull.BEAR)) {
          this.status = BearBull.BEAR;
        }
        break;
    }
    return this.status;
  }

  magnitude(): number {
    return 0;
  }

  doRegister(report: Report): void {
    this.bear.doRegister(report);
    this.bull.doRegister(report);
  }

  startReportingCycle(instant: Date): void {
    // Do nothing.
  }
  reportTo(report: Report): void {
    // Do nothing.
  }

}
