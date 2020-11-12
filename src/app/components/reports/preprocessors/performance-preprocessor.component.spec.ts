import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegressionPreprocessorComponent } from './regression-preprocessor.component';
import { RegressionPreprocessor } from 'src/app/model/reports/preprocessors/regression-preprocessor';
import { UnitOfTime } from 'src/app/model/reports/preprocessors/unit-of-time';

@Component({
  selector: 'parent',
  template: `
  <regression-preprocessor source="MACD.NAV"
                           over="3"
                           unitOfTime="YEAR"
                           output="REGRESSION3"></regression-preprocessor>`})
class TestWrapperComponent {
  @ViewChild(RegressionPreprocessorComponent, {static: true})
  public regressionPreprocessorComponent: RegressionPreprocessorComponent;
}

describe('RegressionPreprocessorComponent', () => {
  let component: RegressionPreprocessorComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        RegressionPreprocessorComponent
      ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.regressionPreprocessorComponent;
  });

  it('Can be instantiated', () => {
    expect(component).toBeTruthy();
  });

  it('Can instantiate a SlidingPerformance preprocessor', () => {
    let regressionPreprocessor: RegressionPreprocessor = component.asRegressionPreprocessor();
    expect(regressionPreprocessor).toBeTruthy();
    expect(regressionPreprocessor.source).toBe("MACD.NAV");
    expect(regressionPreprocessor.unitsOfTime.over).toBe(3);
    expect(regressionPreprocessor.unitsOfTime.unitOfTime).toBe(UnitOfTime.YEAR);
    expect(regressionPreprocessor.output).toBe("REGRESSION3");
  });
});
