import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { SlidingPerformanceComponent } from './sliding-performance.component';
import { SlidingPerformance } from 'src/app/model/reports/preprocessors/sliding-performance';
import { UnitOfTime } from 'src/app/model/core/unit-of-time';
import { ChartReportPreprocessorsComponent } from './chart-report-preprocessors.component';
import { PreProcessor } from 'src/app/model/core/reporting';

@Component({
  selector: 'parent',
  template: `
  <chart-report-preprocessors>
    <sliding-performance source="MACD.NAV"
                         over="3"
                         unitOfTime="YEAR"
                         output="PERFORMANCE3"></sliding-performance>
  </chart-report-preprocessors>`})
class TestWrapperComponent {
  @ViewChild(ChartReportPreprocessorsComponent, {static: true})
  public chartReportPreprocessorsComponent: ChartReportPreprocessorsComponent;
}

describe('ChartReportPreprocessorsComponent', () => {
  let component: ChartReportPreprocessorsComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        ChartReportPreprocessorsComponent,
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
