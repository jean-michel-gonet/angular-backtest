const MILLISECONDS_IN_A_YEAR: number = 1000 * 24 * 60 * 60 * 365;

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
 * Online algorithms can process its input piece-by-piece in a serial fashion,
 * in the order that the input is fed to the algorithm, without having the entire
 * input available from the start (https://en.wikipedia.org/wiki/Online_algorithm).
 * @class{LinearRegression}
 */
export class LinearRegression {
  private year0: Date;
  private meanX: number = 0;
  private meanY: number = 0;
  private varX: number = 0;
  private varY: number = 0;
  private covXY: number = 0;
  private n: number = 0;

  /**
   * Calculates the linear regression for all samples provided so far.
   * @param{Date} x The sample's x value.
   * @param{number} y The sample's y value.
   */
  regression(instant: number | Date, y: number): void {
    this.n++;

    let x: number = this.obtainX(instant);

    let dx = x - this.meanX;
    let dy = y - this.meanY;

    this.varX += (((this.n - 1) / this.n) * dx * dx - this.varX) / this.n
    this.varY += (((this.n - 1) / this.n) * dy * dy - this.varY) / this.n
    this.covXY += (((this.n - 1) / this.n) * dx * dy - this.covXY) / this.n

    this.meanX += dx / this.n;
    this.meanY += dy / this.n;
  }

  private obtainX(instant: number | Date): number {
    let x: number;
    if (instant instanceof Date) {
      if (this.year0 == undefined) {
        this.year0 = instant;
      }
      x = instant.valueOf() - this.year0.valueOf();
      x /= MILLISECONDS_IN_A_YEAR;
    } else {
      x = instant;
    }
    return x;
  }

  getA(): number {
    return this.covXY / this.varX;
  }

  getB(): number {
    return this.meanY - this.getA() * this.meanX;
  }

  getR(): number {
    return this.covXY / (Math.sqrt(this.varX) * Math.sqrt(this.varY));
  }

  getR2(): number {
    return this.getR() ** 2;
  }
}
