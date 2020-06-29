import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { SlidingPerformanceComponent } from './sliding-performance.component';
import { SlidingPerformance } from 'src/app/model/reports/preprocessors/sliding-performance';
import { PreprocessorsComponent } from './preprocessors.component';
import { PreProcessor } from 'src/app/model/core/reporting';
import { UnitOfTime } from 'src/app/model/reports/preprocessors/unit-of-time';

@Component({
  selector: 'parent',
  template: `
  <preprocessors>
    <sliding-performance source="MACD.NAV"
                         over="3"
                         unitOfTime="YEAR"
                         output="PERFORMANCE3"></sliding-performance>
  </preprocessors>`})
class TestWrapperComponent {
  @ViewChild(PreprocessorsComponent, {static: true})
  public chartReportPreprocessorsComponent: PreprocessorsComponent;
}

describe('ChartReportPreprocessorsComponent', () => {
  let component: PreprocessorsComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        PreprocessorsComponent,
        SlidingPerformanceComponent
      ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.chartReportPreprocessorsComponent;
  });

  it('Can be instantiated', () => {
    expect(component).toBeTruthy();
  });

  it('Can instantiate a SlidingPerformance preprocessor', () => {
    let preProcessors: PreProcessor[] = component.asPreProcessors();
    expect(preProcessors).toBeTruthy();

    let slidingPerformance: SlidingPerformance = <SlidingPerformance>preProcessors[0];

    expect(slidingPerformance.source).toBe("MACD.NAV");
    expect(slidingPerformance.unitsOfTime.over).toBe(3);
    expect(slidingPerformance.unitsOfTime.unitOfTime).toBe(UnitOfTime.YEAR);
    expect(slidingPerformance.output).toBe("PERFORMANCE3");
  });
});
