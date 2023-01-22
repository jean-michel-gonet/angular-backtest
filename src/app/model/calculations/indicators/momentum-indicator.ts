import { ConfigurableSourceIndicator } from './configurable-source-indicator';
import { IndicatorConfiguration } from './configurable-source';
import { ExponentialRegression } from '../statistics/exponential-regression';

interface MomentumIndicatorConfiguration extends IndicatorConfiguration {
  numberOfPeriods: number;
}

class Record {
  private exponential = new ExponentialRegression();
  public firstInstant: Date;
  public lastInstant: Date;
  public numberOfComputations: number = 0;
  public cagr: number;
  public r2: number;

  public compute(instant: Date, value: number) {
    if (!this.firstInstant) {
      this.firstInstant = instant;
    }
    this.lastInstant = instant;
    this.numberOfComputations++;
    this.exponential.regression(instant, value);
  }

  public getCAGR(): number {
    this.cagr = this.exponential.getCAGR();
    return this.cagr;
  }
  public getR2(): number {
    this.r2 = this.exponential.getR2();
    return this.r2;
  }
}

export class MomentumIndicator extends ConfigurableSourceIndicator {
  public numberOfPeriods: number;
  private records: Record[];
  public latestRecord: Record;

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
    while(this.records.length >= this.numberOfPeriods) {
      this.latestRecord = this.records.shift();
      result = this.latestRecord.getCAGR() * this.latestRecord.getR2();
    }

    return result;
  }
}
