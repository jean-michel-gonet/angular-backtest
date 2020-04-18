import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ChartReportComponent } from './chart-report.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { ChartReportConfigurationComponent } from './chart-report-configuration.component';
import { Report, Reporter, ReportedData } from 'src/app/model/core/reporting';
import { Ng2ChartReport, ShowDataAs, ShowDataOn, INg2ChartReport } from 'src/app/model/reports/ng2-chart.report';

@Component({
  selector: 'parent',
  template: `
  <chart-report start="2020-12-25" end="2021-11-13">
    <chart-report-configuration show="XX"
                                showDataAs="LINE"
                                showDataOn="RIGHT"
                                normalize="true"></chart-report-configuration>
  </chart-report>`})
class TestWrapperComponent {
  @ViewChild(ChartReportComponent, {static: true})
  public chartReportComponent: ChartReportComponent;
}

class TestReport implements Report {
  public configuration: INg2ChartReport;

  public registeredReporter: Reporter;
  public startedReportingCycle: Date;
  public reportsHaveBeenCollected: boolean = false;
  public reportHasBeenCompleted: boolean = false;

  initialize(configuration: INg2ChartReport): void {
    this.configuration = configuration;
  }

  register(reporter: Reporter): void {
    this.registeredReporter = reporter;
  }

  startReportingCycle(instant: Date): void {
    this.startedReportingCycle = instant;
  }

  collectReports(): void {
    this.reportsHaveBeenCollected = true;
  }

  receiveData(providedData: ReportedData): void {
    throw new Error("Method not implemented.");
  }

  completeReport(): void {
    this.reportHasBeenCompleted = true;
  }
}

class TestReporter implements Reporter {
  doRegister(report: Report): void {
    report.register(this);
  }

  startReportingCycle(instant: Date): void {
  }

  reportTo(report: Report): void {
  }
}

describe('ChartReportComponent', () => {
  let component: ChartReportComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let testReport: TestReport;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        ChartReportConfigurationComponent,
        ChartReportComponent
      ],
      providers: [
        { provide: Ng2ChartReport, useClass: TestReport }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.chartReportComponent;
    testReport = TestBed.get(Ng2ChartReport);
  });

  it('Can be instantiated', () => {
    expect(component).toBeTruthy();
  });

  it('Passes the configuration to the inner report', () => {
    expect(testReport.configuration.start).toEqual(new Date(2020, 12 - 1, 25));
    expect(testReport.configuration.end).toEqual(new Date(2021, 11 - 1, 13));
    expect(testReport.configuration.configurations).toEqual(jasmine.arrayWithExactContents([
      {
        show: "XX",
        as: ShowDataAs.LINE,
        on: ShowDataOn.RIGHT,
        normalize: true
      }]));
  });

  it('Acts as a façade to the inner report', () => {
    let testReporter: Reporter = new TestReporter();
    component.register(testReporter);
    expect(testReport.registeredReporter).toBe(testReporter);

    let instant: Date = new Date();
    component.startReportingCycle(instant);
    expect(testReport.startedReportingCycle).toBe(instant);

    expect(testReport.reportsHaveBeenCollected).toBe(false);
    component.collectReports();
    expect(testReport.reportsHaveBeenCollected).toBe(true);

    expect(testReport.reportHasBeenCompleted).toBe(false);
    component.completeReport();
    expect(testReport.reportHasBeenCompleted).toBe(true);
  });
});
