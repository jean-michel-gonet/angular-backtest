import { Periodicity } from '../../core/period';

export enum ConfigurableSource {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  HIGH = 'HIGH',
  LOW = 'LOW',
  ADJUSTED = 'ADJUSTED',
  MID = 'MID',
}

export enum ConfigurablePreprocessing {
  TYPICAL = 'TYPICAL',
  MEDIAN = 'MEDIAN',
  LAST = 'LAST',
  FIRST = 'FIRST'
}

export class IndicatorConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name;
  }
}

export interface IndicatorConfiguration {
  periodicity: Periodicity;
  source?: ConfigurableSource;
  preprocessing?: ConfigurablePreprocessing;
}
