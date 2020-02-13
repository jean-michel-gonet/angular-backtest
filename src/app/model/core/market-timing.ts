import { InstantQuotes } from './quotes';

/**
 * Market timing is a type of investment or trading strategy. It is the act of
 * moving in and out of a financial market or switching between asset classes
 * based on predictive methods. These predictive tools include following
 * technical indicators or economic data, to gauge how the market is going
 * to move.
 * See https://www.investopedia.com/terms/m/markettiming.asp
 * @class {MarketTiming}
 */
export interface MarketTiming {
  /**
   * Receives regular quote updates, and decides if time is good to invest.
   * @param {InstantQuotes} instantQuotes The quote updates, to take useful decisions.
   * @return {number} A positive number if it is a good time to invest.
   */
  timeIsGood(instantQuotes: InstantQuotes): number;
}

/**
 * A null timing that is always eager to do investments, handy
 * for default values and for extending only part of the interface.
 * @class{NullTiming}
 */
export class EverGoodMarketTiming implements MarketTiming {
  /**
   * Always a good time.
   * @return {number} always 1.
   */
  timeIsGood(instantQuotes: InstantQuotes): number {
    return 1;
  }

}
