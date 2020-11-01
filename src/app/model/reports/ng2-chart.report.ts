import { ChartDataSets, ChartOptions, ChartPoint } from 'chart.js';
import { Label } from 'ng2-charts';
import { Report, Reporter, ReportedData, PreProcessor } from '../core/reporting';
import { Injectable } from '@angular/core';
import { StringUtils } from '../utils/string-utils';
import { IChartReport, ChartConfiguration, ChartAnnotation, ShowDataOn, ShowDataAs } from './chart-report';

class XChartPoint implements ChartPoint {
  x?: number;
  y?: number;
  originalValue?: number;
}

/**
 * Formats the title of the tooltip.
 */
let formatTooltipTitle = function(tooltipItems: any[]): string {
  let tooltipItem = tooltipItems[0];
  let value = parseInt(tooltipItem.label);
  return StringUtils.formatAsDate(value);
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
  let dataValue: number;
  if (value >= 1) {
    dataValue = Math.round(value * 100) / 100;
  } else {
    dataValue = value;
  }

  return dataName + ": " + dataValue;
}

/**
 * A factory able to create new instances of the Ng2 charts report.
 */
 @Injectable({
   providedIn: 'root'
 })
export class Ng2ChartReportFactory {
  public newInstance(obj = {} as IChartReport): Ng2ChartReport {
    console.log("New Ng2ChartReport");
    return new Ng2ChartReport(obj);
  }
}

/**
 * Receives the data and formats them into Ng2 data, so they can directly
 * be displayed in a Ng2 Chart.
 * @class {Ng2ChartReport}
 */
export class Ng2ChartReport implements Report {
  public start: number;
  public end: number;
  public dataSets: ChartDataSets[];
  public labels: Label[];
  public options: (ChartOptions & { annotation: any }) = {
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
            callback: StringUtils.formatAsDate,
            display: true,
          }
        }],
      },
      annotation: {
        annotations: []
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'x'
          },
          zoom: {
            enabled: true,
            mode: 'x'
          }
        }
      }
    };
  private annotations: any[] = this.options.annotation.annotations;
  private mapOfDatasets: Map<String, ChartDataSets>;
  private mapOfConfigurations: Map<String, ChartConfiguration>;
  private mapOfAnnotations: Map<String, ChartAnnotation>;
  private preProcessors: PreProcessor[] = [];
  private reporters: Reporter[] = [];

  constructor(obj = {} as IChartReport) {
    this.initialize(obj);
  }

  public initialize(obj = {} as IChartReport): void {
    this.mapOfDatasets = new Map<String, ChartDataSets>();
    this.mapOfConfigurations = new Map<String, ChartConfiguration>();
    this.mapOfAnnotations = new Map<String, ChartAnnotation>();
    this.dataSets = [];
    this.labels = [];

    let {
      start,
      end,
      preProcessors = [],
      configurations = [],
      annotations = []
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

    annotations.forEach(annotation => {
      this.mapOfAnnotations.set(annotation.show, annotation);
    });
  }

  private leftAxisIsUsed: boolean = false;
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
    this.preProcessors.forEach(preProcessor => {
      preProcessor.receiveData(providedData);
    });
    if (this.x) {
      if (providedData.y) {
        this.placeAPoint(providedData);
      } else {
        this.placeAnAnnotation(providedData);
      }
    }
  }

  private placeAPoint(providedData: ReportedData): void {
    let dataSet: ChartDataSets = this.mapOfDatasets.get(providedData.sourceName);
    if (dataSet) {
      let data: ChartPoint[] = dataSet.data as ChartPoint[];
      let normalizedY: number = this.normalize(providedData.sourceName, providedData.y);
      let chartPoint: XChartPoint = {x: this.x, y: normalizedY, originalValue: providedData.y};
      data.push(chartPoint);
    }
  }

  private placeAnAnnotation(providedData: ReportedData): void {
    let annotation: ChartAnnotation = this.mapOfAnnotations.get(providedData.sourceName);
    if (annotation) {
      this.annotations.push({
        type: 'line',
        mode: 'vertical',
        scaleID: 'x-axis-0',
        value: this.x,
        borderColor: annotation.color,
        borderWidth: 1,
        label: {
          enabled: true,
          fontColor: annotation.color,
          content: providedData.sourceName
        }
      });
    }
  }

  completeReport(): void {
    // Nothing specia to do.
  }

  private normalizationMap: Map<string, number> = new Map<string, number>();

  private normalize(sourceName: string, y: number): number {
    let configuration: ChartConfiguration = this.mapOfConfigurations.get(sourceName);
    if (configuration) {
      if (configuration.normalize) {
        let normalizationId: string = sourceName + ":" + configuration.on;
        let normalizationScale:number = this.normalizationMap.get(normalizationId);
        if (!normalizationScale && y != 0) {
          normalizationScale = Math.abs(100 / y);
          this.normalizationMap.set(normalizationId, normalizationScale);
        }
        return normalizationScale * y;
      }
    }
    return y;
  }
}
