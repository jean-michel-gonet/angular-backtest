import { LowessRegression } from '../../calculations/statistics/lowess-regression';
import { Record, BasePreprocessor, IBasePreprocessor } from './base-preprocessor';

class LowessRecord extends Record {
  private lowessRegression: LowessRegression;

  constructor(public endDate: Date) {
    super(endDate);
    this.lowessRegression = new LowessRegression();
  }

  compute(instant: Date, y: number): void {
    this.lowessRegression.sample(instant, y);
  }

  getValue(): number {
    let y = this.lowessRegression.regression().y;
    return y;
  }
}

/**
 * Applies a local regression to smooth the provided signal.
 * @class{LowessPreprocessor}
 */
export class LowessPreprocessor extends BasePreprocessor {

  constructor(obj = {} as IBasePreprocessor) {
    super(obj);
  }

  makeNewRecord(endDate: Date): LowessRecord {
    return new LowessRecord(endDate);
  }
}
