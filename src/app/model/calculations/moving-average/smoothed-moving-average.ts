import { OnlineMovingAverage } from './online-moving-average';

/**
 * A modified moving average (MMA), running moving average (RMA), or
 * smoothed moving average (SMMA) is an exponential moving average,
 * with α = 1 / numberOfPeriods.
 * <a href="https://en.wikipedia.org/wiki/Moving_average#Modified_moving_average">More info</a>
 * Online algorithms can process its input piece-by-piece in a serial fashion,
 * in the order that the input is fed to the algorithm, without having the entire
 * input available from the start (https://en.wikipedia.org/wiki/Online_algorithm).
 */
export class SmoothedMovingAverage extends OnlineMovingAverage {
  private k: number;
  /**
   * Class constructor.
   * @param {number} numberOfPeriods The number of periods over which calculating
   * the moving average.
   */
  constructor(public numberOfPeriods: number) {
    super(numberOfPeriods);
    this.k = 1 / this.numberOfPeriods;
  }

  /**
   * Calculates the SMMA based on this number and all numbers previously
   * provided.
   * @param {number} value The value to calculate the EMA.
   * @return {number} The current EMA, based on this and all previous values.
   */
   protected calculateAverage(previousAverage: number, value: number): number {
     return value * this.k + previousAverage * (1 - this.k);
   }
}
