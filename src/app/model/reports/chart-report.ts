import { PreProcessor } from '../core/reporting';

export enum ShowDataAs {
  LINE = 'LINE',
  SCATTER = 'SCATTER'
};

export enum ShowDataOn {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
};

export interface ChartConfiguration {
  show: string;
  as: ShowDataAs;
  on: ShowDataOn;
  normalize?: boolean;
}

export interface ChartAnnotation {
  show: string;
  color: string;
}

export interface IChartReport {
  start?: Date;
  end?: Date;
  preProcessors?: PreProcessor[];
  configurations: ChartConfiguration[],
  annotations?: ChartAnnotation[]
}
