import { Component, ContentChild } from '@angular/core';
import { Reports } from 'src/app/model/reports/reports';
import { PreprocessorsComponent } from './preprocessors/preprocessors.component';
import { PreProcessor, Report } from 'src/app/model/core/reporting';
import { ChartReportComponent } from './chart-report/chart-report.component';
import { HighlightReportComponent } from './highlight-report/highlight-report.component';

@Component({
  selector: 'reports',
  template: '<ng-content></ng-content>'
})
export class ReportsComponent {
  @ContentChild(PreprocessorsComponent, {static: true})
  public chartReportPreprocessorsComponent: PreprocessorsComponent;

  @ContentChild(HighlightReportComponent, {static: true})
  public highlightReportComponent: HighlightReportComponent;

  @ContentChild(ChartReportComponent, {static: true})
  public chartReportComponent: ChartReportComponent;

  asReports(): Reports {
    let preProcessors: PreProcessor[] = this.chartReportPreprocessorsComponent.asPreProcessors();
    let reports: Report[] = [];
    reports.push(this.chartReportComponent);
    reports.push(this.highlightReportComponent);
    return new Reports({preProcessors: preProcessors, reports: reports});
  }
}
