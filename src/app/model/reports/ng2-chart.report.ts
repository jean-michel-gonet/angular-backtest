import { ChartDataSets, ChartOptions, ChartPoint } from 'chart.js';
import { Label } from 'ng2-charts';
import { Report, Reporter, ReportedData, PreProcessor } from '../core/reporting';
import { Injectable } from '@angular/core';

export enum ShowDataAs {
  LINE = 'LINE',
  SCATTER = 'SCATTER'
};

export enum ShowDataOn {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
};

export interface Ng2ChartConfiguration {
  show: string;
  as: ShowDataAs;
  on: ShowDataOn;
  normalize?: boolean;
}

export interface INg2ChartReport {
  start?: Date;
  end?: Date;
  preProcessors?: PreProcessor[];
  configurations: Ng2ChartConfiguration[],
}

class XChartPoint implements ChartPoint {
  x?: number;
  y?: number;
  originalValue?: number;
}

/**
 * Formats the provided number as a date
 */
let formatAsDate = function(value: any): string {
  let date: Date = new Date(value);
  let sYear: string = "" + date.getFullYear();
  let month: number = date.getMonth() + 1;
  let sMonth: string;
  if (month < 10) {
    sMonth = "0" + month;
  } else {
    sMonth = "" + month;
  }
  let day: number = date.getDate();
  let sDay: string;
  if (day < 10) {
    sDay = "0" + day;
  } else {
    sDay = "" + day;
  }
  let s = sYear + "." + sMonth + "." + sDay
  return s;
}

/**
 * Formats the title of the tooltip.
 */
let formatTooltipTitle = function(tooltipItems: any[]): string {
  let tooltipItem = tooltipItems[0];
  let value = parseInt(tooltipItem.label);
  return formatAsDate(value);
}

/**
 * Formats the label of the tooltip.
 * Which is actually the value.
 */
let formatLabel = function(tooltipItem: Chart.ChartTooltipItem, data: Chart.ChartData): string {
  let dataSet: ChartDataSets = data.datasets[tooltipItem.datasetIndex];
  let dataName: string = dataSet.label;

  let value: number;
  let d:XChartPoint = <XChartPoint>dataSet.data[tooltipItem.index];
  if (d.originalValue) {
    value = d.originalValue;
  } else {
    value = parseFloat(tooltipItem.value);
  }
  let dataValue: number = Math.round(value * 100) / 100;

  return dataName + ": " + dataValue;
}


/**
 * Receives the data and formats them into Ng2 data, so they can directly
 * be displayed in a Ng2 Chart.
 * @class {Ng2ChartReport}
 */
 @Injectable({
   providedIn: 'root',
   useFactory: () => {
     return new Ng2ChartReport();
   }
 })
export class Ng2ChartReport implements Report {
  public start: number;
  public end: number;
  public dataSets: ChartDataSets[];
  public labels: Label[];
  public options: ChartOptions = {
      animation: {
        duration: 0
      },
      hover: {
        animationDuration: 0
      },
      responsiveAnimationDuration: 0,
      legend: {
        display: true
      },
      tooltips: {
        callbacks: {
          title: formatTooltipTitle,
          label: formatLabel,
        }
      },
      scales: {
        yAxes: [],
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          ticks: {
            callback: formatAsDate,
            display: true,
          }
        }],
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy'
          },
          zoom: {
            enabled: true,
            mode: 'xy'
          }
        }
      }
    };
  private mapOfDatasets: Map<String, ChartDataSets>;
  private mapOfConfigurations: Map<String, Ng2ChartConfiguration>;
  private preProcessors: PreProcessor[] = [];
  private reporters: Reporter[] = [];

  constructor(obj = {} as INg2ChartReport) {
    this.initialize(obj);
  }

  public initialize(obj = {} as INg2ChartReport): void {
    this.mapOfDatasets = new Map<String, ChartDataSets>();
    this.mapOfConfigurations = new Map<String, Ng2ChartConfiguration>();
    this.dataSets = [];
    this.labels = [];

    let {
      start,
      end,
      preProcessors = [],
      configurations = []
    } = obj;
    if (start) {
      this.start = start.valueOf();
    }
    if (end) {
      this.end = end.valueOf();
    }
    this.preProcessors = preProcessors;
    configurations.forEach(show => {
      let yAxisID:string = "y-axis-" + this.showOn(show.on);
      let dataSet: ChartDataSets = {
        data: [],
        label: show.show,
        yAxisID: yAxisID,
        type: this.showAs(show.as),
        borderWidth: 1,
        pointRadius: 1.2
      };
      this.mapOfDatasets.set(show.show, dataSet);
      this.mapOfConfigurations.set(show.show, show);
      this.dataSets.push(dataSet);
    });
  }

  private leftAxisIsUsed:boolean = false;
  private rightAxisIsUsed: boolean = false;

  private showOn(showOn: ShowDataOn):string {
    switch(showOn) {
      case ShowDataOn.LEFT:
        if (!this.leftAxisIsUsed) {
          this.options.scales.yAxes.push(
            {
              id: "y-axis-left",
              position: 'left',
              ticks: {
                beginAtZero: true
              }
            });
          this.leftAxisIsUsed = true;
        }
        return "left";
      case ShowDataOn.RIGHT:
        if (!this.rightAxisIsUsed) {
          this.options.scales.yAxes.push(
            {
              id: "y-axis-right",
              position: 'right',
              ticks: {
                beginAtZero: true
              }
            });
          this.rightAxisIsUsed = true;
        }
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
      case ShowDataAs.SCATTER:
        return "scatter";
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

  private x: number;

  startReportingCycle(instant: Date): void {

    if (this.betweenStartAndEnd(instant)) {
      // Propagate to reporters:
      this.reporters.forEach(reporter => {
        reporter.startReportingCycle(instant);
      });
      // Propagate to preprocessors
      this.preProcessors.forEach(preProcessor => {
        preProcessor.startReportingCycle(instant)
      });
      // Remember the instant:
      this.x = instant.valueOf();
    } else {
      this.x = null;
    }
  }

  private betweenStartAndEnd(instant: Date): boolean  {
    if (this.start) {
      if (instant.valueOf() < this.start) {
        return false;
      }
    }
    if (this.end) {
      if (instant.valueOf() > this.end) {
        return false;
      }
    }
    return true;
  }

  collectReports(): void {
    this.reporters.forEach(reporter => {
      reporter.reportTo(this);
    });
    this.preProcessors.forEach(preProcessor => {
      preProcessor.reportTo(this);
    });
  }

  receiveData(providedData: ReportedData): void {
    if (this.x) {
      this.preProcessors.forEach(preProcessor => {
        preProcessor.receiveData(providedData);
      });

      let dataSet: ChartDataSets = this.mapOfDatasets.get(providedData.sourceName);
      if (dataSet) {
        let data: ChartPoint[] = dataSet.data as ChartPoint[];
        let normalizedY: number = this.normalize(providedData.sourceName, providedData.y);
        let chartPoint: XChartPoint = {x: this.x, y: normalizedY, originalValue: providedData.y};
        data.push(chartPoint);
      }
    }
  }

  completeReport(): void {
    // Nothing specia to do.
  }

  private normalizationMap: Map<string, number> = new Map<string, number>();

  private normalize(sourceName: string, y: number): number {
    let configuration: Ng2ChartConfiguration = this.mapOfConfigurations.get(sourceName);
    if (configuration) {
      if (configuration.normalize) {
        let normalizationId: string = sourceName + ":" + configuration.on;
        let normalizationScale:number = this.normalizationMap.get(normalizationId);
        if (!normalizationScale && y != 0) {
          normalizationScale = 100 / y;
          this.normalizationMap.set(normalizationId, normalizationScale);
        }
        return normalizationScale * y;
      }
    }
    return y;
  }
}
