import { SlidingRecord, SlidingBase, ISlidingBase } from './sliding-base-class';

class PerformanceRecord extends SlidingRecord {
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
    } else {
      this.variation = y - this.initialValue;
      this.days = (instant.valueOf() - this.initialDate.valueOf()) / (24 * 60 * 60 * 1000);
    }
  }
}

export class SlidingPerformance extends SlidingBase {
  constructor(obj = {} as ISlidingBase) {
    super(obj);
  }

  makeNewRecord(endDate: Date): SlidingRecord {
    return new PerformanceRecord(endDate);
  }
}
