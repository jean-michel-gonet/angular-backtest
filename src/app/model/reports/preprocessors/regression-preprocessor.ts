import { OnlineLinearRegression } from '../../calculations/linear-regression';
import { Record, BasePreprocessor, IBasePreprocessor } from './base-preprocessor';

const MILLISECONDS_IN_A_YEAR: number = 1000 * 24 * 60 * 60 * 365;

class RegressionRecord extends Record {
  private onlineLinearRegression: OnlineLinearRegression;
  private year0: number;
  private x: number;

  constructor(public endDate: Date) {
    super(endDate);
    this.onlineLinearRegression = new OnlineLinearRegression();
  }

  compute(instant: Date, y: number): void {
    let year: number = instant.valueOf() / MILLISECONDS_IN_A_YEAR;
    if (!this.year0) {
      this.year0 = year;
    }
    this.x = year - this.year0;
    this.onlineLinearRegression.regression(this.x, y);
  }

  getValue(): number {
    let a: number = this.onlineLinearRegression.getA();
    let b: number = this.onlineLinearRegression.getB();

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
