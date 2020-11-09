import { Component, ContentChild } from '@angular/core';
import { Reports } from 'src/app/model/reports/reports';
import { PreprocessorsComponent } from './preprocessors/preprocessors.component';
import { PreProcessor, Report } from 'src/app/model/core/reporting';
import { HighlightReportComponent } from './highlight-report/highlight-report.component';
import { HighchartsReportComponent } from './chart-report/highcharts-report.component';

@Component({
  selector: 'reports',
  template: '<ng-content></ng-content>'
})
export class ReportsComponent {
  @ContentChild(PreprocessorsComponent, {static: true})
  public chartReportPreprocessorsComponent: PreprocessorsComponent;

  @ContentChild(HighlightReportComponent, {static: true})
  public highlightReportComponent: HighlightReportComponent;

  @ContentChild(HighchartsReportComponent, {static: true})
  public chartReportComponent: HighchartsReportComponent;

  asReports(): Reports {
    let preProcessors: PreProcessor[];
    if (this.chartReportPreprocessorsComponent) {
      preProcessors = this.chartReportPreprocessorsComponent.asPreProcessors();
    }
    let reports: Report[] = [];
    if (this.chartReportComponent) {
      reports.push(this.chartReportComponent);
    }
    if (this.highlightReportComponent) {
      reports.push(this.highlightReportComponent);
    }
    return new Reports({preProcessors: preProcessors, reports: reports});
  }
}
