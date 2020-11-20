import { LinearRegression } from '../../calculations/statistics/linear-regression';
import { Record, BasePreprocessor, IBasePreprocessor } from './base-preprocessor';

class RegressionRecord extends Record {
  private linearRegression: LinearRegression;

  constructor(public endDate: Date) {
    super(endDate);
    this.linearRegression = new LinearRegression();
  }

  compute(instant: Date, y: number): void {
    this.linearRegression.regression(instant, y);
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
