import { Component, ContentChildren, QueryList, AfterViewInit } from '@angular/core';
import { HighlightReport } from 'src/app/model/reports/highlight/highlight-report';
import { HighlightComponent } from './highlight.component';

@Component({
  selector: 'highlight-report',
  template: '<ng-content></ng-content>'
})
export class HighlightReportComponent extends HighlightReport implements AfterViewInit {
  @ContentChildren(HighlightComponent)
  public highlightComponents: QueryList<HighlightComponent>;

  ngAfterViewInit(): void {
    this.initialize(this.highlightComponents.toArray());
  }
}
