/**
 * General interface for classes that calculate moving averages.
 * @class {MovingAverage}
 */
export interface MovingAverage {
  movingAverageOf(value: number): number;
}
