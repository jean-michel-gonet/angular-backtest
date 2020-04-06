import {
  Component,
  QueryList,
  AfterViewInit,
  ContentChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef } from '@angular/core';

import {
  Report,
  Reporter,
  ReportedData } from 'src/app/model/core/reporting';
import { ChartReportConfigurationComponent } from './chart-report-configuration.component';
import { Ng2ChartReport, Ng2ChartConfiguration } from 'src/app/model/reports/ng2-chart.report';

@Component({
  selector: 'chart-report',
  templateUrl: './chart-report.component.html',
  styleUrls: ['./chart-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartReportComponent implements AfterViewInit, Report {
  @ContentChildren(ChartReportConfigurationComponent)
  private show: QueryList<ChartReportConfigurationComponent>;

  public reportIsReady: boolean;

  constructor(private cdr: ChangeDetectorRef, public ng2ChartReport: Ng2ChartReport) {
    this.reportIsReady = false;
  }

  ngAfterViewInit() {
    let configuration: Ng2ChartConfiguration[] = [];
    this.show.forEach(configurationComponent => {
      configuration.push(configurationComponent.asNg2ChartConfiguration());
    });
    this.ng2ChartReport.initialize(configuration);
  }

  register(reporter: Reporter): void {
    this.ng2ChartReport.register(reporter);
  }

  receiveData(providedData: ReportedData): void {
    this.ng2ChartReport.receiveData(providedData);
  }

  startReportingCycle(instant: Date): void {
    this.ng2ChartReport.startReportingCycle(instant);
  }

  collectReports(): void {
    this.ng2ChartReport.collectReports();
  }

  completeReport(): void {
    this.ng2ChartReport.completeReport();
    this.reportIsReady = true;
    this.cdr.detectChanges();
  }
}
