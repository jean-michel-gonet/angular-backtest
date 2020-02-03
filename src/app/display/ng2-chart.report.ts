import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Report, Reporter, ReportedData } from '../model/core/reporting';

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
 * @class {Ng2ChartReport}
 */
export class Ng2ChartReport implements Report {
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
  private reporters: Reporter[] = [];

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
        type: this.showAs(show.as),
        pointRadius: 0
      };
      this.mapOfDatasets.set(show.show, dataSet);
      this.dataSets.push(dataSet);
    });
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

  /**
   * Registers a reporter to this data processor.
   */
  register(reporter: Reporter): void {
    this.reporters.push(reporter);
  }

  startReportingCycle(time: Date): void {
    this.labels.push(time.toDateString());
    this.dataSets.forEach(d => {
      d.data.push(0);
    });

    this.reporters.forEach(reporter => {
      reporter.startReportingCycle(time);
    });
  }

  collectReports(): void {
    this.reporters.forEach(reporter => {
      reporter.reportTo(this);
    });
  }

  receiveData(providedData: ReportedData): void {
    let dataSet: ChartDataSets = this.mapOfDatasets.get(providedData.sourceName);
    if (dataSet) {
      dataSet.data[dataSet.data.length - 1] = providedData.y;
    }
  }
}
