/**
 * Online implementation of the Simple Moving Average of provided
 * values.
 * Online algorithms can process its input piece-by-piece in a serial fashion,
 * in the order that the input is fed to the algorithm, without having the entire
 * input available from the start (https://en.wikipedia.org/wiki/Online_algorithm).
 */
export class OnlineSma {
  private count: number;
  private lastValue: number;

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
  smaOf(value: number): number {
    let sma: number;

    // While waiting for the required number of periods, calculates the
    // simple average (not moving) of available samples:
    if (this.count++ < this.numberOfPeriods) {
      if (this.lastValue) {
        sma = this.lastValue + (value - this.lastValue) / this.count;
      } else {
        sma = value;
      }
    }

    // After the required number of periods, calculates the simple
    // moving average:
    else {
      sma = (this.lastValue * (this.numberOfPeriods - 1) + value) / this.numberOfPeriods;
    }


    this.lastValue = sma;
    return sma;
  }

  /**
   * Force the last SMA value.
   * A method useful for unit testing, for example.
   * @param {number} value The forced last ema value.
   */
  public setLastValue(value: number): void {
    this.lastValue = value;
  }
}
