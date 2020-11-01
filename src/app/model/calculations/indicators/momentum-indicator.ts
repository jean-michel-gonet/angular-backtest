import { ConfigurableSourceIndicator } from './configurable-source-indicator';
import { IndicatorConfiguration } from './configurable-source';
import { ExponentialRegression } from '../statistics/exponential-regression';
import { Period, Periodicity } from '../../core/period';


class Record {
  private exponential: ExponentialRegression;
  private period: Period;

  constructor(periodicity: Periodicity, private numberOfPeriods: number) {
    this.exponential = new ExponentialRegression();
    this.period = new Period(periodicity);
  }

  public compute(instant: Date, value: number) {
    this.exponential.regression(instant, value);
  }

  public isFinished(instant: Date) {
    return this.period.timeIsUp(instant, this.numberOfPeriods);
  }

  public getCAGR(): number {
    return this.exponential.getCAGR();
  }
  public getR2(): number {
    return this.exponential.getR2();
  }
}

export class MomentumIndicator extends ConfigurableSourceIndicator {
  private records: Record[];
  public cagr: number;
  public r2: number;

  constructor(configuration = {} as IndicatorConfiguration) {
    super(configuration);
    this.records = [];
  }

  compute(instant: Date, value: number): number {
    this.records.push(new Record(this.periodicity, this.numberOfPeriods));

    let result: number;

    this.records = this.records.filter(r => {
      r.compute(instant, value);
      if (r.isFinished(instant)) {
        this.r2 = r.getR2();
        this.cagr = r.getCAGR();
        result = this.cagr * this.r2;
        return false;
      }
      return true;
    });

    return result;
  }
}
