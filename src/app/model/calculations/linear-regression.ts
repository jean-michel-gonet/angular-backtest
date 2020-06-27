/**
 * Calculates the linear regression for a series of x / y points
 * where x is an instant and y is a number.
 * Linear regression consists in approximating a cloud of (X, Y) samples
 * using a line such as:
 * <pre>
 * y = A * x +  B
 * </pre>
 * Algorithm is taken from:
 * https://stats.stackexchange.com/questions/23481/are-there-algorithms-for-computing-running-linear-or-logistic-regression-param
 * @class{OnlineLinearRegression}
 */
export class OnlineLinearRegression {
  private meanX: number = 0;
  private meanY: number = 0;
  private x0: number;
  private varX: number = 0;
  private covXY: number = 0;
  private n: number = 0;

  private a: number;
  private b: number;

  /**
   * Calculates the linear regression for all samples provided so far.
   * @param{Date} instant The sample's instant, considered as x value.
   * @param{number} y The sample's y value.
   * @return{number} The A parameter, based on the samples provided so far.
   */
  regression(instant: Date, y: number): number {
    let days = instant.valueOf() / 86400000;
    if (this.n == 0) {
      this.x0 = days;
    }
    let x: number = days - this.x0;

    this.n++;

    let dx = x - this.meanX;
    let dy = y - this.meanY;

    this.varX += (((this.n - 1) / this.n) * dx * dx - this.varX) / this.n
    this.covXY += (((this.n - 1) / this.n) * dx * dy - this.covXY) / this.n

    this.meanX += dx / this.n;
    this.meanY += dy / this.n;

    this.a = this.covXY / this.varX;
    this.b = this.meanY - this.a * this.meanX;

    return this.a;
  }

  getA(): number {
    return this.a;
  }

  getB(): number {
    return this.b;
  }

}
