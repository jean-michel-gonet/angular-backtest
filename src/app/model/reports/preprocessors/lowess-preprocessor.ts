import { LocalRegression } from '../../calculations/statistics/local-regression';
import { Record, BasePreprocessor, IBasePreprocessor } from './base-preprocessor';

class LowessRecord extends Record {
  private lowessRegression: LocalRegression;
  private sampleNumber: number;

  constructor(public endDate: Date) {
    super(endDate);
    this.lowessRegression = new LocalRegression();
    this.sampleNumber = 0;
  }

  compute(instant: Date, y: number): void {
    this.lowessRegression.sample(this.sampleNumber, y);
    this.sampleNumber++;
  }

  getValue(): number {
    return this.lowessRegression.regression();
  }
}

/**
 * Applies local regression to smooth the provided signal.
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
