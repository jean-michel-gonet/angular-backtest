import { PeriodLength } from '../../core/period';

export enum ConfigurableSource {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  HIGH = 'HIGH',
  LOW = 'LOW',
  MID = 'MID'
}

export enum ConfigurablePreprocessing {
  TYPICAL = 'TYPICAL',
  MEDIAN = 'MEDIAN',
  LAST = 'LAST',
  FIRST = 'FIRST'
}

export class IMovingCalculator {
  numberOfPeriods: number;
  periodLength: PeriodLength;
  source?: ConfigurableSource;
  preprocessing?: ConfigurablePreprocessing;
}
