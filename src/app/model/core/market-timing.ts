import { InstantQuotes } from './quotes';
import { Reporter, Report } from './reporting';

/**
 * Expresses the market feeling as detected by a Market Timing implementation.
 * @enum {BearBull}
 */
export enum BearBull {
  BULL = 'BULL',
  BEAR = 'BEAR'
}

/**
 * Market timing is a type of investment or trading strategy. It is the act of
 * moving in and out of a financial market or switching between asset classes
 * based on predictive methods. These predictive tools include following
 * technical indicators or economic data, to gauge how the market is going
 * to move.
 * See https://www.investopedia.com/terms/m/markettiming.asp
 * @class {MarketTiming}
 */
export interface MarketTiming extends Reporter {
  /**
   * Identity of the market timing.
   * @return {string} The identity of the market timing. Any unique string.
   */
  id: string;

  /**
   * Receives regular quote updates, and decides if time is good to invest.
   * @param {Date} instant The current instant.
   * @param {Candlestick} candlestick The relevant quote at specified instant.
   */
  record(instantQuotes: InstantQuotes): void;

  /**
   * Indicates if market is bearish (better sell everything) or bullish
   * (let's invest and make serious money).
   * @return {BearBull} The market status.
   */
  bearBull(): BearBull;
}

/**
 * A default market timing, handy
 * for default values and for extending only part of the interface.
 * @class{DefaultMarketTiming}
 */
export class DefaultMarketTiming implements MarketTiming {
  id: string = "DEF";

  /**
   * Does nothing with the instant quotes.
   */
   record(instantQuotes: InstantQuotes): void {
    // Do nothing.
  }

  /**
   * Always eager to invest.
   */
  bearBull(): BearBull {
    return BearBull.BULL;
  }

  doRegister(report: Report): void {
    // Do nothing.
  }
  startReportingCycle(instant: Date): void {
    // Do nothing.
  }
  reportTo(report: Report): void {
    // Do nothing.
  }

}
