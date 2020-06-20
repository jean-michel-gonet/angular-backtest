import { Component, ContentChild } from '@angular/core';
import { Reports } from 'src/app/model/reports/reports';
import { ChartReportPreprocessorsComponent } from './preprocessors/chart-report-preprocessors.component';
import { PreProcessor, Report } from 'src/app/model/core/reporting';
import { ChartReportComponent } from './chart-report.component';

@Component({
  selector: 'reports',
  template: '<ng-content></ng-content>'
})
export class ReportsComponent {
  @ContentChild(ChartReportPreprocessorsComponent, {static: true})
  public chartReportPreprocessorsComponent: ChartReportPreprocessorsComponent;

  @ContentChild(ChartReportComponent, {static: true})
  public chartReportComponent: ChartReportComponent;

  asReports(): Reports {
    let preProcessors: PreProcessor[] = this.chartReportPreprocessorsComponent.asPreProcessors();
    let reports: Report[] = [];
    reports.push(this.chartReportComponent);
    return new Reports({preProcessors: preProcessors, reports: reports});
  }
}
