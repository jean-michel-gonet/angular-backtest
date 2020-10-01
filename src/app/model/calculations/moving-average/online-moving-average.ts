import { MovingAverage } from './moving-average';

/**
 * Base class for all online moving averages.
 * Online algorithms can process its input piece-by-piece in a serial fashion,
 * in the order that the input is fed to the algorithm, without having the entire
 * input available from the start (https://en.wikipedia.org/wiki/Online_algorithm).
 */
export abstract class OnlineMovingAverage implements MovingAverage {
  private count: number;
  private previousAverage: number;

  /**
   * Class constructor.
   * @param {number} numberOfPeriods The number of periods over which calculating
   * the moving average.
   */
  constructor(public numberOfPeriods: number) {
    this.count = 0;
  }

  /**
   * Calculates the SMA based on this number and all numbers previously
   * provided.
   * @param {number} value The value to calculate the SMA.
   * @return {number} The current SMA, based on this and all previous values.
   */
  movingAverageOf(value: number): number {
    let movingAverage: number;

    // While waiting for the required number of periods, calculates the
    // simple average (not moving) of available samples:
    if (this.count++ < this.numberOfPeriods) {
      if (this.previousAverage) {
        movingAverage = this.previousAverage + (value - this.previousAverage) / this.count;
      } else {
        movingAverage = value;
      }
    }

    // After the required number of periods,
    // actually calculates the moving average:
    else {
      movingAverage = this.calculateAverage(this.previousAverage, value);
    }

    // Returns the average:
    this.previousAverage = movingAverage;
    return movingAverage;
  }

  /**
   * Implement this method to actually calculate the moving average.
   * @param previousAverage {number} The last calculated value (returned in
   * previous call).
   * @param value {number} Incoming value.
   */
  protected abstract calculateAverage(previousAverage: number, value: number): number;

  /**
   * Force the last average value.
   * A method useful for unit testing, for example.
   * @param previousAverage {number} The forced last average value.
   */
  public setPreviousAverage(previousAverage: number): void {
    this.previousAverage = previousAverage;
    this.count = this.numberOfPeriods;
  }
}
