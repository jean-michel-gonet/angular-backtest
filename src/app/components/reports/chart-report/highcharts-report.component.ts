import {
  Component,
  QueryList,
  AfterViewInit,
  ContentChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input} from '@angular/core';

import {
  Report,
  Reporter,
  ReportedData} from 'src/app/model/core/reporting';
import { ChartReportConfigurationComponent } from './chart-report-configuration.component';
import { StringUtils } from 'src/app/model/utils/string-utils';
import { ChartReportAnnotationComponent } from './chart-report-annotation.component';
import { ShowDataOn } from 'src/app/model/reports/chart-report';
import * as Highcharts from 'highcharts';

class ClippingBox {
  axis: any;
  y: number;
  yMin: number;
  yMax: number;
  h: number;
}

@Component({
  selector: 'highcharts-report',
  templateUrl: './highcharts-report.component.html',
  styleUrls: ['./highcharts-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighchartsReportComponent implements AfterViewInit, Report {

  private _start: Date;
  @Input()
  set start(value: Date) {
    if (typeof value == 'string') {
      this._start = StringUtils.convertToDate(value);
    } else {
      this._start = value;
    }
  }
  get start() {
    return this._start;
  }

  private _end: Date;
  @Input()
  set end(value: Date) {
    if (typeof value == 'string') {
      this._end = StringUtils.convertToDate(value);
    } else {
      this._end = value;
    }
  }
  get end() {
    return this._end;
  }

  private _id: string = "hc-" + Math.random();
  @Input()
  set id(value: string) {
    this._id = value;
  }
  get id(): string {
    return this._id
  }

  private _title: string;
  @Input()
  set title(value: string) {
    this._title = value;
  }
  get title(): string {
    return this._title
  }

  public options: any = {
        chart: {
          type: 'scatter',
          height: 700,
          zoomType: 'x',
          panning: true,
          panKey: 'shift',
          animation: false,
        },
        annotations: [],
        title: {
          text: this.title
        },
        credits: {
          enabled: false
        },
        tooltip: {
          split: true,
          pointFormatter: function() {
                return '<span style="color:{point.color}">\u25CF</span> '
                    + [this.series.name] + ': <b>' + this.y.toFixed(2) + '</b><br/>';
            },
        },
        yAxis: [],
        xAxis: {
          type: 'datetime',
          plotLines:[],
          labels: {
            formatter: function() {
              return Highcharts.dateFormat('%e %b %y', this.value);
            }
          }
        },
        series: []
      };

  @ContentChildren(ChartReportConfigurationComponent)
  private configurationComponents: QueryList<ChartReportConfigurationComponent>;

  @ContentChildren(ChartReportAnnotationComponent)
  private annotationComponents: QueryList<ChartReportAnnotationComponent>;

  public reportIsReady: boolean;

  private mapOfSeries: Map<string, any>;
  private mapOfAnnotations: Map<string, ChartReportAnnotationComponent>;

  constructor(private cdr: ChangeDetectorRef) {
    this.reportIsReady = false;
  }

  ngAfterViewInit() {
    this.initializeSeries();
    this.initializeAnnotations();
  }

  private initializeAnnotations(): void {
    this.mapOfAnnotations = new Map<string, ChartReportAnnotationComponent>();
    this.options.title.text = this.title;
    this.annotationComponents.forEach(annotationComponent => {
      this.mapOfAnnotations.set(annotationComponent.show, annotationComponent);
    });
  }

  private initializeSeries(): void {
    this.mapOfSeries = new Map<string, any>();

    this.configurationComponents.forEach(configurationComponent => {
      let serie = {
        type: configurationComponent.showDataAs.toLowerCase(),
        name: configurationComponent.show,
        events: {
          click: HighchartsReportComponent.normalize
        },
        states: {
          inactive: {
            enabled: false
          }
        },
        yAxis: this.createYAxis(configurationComponent.show, configurationComponent.showDataOn),
        normalize: configurationComponent.normalize,
        data: []
      };
      this.mapOfSeries.set(configurationComponent.show, serie);
      this.options.series.push(serie);
    });
  }

  private createYAxis(show: string, showDataOn: ShowDataOn): string {
    let yAxis = {
      id: show,
      opposite: showDataOn == ShowDataOn.RIGHT,
      alignTicks: false,
      endOnTick: false,
      title: {
        text: show
      }
    };
    this.options.yAxis.push(yAxis);
    return show;
  }

  private x: number;
  private reporters: Reporter[] = [];

  register(reporter: Reporter): void {
    this.reporters.push(reporter);
  }

  private betweenStartAndEnd(instant: Date): boolean  {
    if (this.start) {
      if (instant.valueOf() < this.start.valueOf()) {
        return false;
      }
    }
    if (this.end) {
      if (instant.valueOf() > this.end.valueOf()) {
        return false;
      }
    }
    return true;
  }


  receiveData(providedData: ReportedData): void {
    if (this.x) {
      if (providedData.y) {
        this.placeAPoint(providedData);
      } else {
        this.placeAnAnnotation(providedData);
      }
    }
  }

  private placeAPoint(providedData: ReportedData): void {
    let series = this.mapOfSeries.get(providedData.sourceName);
    if (series) {
      let data = series.data;
      let chartPoint = [this.x, providedData.y];
      data.push(chartPoint);
    }
  }

  private placeAnAnnotation(providedData: ReportedData): void {
      let annotation: ChartReportAnnotationComponent =
        this.mapOfAnnotations.get(providedData.sourceName);
      if (annotation) {
        this.options.xAxis.plotLines.push({
            color: annotation.color,
            width: 1,
            value: this.x
        });
      }
  }

  startReportingCycle(instant: Date): void {
    if (this.betweenStartAndEnd(instant)) {
      // Propagate to reporters:
      this.reporters.forEach(reporter => {
        reporter.startReportingCycle(instant);
      });
      // Remember the instant:
      this.x = instant.valueOf();
    } else {
      this.x = null;
    }
  }

  collectReports(): void {
    this.reporters.forEach(reporter => {
      reporter.reportTo(this);
    });
  }

  completeReport(): void {
    Highcharts.chart(this.id, this.options);
    this.reportIsReady = true;
    this.cdr.detectChanges();
  }

  public static normalize(event: any) {
    let chart: any = event.point.series.chart;
    let min: number = chart.xAxis[0].min;
    let max: number = chart.xAxis[0].max;
    let clicked: number = event.point.x;

    let clippingBoxes: ClippingBox[] =
        HighchartsReportComponent.findClippingBoxes(min, max, clicked, chart.series);

    let referenceClippingBox =
      HighchartsReportComponent.findReferenceClippingBox(clippingBoxes);

    clippingBoxes.forEach(clippingBox => {
      if (clippingBox == referenceClippingBox) {
        clippingBox.axis.setExtremes(clippingBox.yMin, clippingBox.yMax);
      } else {
        let sMax = (clippingBox.y - clippingBox.yMin) / referenceClippingBox.h + clippingBox.yMin;
        clippingBox.axis.setExtremes(clippingBox.yMin, sMax);
      }
    });
  }

  private static findReferenceClippingBox(clippingBoxes: ClippingBox[]): ClippingBox {
    let referenceClippingBox: ClippingBox;
    clippingBoxes.forEach(clippingBox => {
      if (referenceClippingBox) {
        if (clippingBox.h < referenceClippingBox.h) {
          referenceClippingBox = clippingBox;
        }
      } else {
        referenceClippingBox = clippingBox;
      }
    });
    return referenceClippingBox;
  }

  private static findClippingBoxes(min: number, max: number, clicked: number, series: any[]) {
    let clippingBoxes: ClippingBox[] = [];
    series.forEach(series => {
      if (!series.yAxis.opposite) {
        let index: number = 0;
        let startIndex: number = 0;
        let endIndex: number = series.xData.length - 1;
        let clickedIndex: number = 0;
        series.xData.forEach(x => {
          if (x <= min) {
            startIndex = index;
          }
          if (x <= clicked) {
            clickedIndex = index;
          }
          if (x <= max) {
            endIndex = index;
          }
          index++;
        });
        let y: number = series.yData[clickedIndex];
        let yMin: number = y;
        let yMax: number = y;
        for(var n = startIndex; n <= endIndex; n++) {
          if (series.yData[n] < yMin) {
            yMin = series.yData[n];
          }
          if (series.yData[n] > yMax) {
            yMax = series.yData[n];
          }
        }
        let clippingBox: ClippingBox = {
          axis: series.yAxis,
          yMax: yMax,
          yMin: yMin,
          y: y,
          h: (y - yMin) / (yMax - yMin)
        };
        clippingBoxes.push(clippingBox);
      }
    });
    return clippingBoxes;
  }

}
