import { MovingAverage } from './moving-average';

/**
 * In a cumulative moving average (CMA), the data arrive in an ordered datum stream,
 * and the user would like to get the average of all of the data up until the current datum point.
 * From Wikipedia: https://en.wikipedia.org/wiki/Moving_average#Cumulative_moving_average
 * @class{OnlineAverage}
 */
export class CumulativeMovingAverage implements MovingAverage {
  private avg: number;
  private n: number = 1;

  /**
   * Calculates the average.
   * @param{number} sample.
   * @return{number} The current average of all samples provided so far.
   */
   movingAverageOf(value: number): number {
     if (this.n == 1) {
       this.avg = value;
     } else {
       this.avg = this.avg + (value - this.avg) / this.n;
     }
     this.n++;
     return this.avg;
   }
}
