import { Quote } from './quotes';
import { Reporter, Report } from './reporting';

/**
 * Expresses the market feeling as detected by a Market Timing implementation.
 * @enum {BearBull}
 */
export enum BearBull {
  BULL = 1,
  BEAR = -1
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
   * Receives regular quote updates, and decides if time is good to invest.
   * @param {Date} instant The current instant.
   * @param {Quote} quote The releveant quote at specified instant.
   */
  record(instant: Date, quote: Quote): void;

  /**
   * Indicates if market is bearish (better sell everything) or bullish
   * (let's invest and make serious money).
   * @return {BearBull} The market status.
   */
  bearBull(): BearBull;

  /**
   * Indicates how bullish or bearish is the market with a numerical magnitude.
   * As each market timing will use it differently, this magnitude is
   * not a standard value. It is more an internal indicator for debugging
   * purposes.
   * @return {number} A numerical assessment of the market trend.
   */
  magnitude(): number;
}

/**
 * A default market timing, handy
 * for default values and for extending only part of the interface.
 * @class{DefaultMarketTiming}
 */
export class DefaultMarketTiming implements MarketTiming {
  /**
   * Does nothing with the instant quotes.
   */
   record(instant: Date, quote: Quote): void {
    // Do nothing.
  }

  /**
   * Always eager to invest.
   */
  bearBull(): BearBull {
    return BearBull.BULL;
  }

  /**
   * Clueless about market bullishness magnitude.
   */
  magnitude(): number {
    return 0;
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
