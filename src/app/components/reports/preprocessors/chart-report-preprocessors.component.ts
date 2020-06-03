import { Component, ContentChildren, QueryList } from '@angular/core';
import { SlidingPerformanceComponent } from './sliding-performance.component';
import { PreProcessor } from 'src/app/model/core/reporting';

@Component({
  selector: 'chart-report-preprocessors',
  template: '<ng-content></ng-content>'
})
export class ChartReportPreprocessorsComponent {
  @ContentChildren(SlidingPerformanceComponent)
  private slidingPerformanceComponents: QueryList<SlidingPerformanceComponent>;

  public asPreProcessors(): PreProcessor[] {
    let preProcessors: PreProcessor[] = [];
    this.slidingPerformanceComponents.forEach(slidingPerformanceComponent =>  {
      preProcessors.push(slidingPerformanceComponent.asSlidingPerformance());
    });
    return preProcessors;
  }
}
