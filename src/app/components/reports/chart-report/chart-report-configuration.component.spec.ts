import { Component, ViewChild, NO_ERRORS_SCHEMA } from "@angular/core";
import { ChartReportConfigurationComponent } from './chart-report-configuration.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ShowDataAs, ShowDataOn } from 'src/app/model/reports/chart-report';

@Component({
  selector: 'parent',
  template: `
  <chart-report-configuration show="XX"
                              showDataAs="LINE"
                              showDataOn="RIGHT"
                              normalize="true"></chart-report-configuration>`})
class TestWrapperComponent {
    @ViewChild(ChartReportConfigurationComponent, {static: true})
    public chartReportConfigurationComponent: ChartReportConfigurationComponent
}

describe('ChartReportConfigurationComponent', () => {
  let component: ChartReportConfigurationComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        ChartReportConfigurationComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.chartReportConfigurationComponent;
  });

  it('Should work', () => {
    expect(component.asNg2ChartConfiguration()).toEqual({
      show: "XX",
      as: ShowDataAs.LINE,
      on: ShowDataOn.RIGHT,
      normalize: true
    });
  });
});
