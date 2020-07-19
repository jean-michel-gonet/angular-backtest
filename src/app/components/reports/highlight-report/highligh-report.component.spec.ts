import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { HighlightReportComponent } from './highlight-report.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { HighlightMaxComponent, HighlightMinComponent } from './highlight.component';

@Component({
  selector: 'parent',
  template: `
  <highlight-report>
    <highlight-max sourceName="SMAX"></highlight-max>
    <highlight-min sourceName="SMIN"></highlight-min>
  <highlight-report>`})
class TestWrapperComponent {
  @ViewChild(HighlightReportComponent, {static: true})
  public highlightReportComponent: HighlightReportComponent;
}

describe('HighlightReportComponent', () => {
  let component: HighlightReportComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        HighlightReportComponent,
        HighlightMaxComponent,
        HighlightMinComponent
      ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.highlightReportComponent;
  });

  it('Can be instantiated', () => {
    expect(component).toBeTruthy();
    expect(component.highlightComponents.toArray().length).toBe(2);
  });
});
