import { ConfigurableSourceIndicator } from './configurable-source-indicator';
import { IndicatorConfiguration } from './configurable-source';
import { ExponentialRegression } from '../statistics/exponential-regression';

interface MomentumIndicatorConfiguration extends IndicatorConfiguration {
  numberOfPeriods: number;
}

class Record {
  private exponential = new ExponentialRegression();

  public compute(instant: Date, value: number) {
    this.exponential.regression(instant, value);
  }

  public getCAGR(): number {
    return this.exponential.getCAGR();
  }
  public getR2(): number {
    return this.exponential.getR2();
  }
}

export class MomentumIndicator extends ConfigurableSourceIndicator {
  public numberOfPeriods: number;
  private records: Record[];
  public cagr: number;
  public r2: number;

  constructor(configuration = {} as MomentumIndicatorConfiguration) {
    super(configuration);
    this.numberOfPeriods = configuration.numberOfPeriods;
    this.records = [];
  }

  compute(instant: Date, value: number): number {
    this.records.push(new Record());
    this.records.forEach(r => {
      r.compute(instant, value);
    });

    let result: number;
    while(this.records.length > this.numberOfPeriods) {
      let r = this.records.shift();
      this.r2 = r.getR2();
      this.cagr = r.getCAGR();
      result = this.cagr * this.r2;
    }

    return result;
  }
}
