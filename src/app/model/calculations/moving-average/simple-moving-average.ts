import { MovingAverage } from './moving-average';

/**
 * Online implementation of the Simple Moving Average of provided
 * values.
 * Online algorithms can process its input piece-by-piece in a serial fashion,
 * in the order that the input is fed to the algorithm, without having the entire
 * input available from the start (https://en.wikipedia.org/wiki/Online_algorithm).
 */
export class SimpleMovingAverage implements MovingAverage {
  private values: number[];

  /**
   * Class constructor.
   * @param {number} numberOfPeriods The number of periods over which calculating
   * the moving average.
   */
  constructor(public numberOfPeriods: number) {
    this.values = [];
  }

  movingAverageOf(value: number): number {
    this.values.push(value);

    while (this.values.length > this.numberOfPeriods) {
      this.values.shift();
    }

    let sum: number = 0;
    this.values.forEach(v => {
      sum += v;
    });

    sum /= this.values.length;

    return sum;
  }
}
