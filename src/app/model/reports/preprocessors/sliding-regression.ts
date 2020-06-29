import { OnlineLinearRegression } from '../../calculations/linear-regression';
import { SlidingRecord, SlidingBase, ISlidingBase } from './sliding-base-class';

class RegressionRecord extends SlidingRecord {
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

export class SlidingRegression extends SlidingBase {

  constructor(obj = {} as ISlidingBase) {
    super(obj);
  }

  makeNewRecord(endDate: Date): SlidingRecord {
    return new RegressionRecord(endDate);
  }
}
