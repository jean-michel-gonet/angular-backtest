import { LinearRegression } from '../../calculations/statistics/linear-regression';
import { Record, BasePreprocessor, IBasePreprocessor } from './base-preprocessor';

const MILLISECONDS_IN_A_YEAR: number = 1000 * 24 * 60 * 60 * 365;

class RegressionRecord extends Record {
  private linearRegression: LinearRegression;
  private year0: number;
  private x: number;

  constructor(public endDate: Date) {
    super(endDate);
    this.linearRegression = new LinearRegression();
  }

  compute(instant: Date, y: number): void {
    let year: number = instant.valueOf() / MILLISECONDS_IN_A_YEAR;
    if (!this.year0) {
      this.year0 = year;
    }
    this.x = year - this.year0;
    this.linearRegression.regression(this.x, y);
  }

  getValue(): number {
    let a: number = this.linearRegression.getA();
    let b: number = this.linearRegression.getB();

    return 100 * (a / b);
  }
}

export class RegressionPreprocessor extends BasePreprocessor {

  constructor(obj = {} as IBasePreprocessor) {
    super(obj);
  }

  makeNewRecord(endDate: Date): RegressionRecord {
    return new RegressionRecord(endDate);
  }
}
