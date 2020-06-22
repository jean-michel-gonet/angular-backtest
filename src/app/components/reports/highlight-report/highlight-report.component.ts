import { Component, ContentChildren, QueryList, AfterViewInit } from '@angular/core';
import { BaseHighlightComponent, Highlight } from './highlight.component';
import { Report, Reporter, ReportedData } from 'src/app/model/core/reporting';

@Component({
  selector: 'highlight-report',
  template: '<ng-content></ng-content>'
})
export class HighlightReportComponent implements Report {
  private reporters: Reporter[] = [];

  @ContentChildren(BaseHighlightComponent)
  private highlights: QueryList<BaseHighlightComponent>;

  register(reporter: Reporter): void {
    this.reporters.push(reporter);
  }

  startReportingCycle(instant: Date): void {
    this.highlights.forEach(h => {
      h.startReportingCycle(instant);
    });
  }

  receiveData(providedData: ReportedData): void {
    this.highlights.forEach(h => {
      h.receiveData(providedData);
    });
  }

  collectReports(): void {
    this.reporters.forEach(r => {
      r.reportTo(this);
    });
  }
  completeReport(): void {
    this.highlights.forEach(h => {
      h.completeReport();
    });
  }
}
