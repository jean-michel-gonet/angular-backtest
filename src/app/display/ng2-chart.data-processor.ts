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
  show: string;
  as: ShowDataAs;
  on: ShowDataOn;
}

/**
 * Receives the data and formats them into Ng2 data, so they can directly
 * be displayed in a Ng2 Chart.
 * @class {Ng2ChartDataProcessor}
 */
export class Ng2ChartDataProcessor implements DataProcessor {
  public dataSets: ChartDataSets[];
  public labels: Label[];
  public options: ChartOptions = {
      legend: {
        display: true
      },
      scales: {
        yAxes: [
          {
            id: "y-axis-left",
            position: 'left',
            ticks: {
              beginAtZero: true
            }
          }, {
            id: "y-axis-right",
            position: 'right',
            ticks: {
              beginAtZero: true
            }
          }],
        xAxes: [{
          ticks: {
            display: true,
          }
        }],
      }
    };

  private mapOfDatasets: Map<String, ChartDataSets>;
  private lastTime: Date;

  constructor(obj = [] as Show[]) {
    this.mapOfDatasets = new Map<String, ChartDataSets>();
    this.dataSets = [];
    this.labels = [];
    obj.forEach(show => {
      let yAxisID:string = "y-axis-" + this.showOn(show.on);
      let dataSet: ChartDataSets = {
        data: [],
        label: show.show,
        yAxisID: yAxisID,
        type: this.showAs(show.as)
      };
      this.mapOfDatasets.set(show.show, dataSet);
      this.dataSets.push(dataSet);
    });
  }

  receiveData(providedData: ProvidedData): void {
    let dataSet: ChartDataSets = this.mapOfDatasets.get(providedData.sourceName);
    if (dataSet) {
      dataSet.data.push(providedData.y);
      if (!this.lastTime || this.lastTime.getDate() < providedData.time.getDate()) {
        this.labels.push(providedData.time.toDateString());
        this.lastTime = providedData.time;
      }
    }
  }

  private showOn(showOn: ShowDataOn):string {
    switch(showOn) {
      case ShowDataOn.LEFT:
        return "left";
      case ShowDataOn.RIGHT:
        return "right";
      default:
        console.warn("showOn=" + showOn + ": unknown literal of ShowDataOn");
        return "";
    }
  }
  private showAs(showAs: ShowDataAs):string {
    switch(showAs) {
      case ShowDataAs.LINE:
        return "line";
      case ShowDataAs.BAR:
        return "bar";
      default:
        console.warn("showAs=" + showAs + ": unknown literal of ShowDataAs");
        return "";
    }
  }
}
