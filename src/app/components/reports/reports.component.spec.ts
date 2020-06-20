import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NullReport, Report } from 'src/app/model/core/reporting';
import { Ng2ChartReportFactory } from 'src/app/model/reports/ng2-chart.report';
import { ChartReportPreprocessorsComponent } from './preprocessors/chart-report-preprocessors.component';
import { SlidingPerformanceComponent } from './preprocessors/sliding-performance.component';
import { ReportsComponent } from './reports.component';
import { Reports } from 'src/app/model/reports/reports';
import { ChartReportComponent } from './chart-report/chart-report.component';
import { ChartReportConfigurationComponent } from './chart-report/chart-report-configuration.component';

@Component({
  selector: 'parent',
  template: `
  <reports>
    <chart-report></chart-report>
    <preprocessors></preprocessors>
  </reports>`
})
class TestWrapperComponent {
  @ViewChild(ReportsComponent, {static: true})
  public reportsComponent: ReportsComponent;
}
class TestReportFactory {
  public newInstance() : Report {
    return new NullReport();
  }
}

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        ReportsComponent,
        ChartReportComponent,
        ChartReportConfigurationComponent,
        ChartReportPreprocessorsComponent,
        SlidingPerformanceComponent,
      ],
      providers: [
        { provide: Ng2ChartReportFactory, useClass: TestReportFactory }
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
    expect(reports.reports.length).toBe(1);
    expect(reports.preProcessors).toBeTruthy();
  });
});
