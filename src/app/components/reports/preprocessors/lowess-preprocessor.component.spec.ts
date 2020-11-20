import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LowessPreprocessor } from 'src/app/model/reports/preprocessors/lowess-preprocessor';
import { UnitOfTime } from 'src/app/model/reports/preprocessors/unit-of-time';
import { LowessPreprocessorComponent } from './lowess-preprocessor.component';

@Component({
  selector: 'parent',
  template: `
  <lowess-preprocessor source="MACD.NAV"
                            over="3"
                            unitOfTime="YEAR"
                            output="PERFORMANCE3"></lowess-preprocessor>`})
class TestWrapperComponent {
  @ViewChild(LowessPreprocessorComponent, {static: true})
  public slidingPerformanceComponent: LowessPreprocessorComponent;
}

describe('SlidingPerformanceComponent', () => {
  let component: LowessPreprocessorComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        LowessPreprocessorComponent
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
    let lowessPreprocessor: LowessPreprocessor = component.asLowessPreprocessor();
    expect(lowessPreprocessor).toBeTruthy();
    expect(lowessPreprocessor.source).toBe("MACD.NAV");
    expect(lowessPreprocessor.unitsOfTime.over).toBe(3);
    expect(lowessPreprocessor.unitsOfTime.unitOfTime).toBe(UnitOfTime.YEAR);
    expect(lowessPreprocessor.output).toBe("PERFORMANCE3");
  });
});
