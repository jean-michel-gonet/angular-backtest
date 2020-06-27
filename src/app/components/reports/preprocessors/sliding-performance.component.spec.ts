import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { SlidingPerformanceComponent } from './sliding-performance.component';
import { SlidingPerformance } from 'src/app/model/reports/preprocessors/sliding-performance';
import { UnitOfTime } from 'src/app/model/calculations/unit-of-time';

@Component({
  selector: 'parent',
  template: `
  <sliding-performance source="MACD.NAV"
                       over="3"
                       unitOfTime="YEAR"
                       output="PERFORMANCE3"></sliding-performance>`})
class TestWrapperComponent {
  @ViewChild(SlidingPerformanceComponent, {static: true})
  public slidingPerformanceComponent: SlidingPerformanceComponent;
}

describe('SlidingPerformanceComponent', () => {
  let component: SlidingPerformanceComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        TestWrapperComponent,
        SlidingPerformanceComponent
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
    let slidingPerformance: SlidingPerformance = component.asSlidingPerformance();
    expect(slidingPerformance).toBeTruthy();
    expect(slidingPerformance.source).toBe("MACD.NAV");
    expect(slidingPerformance.unitsOfTime.over).toBe(3);
    expect(slidingPerformance.unitsOfTime.unitOfTime).toBe(UnitOfTime.YEAR);
    expect(slidingPerformance.output).toBe("PERFORMANCE3");
  });
});
