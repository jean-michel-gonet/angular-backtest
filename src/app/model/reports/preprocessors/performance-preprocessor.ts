import { Record, BasePreprocessor, IBasePreprocessor } from './base-preprocessor';

export class PerformanceRecord extends Record {
  private initialDate: Date;
  private initialValue: number;
  private variation: number;
  private days: number;

  constructor(public endDate: Date) {
    super(endDate);
  }

  getValue(): number {
    let performance: number = 100 * this.variation / this.initialValue;
    let annualPerformance: number = performance * 365 / this.days;
    return annualPerformance;
  }

  compute(instant: Date, y: number): void {
    if (!this.initialValue) {
      this.initialValue = y;
      this.initialDate = new Date(instant);
      this.variation = 0;
      this.days = 0;
    } else {
      this.variation = y - this.initialValue;
      this.days = (instant.valueOf() - this.initialDate.valueOf()) / (24 * 60 * 60 * 1000);
    }
  }
}

export class PerformancePreprocessor extends BasePreprocessor {
  constructor(obj = {} as IBasePreprocessor) {
    super(obj);
  }

  makeNewRecord(endDate: Date): PerformanceRecord {
    return new PerformanceRecord(endDate);
  }
}
