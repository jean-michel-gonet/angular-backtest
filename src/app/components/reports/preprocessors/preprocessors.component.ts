import { Component, ContentChildren, QueryList } from '@angular/core';
import { PerformancePreprocessorComponent } from './performance-preprocessor.component';
import { PreProcessor } from 'src/app/model/core/reporting';

@Component({
  selector: 'preprocessors',
  template: '<ng-content></ng-content>'
})
export class PreprocessorsComponent {
  @ContentChildren(PerformancePreprocessorComponent)
  private slidingPerformanceComponents: QueryList<PerformancePreprocessorComponent>;

  public asPreProcessors(): PreProcessor[] {
    let preProcessors: PreProcessor[] = [];
    this.slidingPerformanceComponents.forEach(slidingPerformanceComponent =>  {
      preProcessors.push(slidingPerformanceComponent.asPerformancePreprocessor());
    });
    return preProcessors;
  }
}
