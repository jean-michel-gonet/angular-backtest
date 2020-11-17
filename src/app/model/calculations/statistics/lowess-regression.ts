import { abs, diag, floor, index, inv, matrix, Matrix, median, multiply, subtract, transpose } from 'mathjs';
import { DayToYearConversion } from '../../utils/day-to-year-conversion';

/**
 * Calculates the LOWESS regression over a set of provided samples.
 * @class{LowessRegression}
 */
export class LowessRegression {
  private dayToYearConversion: DayToYearConversion = new DayToYearConversion();
  private n: number = 0;
  private X: Matrix = matrix();
  private Y: Matrix = matrix();

  /**
   * Accepts a new sample.
   * The x values can be either numbers or a dates. If specifying dates,
   * then the regression X axis will be in years.
   * @param {number | Date} x The x value.
   * @param {number} y The y value.
   */
  public sample(x: number | Date, y: number): void {
    let value: number = this.dayToYearConversion.convert(x);

    this.X.subset(index(this.n, [0, 1]), [1, value]);
    this.Y.subset(index(this.n), y);

    this.n++;
  }

  /**
   * Executes the lowess regr ession over the central sample.
   * @return {x: number, y: number} The central sample, recalculated
   * according to lowess regression.
   */
  public regression(): {x: number, y: number} {
    let indexOfMiddleSample = this.indexOfMiddleSample();
    let xOfMiddleSample = this.X.get([indexOfMiddleSample, 1]);
    let maximumDistance: number = this.maximumDistance(xOfMiddleSample);
    let W = this.buildXWeights(xOfMiddleSample, maximumDistance);
    let B: Matrix;

    for (var pass = 0; pass < 2; pass++) {
      if (B) {
        let G = this.buildYWeights(B);
        W = multiply(W, G);
      }
      let WX = multiply(W, this.X);
      let WY = multiply(W, this.Y);
      let XT = transpose(this.X);

      let XTWX = multiply(XT, WX);
      let XTWXI = inv(XTWX);

      let XTWY = multiply(XT, WY);
      B = multiply(XTWXI, XTWY);
    }

    let nY: Matrix = multiply(this.X, B);
    let x: number = xOfMiddleSample;
    let y: number = nY.get([indexOfMiddleSample]);
    let xy = {
      x: x, y: y
    }
    return xy;
  }

  private buildYWeights(B: Matrix): Matrix {
    let nY: Matrix = multiply(this.X, B) as Matrix;
    let dY: Matrix = subtract(this.Y, nY) as Matrix;
    let dY2: Matrix = dY.map(value => {
      return abs(value);
    })
    let m6 = 6 * median(dY2);
    let g = dY2.map( value => {
      if (m6) {
        let g1 = value / m6;
        let g2 = Math.pow(g1, 2);
        if (g2 >= 1) {
          return 0;
        } else {
          let g3 = 1 - g2;
          let g4 = Math.pow(g3, 2);
          return g4;
        }
      } else {
        return 1;
      }
    });
    return diag(g);
  }

  private buildXWeights(xOfMiddleSample: number, maximumDistance: number): Matrix {
    let weights: number[] = [];
    for(var n = 0; n < this.n; n++) {
      let x = this.X.get([n, 1]);
      let distance = Math.abs(xOfMiddleSample - x);
      weights[n] = this.w(maximumDistance, distance);
    }
    return diag(weights);
  }

  private w(maximumDistance: number, distance: number) {
    let d1 = Math.pow(distance / maximumDistance, 3);
    let d2 = 1 - d1;
    let w = Math.pow(d2, 3);
    return w;
  }

  private maximumDistance(xOfMiddleSample: number): number {
    let maximumDistance = 0;
    for(var n = 0; n < this.n; n++) {
      let d = abs(this.X.get([n, 1]) - xOfMiddleSample);
      if (d > maximumDistance) {
        maximumDistance = d;
      }
    }
    return maximumDistance;
  }

  private indexOfMiddleSample(): number {
    // TODO: This assumes that samples are provided in order.
    return floor(this.n / 2);
  }
}
