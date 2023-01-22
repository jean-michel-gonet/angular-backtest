import { LinearRegression } from './linear-regression';

/**
 * Calculates the average annual compound interest based on an exponential
 * regression for a series of x / y points
 * where x is an instant and y is a number.
 * Exponential regression consists in approximating a cloud of (X, Y) samples
 * using a line such as:
 * <pre>
 * y = P*E^(r*t)
 * </pre>
 * General idea is taken from:
 * https://www.math.unl.edu/~tlai3/M119-Section16.pdf
 * Original understanding comes from:
 * https://www.raynergobran.com/2017/07/hacking-compound-annual-growth-rate/
 * What's the differences between using E or 10 ? You achieve the same results,
 * however E is more appropriate when you got daily compound interest. Also,
 * when using E, calculated A is directly the CAGR.
 * @class{ExponentialRegression}
 */
export class ExponentialRegression extends LinearRegression {

  /**
   * Calculates the linear regression for all samples provided so far.
   * @param{number | Date} x The sample's x instant, or a number of years.
   * @param{number} y The sample's y value.
   */
  regression(x: number | Date, y: number): void {
    super.regression(x, Math.log(y));
  }

  /**
   * Returns the initial capital.
   * @return {number} The initial capital.
   */
  getP(): number {
    return Math.E ** this.getB();
  }

  /**
   * Returns the compound annual growth rate, a.k.a the annual interest rate.
   * @return {number} The annual interest.
   */
  getCAGR(): number {
    return this.getA();
  }
}
