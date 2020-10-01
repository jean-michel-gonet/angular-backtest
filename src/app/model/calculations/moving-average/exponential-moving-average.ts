import { OnlineMovingAverage } from './online-moving-average';

/**
 * Online implementation of the Exponential Moving Average of provided
 * values.
 * Online algorithms can process its input piece-by-piece in a serial fashion,
 * in the order that the input is fed to the algorithm, without having the entire
 * input available from the start (https://en.wikipedia.org/wiki/Online_algorithm).
 */
export class ExponentialMovingAverage extends OnlineMovingAverage {
  private k: number;
  /**
   * Class constructor.
   * @param {number} numberOfPeriods The number of periods over which calculating
   * the moving average.
   */
  constructor(public numberOfPeriods: number) {
    super(numberOfPeriods);
    this.k = 2 / (numberOfPeriods + 1);
  }

  /**
   * Calculates the EMA based on this number and all numbers previously
   * provided.
   * @param {number} value The value to calculate the EMA.
   * @return {number} The current EMA, based on this and all previous values.
   */
  protected calculateAverage(previousAverage: number, value: number): number {
    return value * this.k + previousAverage * (1 - this.k);
  }
}
