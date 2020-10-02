import { Candlestick } from '../../core/quotes';

/**
 * Interface for a technical indicator.
 * @class{Indicator}
 */
export interface Indicator {
  /**
   * Calculates the value of the indicator.
   * @param {Date} instant The date.
   * @param {Candlestick} The current candlestick.
   * @return {number} The value of the indicator.
   */
  calculate(instant: Date, candlestick: Candlestick): number;
}
