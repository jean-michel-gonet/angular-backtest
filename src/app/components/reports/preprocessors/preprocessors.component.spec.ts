import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegressionPreprocessorComponent } from './regression-preprocessor.component';
import { PerformancePreprocessorComponent } from './performance-preprocessor.component';
import { PreprocessorsComponent } from './preprocessors.component';
import { PreProcessor } from 'src/app/model/core/reporting';
import { LowessPreprocessorComponent } from './lowess-preprocessor.component';

@Component({
  selector: 'parent',
  template: `
  <preprocessors>
    <performance-preprocessor source="MACD.NAV"
                              over="3"
                              unitOfTime="YEAR"
                              output="PERFORMANCE3"></performance-preprocessor>
    <regression-preprocessor source="ACC.CLOSE"
                             over="4"
                             unitOfTime="MONTH"
                             output="REGRESSION2"></regression-preprocessor>
    <lowess-preprocessor source="ACC.CLOSE"
                         over="4"
                         unitOfTime="MONTH"
                         output="REGRESSION3"></lowess-preprocessor>
  </preprocessors>`})
class TestWrapperComponent {
  @ViewChild(PreprocessorsComponent, {static: true})
  public preprocessorComponent: PreprocessorsComponent;
}

describe('ChartReportPreprocessorsComponent', () => {
  let component: PreprocessorsComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        PreprocessorsComponent,
        PerformancePreprocessorComponent,
        RegressionPreprocessorComponent,
        LowessPreprocessorComponent,
      ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.preprocessorComponent;
  });

  it('Can be instantiated', () => {
    expect(component).toBeTruthy();
  });

  it('Can contain all specified preprocessors', () => {
    let preprocessors: PreProcessor[] = component.asPreProcessors();
    expect(preprocessors).toBeTruthy();
    expect(preprocessors.length).toBe(3);
  });
});
