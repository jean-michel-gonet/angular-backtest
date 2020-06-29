import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { PerformancePreprocessorComponent } from './performance-preprocessor.component';
import { PerformancePreprocessor } from 'src/app/model/reports/preprocessors/performance-preprocessor';
import { UnitOfTime } from 'src/app/model/reports/preprocessors/unit-of-time';

@Component({
  selector: 'parent',
  template: `
  <performance-preprocessor source="MACD.NAV"
                            over="3"
                            unitOfTime="YEAR"
                            output="PERFORMANCE3"></performance-preprocessor>`})
class TestWrapperComponent {
  @ViewChild(PerformancePreprocessorComponent, {static: true})
  public slidingPerformanceComponent: PerformancePreprocessorComponent;
}

describe('SlidingPerformanceComponent', () => {
  let component: PerformancePreprocessorComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        PerformancePreprocessorComponent
      ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.slidingPerformanceComponent;
  });

  it('Can be instantiated', () => {
    expect(component).toBeTruthy();
  });

  it('Can instantiate a SlidingPerformance preprocessor', () => {
    let performancePreprocessor: PerformancePreprocessor = component.asPerformancePreprocessor();
    expect(performancePreprocessor).toBeTruthy();
    expect(performancePreprocessor.source).toBe("MACD.NAV");
    expect(performancePreprocessor.unitsOfTime.over).toBe(3);
    expect(performancePreprocessor.unitsOfTime.unitOfTime).toBe(UnitOfTime.YEAR);
    expect(performancePreprocessor.output).toBe("PERFORMANCE3");
  });
});
