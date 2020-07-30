/**
 * Online implementation of the Exponential Moving Average of provided
 * values.
 */
export class OnlineEma {

  private lastValue: number;

  /**
   * Class constructor.
   * @param {number} numberOfPeriods The number of periods over which calculating
   * the moving average.
   */
  constructor(public numberOfPeriods: number) {}

  /**
   * Calculates the EMA based on this number and all numbers previously
   * provided.
   * @param {number} value The value to calculate the EMA.
   * @return {number} The current EMA, based on this and all previous values.
   */
  emaOf(value: number): number {
    let ema: number;
    if (this.lastValue) {
      let k: number = 2 / (this.numberOfPeriods + 1);
      ema = value * k + this.lastValue * (1 - k);
    } else {
      ema = value;
    }
    this.lastValue = ema;
    return ema;
  }

  /**
   * Force the last EMA value.
   * A method useful for unit testing, for example.
   * @param {number} value The forced last ema value.
   */
  public setLastValue(value: number): void {
    this.lastValue = value;
  }
}
