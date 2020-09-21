import { Component, Input } from '@angular/core';
import { Ng2ChartAnnotation } from 'src/app/model/reports/ng2-chart.report';

@Component({
  selector: 'chart-report-annotation',
  template: '',
})
export class ChartReportAnnotationComponent {

  @Input()
  public show: string;

  @Input()
  public color: string;

  asNg2ChartAnnotation(): Ng2ChartAnnotation {
    return  {
      show: this.show,
      color: this.color,
    };
  }
}
