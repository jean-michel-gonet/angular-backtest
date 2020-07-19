import { Component, ContentChildren, QueryList, AfterViewInit } from '@angular/core';
import { HighlightReport } from 'src/app/model/reports/highlight/highlight-report';
import { BaseHighlight } from 'src/app/model/reports/highlight/highlight';

@Component({
  selector: 'highlight-report',
  template: '<ng-content></ng-content>'
})
export class HighlightReportComponent extends HighlightReport implements AfterViewInit {
  @ContentChildren(BaseHighlight)
  public highlightComponents: QueryList<BaseHighlight>;

  ngAfterViewInit(): void {
    this.initialize(this.highlightComponents.toArray());
  }
}
