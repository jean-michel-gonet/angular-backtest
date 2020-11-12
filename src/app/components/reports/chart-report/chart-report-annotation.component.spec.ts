import { Component, ViewChild, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChartReportAnnotationComponent } from './chart-report-annotation.component';

@Component({
  selector: 'parent',
  template: `
  <chart-report-annotation show="XX"
                           color="blue"></chart-report-annotation>`})
class TestWrapperComponent {
    @ViewChild(ChartReportAnnotationComponent, {static: true})
    public chartReportAnnotationComponent: ChartReportAnnotationComponent
}

describe('ChartReportAnnotationComponent', () => {
  let component: ChartReportAnnotationComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        ChartReportAnnotationComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.chartReportAnnotationComponent;
  });

  it('Should work', () => {
    expect(component.asNg2ChartAnnotation()).toEqual({
      show: "XX",
      color: "blue"
    });
  });
});
