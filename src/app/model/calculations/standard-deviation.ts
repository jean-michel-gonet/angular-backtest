import { OnlineAverage } from './average';

/**
 * Calculates the standard deviation over the provided population.
 * As in a simulation we do have the complete population, it uses the
 * (N) divisor (as opposed of Bessel's correction).
 * An implementation of the Welford's online algorithm.
 * see https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance
 * @class {OnlineStandardDeviation}
 */
export class OnlineStandardDeviation {
  private onlineAverage: OnlineAverage = new OnlineAverage();
  private previousAverage: number;
  private n: number = 0;
  private m2: number;

  /**
   * Calculates the standard deviation.
   * @param{number} sample One sample.
   * @return{number} The standard deviation of samples provided so far.
   */
  std(sample: number):number {
      let currentAverage: number = this.onlineAverage.average(sample);
      if (this.n == 0) {
        this.m2 = 0;
      } else {
        let a: number = (sample - this.previousAverage);
        let b: number = (sample - currentAverage);
        let c: number = a * b;
        this.m2 = this.m2 +  c;
      }
      this.n++;
      this.previousAverage = currentAverage;
      return Math.sqrt(this.m2 / this.n);
  }
}
