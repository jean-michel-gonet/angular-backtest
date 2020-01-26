import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { DataProcessor, ProvidedData } from '../model/core/data-processor';

export enum ShowDataAs {
  LINE,
  BAR
};

export enum ShowDataOn {
  LEFT,
  RIGHT
};

export class Show {
  show: String;
  as: ShowDataAs;
  on: ShowDataOn;
}

/**
 * Receives the data and formats them into Ng2 data, so they can directly
 * be displayed in a Ng2 Chart.
 * @class {Ng2ChartDataProcessor}
 */
export class Ng2ChartDataProcessor implements DataProcessor {
  public dataSets: ChartDataSets;
  public labels: Label[];
  public options: ChartOptions;

  private show: Show[];

  constructor(obj = [] as Show[]) {
    this.show = obj;
  }

  receiveData(providedData: ProvidedData): void {
    console.log(providedData);
  }
}
