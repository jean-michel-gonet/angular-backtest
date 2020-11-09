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
  max: number;
  a: number;
  start: number;
}

@Component({
  selector: 'highcharts-report',
  templateUrl: './highcharts-report.component.html',
  styleUrls: ['./highcharts-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighchartsReportComponent implements AfterViewInit, Report {

  public static normalize(event: any) {
    let {min, max} =
        HighchartsReportComponent.selectedXRange(event);
    let clippingBoxes: ClippingBox[] =
        HighchartsReportComponent.findClippingBoxes(min, max, event.target.series);
    let referenceClippingBox =
      HighchartsReportComponent.findReferenceClippingBox(clippingBoxes);

    clippingBoxes.forEach(clippingBox => {
      if (clippingBox == referenceClippingBox) {
        clippingBox.axis.setExtremes(0, clippingBox.max);
      } else {
        let sMax = clippingBox.start / referenceClippingBox.a;
        clippingBox.axis.setExtremes(0, sMax);
      }
    });
  }


  private static findReferenceClippingBox(clippingBoxes: ClippingBox[]): ClippingBox {
    let referenceClippingBox: ClippingBox;
    clippingBoxes.forEach(clippingBox => {
      if (referenceClippingBox) {
        if (clippingBox.a < referenceClippingBox.a) {
          referenceClippingBox = clippingBox;
        }
      } else {
        referenceClippingBox = clippingBox;
      }
    });
    return referenceClippingBox;
  }

  private static selectedXRange(event: any): {min: number, max:number} {
    let min: number;
    let max: number;
    // Find the selected range in X axis:
    if (event.xAxis) {
      min = event.xAxis[0].min;
      max = event.xAxis[0].max;
    } else {
      min = event.target.xAxis[0].dataMin;
      max = event.target.xAxis[0].dataMax;
    }
    return {min: min, max: max};
  }

  private static findClippingBoxes(min: number, max: number, series: any[]) {
    let clippingBoxes: ClippingBox[] = [];
    series.forEach(series => {
      if (!series.yAxis.opposite) {
        let index: number = 0;
        let startIndex: number = 0;
        let endIndex: number = series.xData.length - 1;
        series.xData.forEach(x => {
          if (x <= min) {
            startIndex = index;
          }
          if (x <= max) {
            endIndex = index;
          }
          index++;
        });
        let y0: number = series.yData[startIndex];
        let maxY: number = series.yData[startIndex];
        for(var n = startIndex; n <= endIndex; n++) {
          if (series.yData[n] > maxY) {
            maxY = series.yData[n];
          }
        }
        let clippingBox: ClippingBox = {
          axis: series.yAxis,
          max: maxY,
          a: y0 / maxY,
          start: y0
        };
        clippingBoxes.push(clippingBox);
      }
    });
    return clippingBoxes;
  }

  public options: any = {
        chart: {
          type: 'scatter',
          height: 700,
          zoomType: 'x',
          events: {
            selection: HighchartsReportComponent.normalize
          },
          panning: true,
          panKey: 'shift'
        },
        annotations: [],
        title: {
          text: 'Sample Scatter Plot'
        },
        credits: {
          enabled: false
        },
        tooltip: {
          formatter: function() {
            return '<b>x: </b>' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
              ' <br> <b>y: </b>' + this.y.toFixed(2);
          }
        },
        yAxis: [],
        xAxis: {
          type: 'datetime',
          scrollbar: {
            enabled: true
          },
          labels: {
            formatter: function() {
              return Highcharts.dateFormat('%e %b %y', this.value);
            }
          }
        },
        series: []
      };

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
          click: function(e: any) {
            alert(e);
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
}
