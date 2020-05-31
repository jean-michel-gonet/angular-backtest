import { PeriodLength } from '../../core/period';

interface ISlidingPerformance {
  source: string;
  over: number;
  periodLength: PeriodLength;
  output: string;
}

export class SlidingPerformance {
  source: string;
  over: number;
  periodLength: PeriodLength;
  output: string;

  constructor(obj = {} as ISlidingPerformance) {
    let {
      source,
      over,
      periodLength,
      output
    } = obj;
    this.source = source;
    this.over = over;
    this.periodLength = periodLength;
    this.output = output;
  }
}
