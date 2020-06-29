import { Component, ContentChildren, QueryList } from '@angular/core';
import { PerformancePreprocessorComponent } from './performance-preprocessor.component';
import { RegressionPreprocessorComponent } from './regression-preprocessor.component';
import { PreProcessor } from 'src/app/model/core/reporting';

@Component({
  selector: 'preprocessors',
  template: '<ng-content></ng-content>'
})
export class PreprocessorsComponent {
  @ContentChildren(PerformancePreprocessorComponent)
  private performancePreprocessorComponents: QueryList<PerformancePreprocessorComponent>;

  @ContentChildren(RegressionPreprocessorComponent)
  private regressionPreprocessorComponent: QueryList<RegressionPreprocessorComponent>;

  public asPreProcessors(): PreProcessor[] {
    let preProcessors: PreProcessor[] = [];

    this.performancePreprocessorComponents.forEach(p =>  {
      preProcessors.push(p.asPerformancePreprocessor());
    });
    this.regressionPreprocessorComponent.forEach(p =>  {
      preProcessors.push(p.asRegressionPreprocessor());
    });

    return preProcessors;
  }
}
