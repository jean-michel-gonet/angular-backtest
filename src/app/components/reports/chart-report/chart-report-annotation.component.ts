import { Component, Input } from '@angular/core';
import { ChartAnnotation } from 'src/app/model/reports/chart-report';

@Component({
  selector: 'chart-report-annotation',
  template: '',
})
export class ChartReportAnnotationComponent {

  @Input()
  public show: string;

  @Input()
  public color: string;

  asNg2ChartAnnotation(): ChartAnnotation {
    return  {
      show: this.show,
      color: this.color,
    };
  }
}
