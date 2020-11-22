import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { HighchartsReportComponent } from './highcharts-report.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChartReportConfigurationComponent } from './chart-report-configuration.component';
import { ChartReportAnnotationComponent } from './chart-report-annotation.component';
import { Report, ReportedData, Reporter } from 'src/app/model/core/reporting';

@Component({
  selector: 'parent',
  template: 'to-be-defined'
})
class TestWrapperComponent {
  @ViewChild(HighchartsReportComponent, {static: true})
  public component: HighchartsReportComponent;
}
describe('HighchartsReportComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        TestWrapperComponent,
        HighchartsReportComponent,
        ChartReportConfigurationComponent,
        ChartReportAnnotationComponent
      ]
    });
  }));

  it('Can instantiate a Highcharts report', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <highcharts-report title="Superthon Semimontly 13" start="2009-10-11" end="2010-11-12">
            <chart-report-configuration show="USDCHF.CLOSE"  showDataAs="LINE" showDataOn="LEFT"></chart-report-configuration>
            <chart-report-annotation show="MT.BULL" color="blue"></chart-report-annotation>
          </highcharts-report>`
        }
      }).compileComponents();

      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      let component = fixture.componentInstance.component;
      expect(component.title).toBe("Superthon Semimontly 13")
      expect(component.start).toEqual(new Date(2009, 10 - 1, 11))
      expect(component.end).toEqual(new Date(2010, 11 - 1, 12))
      expect(component.configurationComponents.length).toBe(1);
      expect(component.annotationComponents.length).toBe(1);
  });

  class ReporterMock implements Reporter {
    private y: number;
    public instant: Date;

    constructor(public sourceName: string) {}

    public setY(y: number): void {
      this.y = y;
    }

    doRegister(report: Report): void {
      report.register(this);
    }
    startReportingCycle(instant: Date): void {
      this.instant = instant;
    }
    reportTo(report: Report): void {
      report.receiveData(new ReportedData({sourceName: this.sourceName, y: this.y}));
    }
  }

  let today = new Date(2015, 8, 18);
  let tomorrow = new Date(2015, 8, 19);

  it('Can follow the correct workflow with 1 reporter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <highcharts-report>
            <chart-report-configuration show="USDCHF.CLOSE"  showDataAs="LINE" showDataOn="LEFT"></chart-report-configuration>
          </highcharts-report>`
        }
      }).compileComponents();

    const fixture: ComponentFixture<TestWrapperComponent>
      = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    let component = fixture.componentInstance.component;

    let reporter: ReporterMock = new ReporterMock("USDCHF.CLOSE");

    reporter.doRegister(component);

    component.startReportingCycle(today);
    reporter.setY(100);
    component.collectReports();

    component.startReportingCycle(tomorrow);
    reporter.setY(101);
    component.collectReports();

    component.completeReport();

    expect(component.options.series[0].data).toEqual(jasmine.arrayWithExactContents([
          [today.valueOf(), 100],
          [tomorrow.valueOf(), 101]
        ]));
    expect(component.options.series[0].yAxis).toEqual("USDCHF.CLOSE");
    expect(component.options.yAxis[0].title.text).toEqual("USDCHF.CLOSE");
  });

  it('Can follow the correct workflow with 2 reporter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <highcharts-report>
            <chart-report-configuration show="SQA01.NAV"  showDataAs="LINE" showDataOn="LEFT"></chart-report-configuration>
            <chart-report-configuration show="SQA01.COSTS"  showDataAs="LINE" showDataOn="RIGHT"></chart-report-configuration>
          </highcharts-report>`
        }
      }).compileComponents();

    const fixture: ComponentFixture<TestWrapperComponent>
      = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    let component = fixture.componentInstance.component;

    let reporter1: ReporterMock = new ReporterMock("SQA01.NAV");
    let reporter2: ReporterMock = new ReporterMock("SQA01.COSTS");
    reporter1.doRegister(component);
    reporter2.doRegister(component);

    component.startReportingCycle(today);
    reporter1.setY(100);
    reporter2.setY(1);
    component.collectReports();

    component.startReportingCycle(tomorrow);
    reporter1.setY(101);
    reporter2.setY(3);
    component.collectReports();

    component.completeReport();

    expect(component.options.series[0].data).toEqual(jasmine.arrayWithExactContents([
          [today.valueOf(), 100],
          [tomorrow.valueOf(), 101]
        ]));
    expect(component.options.series[1].data).toEqual(jasmine.arrayWithExactContents([
          [today.valueOf(), 1],
          [tomorrow.valueOf(), 3]
        ]));
    expect(component.options.series[1].yAxis).toEqual("SQA01.COSTS");
    expect(component.options.yAxis[1].opposite).toEqual(true);
  });

  it("Can handle annotations", () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <highcharts-report>
            <chart-report-configuration show="SQA01.NAV"  showDataAs="LINE" showDataOn="LEFT"></chart-report-configuration>
            <chart-report-annotation show="MT.BULL" color="blue"></chart-report-annotation>
            <chart-report-annotation show="MT.BEAR" color="red"></chart-report-annotation>
          </highcharts-report>`
        }
      }).compileComponents();

    const fixture: ComponentFixture<TestWrapperComponent>
      = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    let component = fixture.componentInstance.component;

    let reporter1: ReporterMock = new ReporterMock("SQA01.NAV");
    let reporter2: ReporterMock = new ReporterMock("MT.BULL");
    let reporter3: ReporterMock = new ReporterMock("MT.BEAR");

    reporter1.doRegister(component);
    reporter2.doRegister(component);
    reporter3.doRegister(component);

    component.startReportingCycle(today);
    reporter1.setY(100);
    reporter2.setY(null);
    reporter3.setY(null);
    component.collectReports();

    component.completeReport();

    expect(component.options.xAxis.plotLines).toHaveSize(2);
    expect(component.options.xAxis.plotLines[0].color).toBe("blue");
    expect(component.options.xAxis.plotLines[1].color).toBe("red");
  });
});
