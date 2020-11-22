import { DayToYearConversion } from '../../utils/day-to-year-conversion';
import { LinearRegression } from './linear-regression';

/**
 * Estimates the value at current date by using linear regression over all
 * provided samples.
 * @class{LocalRegression}
 */
export class LocalRegression {
  private linearRegression: LinearRegression = new LinearRegression();
  private dayToYearConversion: DayToYearConversion = new DayToYearConversion();
  private x: number;

  /**
   * Accepts a new sample.
   * The x values can be either numbers or a dates. If specifying dates,
   * then the regression X axis will be in years.
   * @param {number | Date} instant The x value.
   * @param {number} y The y value.
   */
  public sample(instant: number | Date, y: number): void {
    this.x = this.dayToYearConversion.convert(instant);
    this.linearRegression.regression(this.x, y);
  }

  /**
   * Reestimates the last provided sample applying a local linear regression over
   * all provided samples (including the last one).
   * @return {number} The estimation of the last sample.
   */
  public regression(): number {
    let a = this.linearRegression.getA();
    let b = this.linearRegression.getB();
    let y: number = a * this.x + b;
    return y;
  }

}
