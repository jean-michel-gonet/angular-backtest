import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PreprocessorsComponent } from './preprocessors/preprocessors.component';
import { PerformancePreprocessorComponent } from './preprocessors/performance-preprocessor.component';
import { ReportsComponent } from './reports.component';
import { Reports } from 'src/app/model/reports/reports';
import { ChartReportConfigurationComponent } from './chart-report/chart-report-configuration.component';
import { HighlightReportComponent } from './highlight-report/highlight-report.component';
import { HighchartsReportComponent } from './chart-report/highcharts-report.component';

@Component({
  selector: 'parent',
  template: `
  <reports>
    <highcharts-report></highcharts-report>
    <highlight-report></highlight-report>
    <preprocessors></preprocessors>
  </reports>`
})
class TestWrapperComponent {
  @ViewChild(ReportsComponent, {static: true})
  public reportsComponent: ReportsComponent;
}

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        HighlightReportComponent,
        ReportsComponent,
        HighchartsReportComponent,
        ChartReportConfigurationComponent,
        PreprocessorsComponent,
        PerformancePreprocessorComponent,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.reportsComponent;
  });

  it('Can be instantiated', () => {
    expect(component).toBeTruthy();
  });

  it('Can propagate configuration to the chart', () => {
    let reports: Reports = component.asReports();
    expect(reports).toBeTruthy();
    expect(reports.reports.length).toBe(2);
    expect(reports.preProcessors).toBeTruthy();
  });
});
