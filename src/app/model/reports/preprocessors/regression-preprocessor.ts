import { OnlineLinearRegression } from '../../calculations/linear-regression';
import { Record, BasePreprocessor, IBasePreprocessor } from './base-preprocessor';

class RegressionRecord extends Record {
  private onlineLinearRegression: OnlineLinearRegression;

  constructor(public endDate: Date) {
    super(endDate);
    this.onlineLinearRegression = new OnlineLinearRegression();
  }

  compute(instant: Date, y: number): void {
    this.onlineLinearRegression.regression(instant, y);
  }

  getValue(): number {
    return this.onlineLinearRegression.getA();
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
