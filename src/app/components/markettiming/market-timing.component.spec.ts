import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { BearBull } from 'src/app/model/core/market-timing';
import { SuperthonMarketTiming } from 'src/app/model/markettiming/market-timing.superthon';
import { PeriodLength } from 'src/app/model/core/period';
import { EMAMarketTiming } from 'src/app/model/markettiming/market-timing.ema';
import { MACDMarketTiming } from 'src/app/model/markettiming/market-timing.macd';
import { MovingAverageSource, MovingAveragePreprocessing } from 'src/app/model/calculations/moving-average';
import { EMAMarketTimingComponent } from './market-timing.ema.component';
import { MarketTimingComponent } from './market-timing.component';
import { SuperthonMarketTimingComponent } from './market-timing.superthon.component';
import { MACDMarketTimingComponent } from './market-timing.macd.component';

@Component({
  selector: 'parent',
  template: 'to-be-defined'
})
class TestWrapperComponent {
  @ViewChild(MarketTimingComponent, {static: true})
  public marketTimingComponent: MarketTimingComponent;
}

describe('MarketTimingComponent', () => {
  let component: MarketTimingComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        TestWrapperComponent,
        MarketTimingComponent,
        EMAMarketTimingComponent,
        SuperthonMarketTimingComponent,
        MACDMarketTimingComponent
      ]
    });
  }));

  it('Can instantiate a Candle Filter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <market-timing>
            <candle-filter id="XX"
                           periods="10"
                           periodLength="MONTHLY"
                           threshold="3"
                           status="BEAR"></candle-filter>
          </market-timing>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.marketTimingComponent;
      let candleFilter = component.asMarketTiming() as SuperthonMarketTiming;
      expect(candleFilter.id).toBe("XX");
      expect(candleFilter.periods).toBe(10);
      expect(candleFilter.periodLength).toBe(PeriodLength.MONTHLY);
      expect(candleFilter.threshold).toBe(3);
      expect(candleFilter.bearBull()).toBe(BearBull.BEAR);
  });

  it('Can instantiate a EMA Filter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <market-timing>
            <ema-filter id="XX"
                        source="OPEN"
                        preprocessing="MEDIAN"
                        fastPeriod="7"
                        slowPeriod="14"
                        periodLength="WEEKLY"
                        status="BEAR"></ema-filter>
          </market-timing>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.marketTimingComponent;
      let emaFilter = component.asMarketTiming() as EMAMarketTiming;
      expect(emaFilter.id).toBe("XX");
      expect(emaFilter.bearBull()).toBe(BearBull.BEAR);
      expect(emaFilter.fastEMA.numberOfPeriods).toBe(7);
      expect(emaFilter.fastEMA.periodLength).toBe(PeriodLength.WEEKLY);
      expect(emaFilter.fastEMA.source).toBe(MovingAverageSource.OPEN);
      expect(emaFilter.fastEMA.preprocessing).toBe(MovingAveragePreprocessing.MEDIAN);
      expect(emaFilter.slowEMA.numberOfPeriods).toBe(14);
      expect(emaFilter.slowEMA.periodLength).toBe(PeriodLength.WEEKLY);
      expect(emaFilter.slowEMA.source).toBe(MovingAverageSource.OPEN);
      expect(emaFilter.slowEMA.preprocessing).toBe(MovingAveragePreprocessing.MEDIAN);
  });

  it('Can instantiate a MACD filter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <market-timing>
            <macd-filter id="XX"
                         source="OPEN"
                         preprocessing="MEDIAN"
                         fastPeriod="9"
                         slowPeriod="14"
                         signalPeriod="16"
                         periodLength="SEMIMONTHLY"
                         status="BEAR"></macd-filter>
          </market-timing>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.marketTimingComponent;
      let macdFilter = component.asMarketTiming() as MACDMarketTiming;
      expect(macdFilter.id).toBe("XX");
      expect(macdFilter.bearBull()).toBe(BearBull.BEAR);
      expect(macdFilter.fastEma.numberOfPeriods).toBe(9);
      expect(macdFilter.fastEma.periodLength).toBe(PeriodLength.SEMIMONTHLY);
      expect(macdFilter.fastEma.source).toBe(MovingAverageSource.OPEN);
      expect(macdFilter.fastEma.preprocessing).toBe(MovingAveragePreprocessing.MEDIAN);

      expect(macdFilter.slowEma.numberOfPeriods).toBe(14);
      expect(macdFilter.slowEma.periodLength).toBe(PeriodLength.SEMIMONTHLY);
      expect(macdFilter.slowEma.source).toBe(MovingAverageSource.OPEN);
      expect(macdFilter.slowEma.preprocessing).toBe(MovingAveragePreprocessing.MEDIAN);

      expect(macdFilter.signalEma.numberOfPeriods).toBe(16);
      expect(macdFilter.signalEma.periodLength).toBe(PeriodLength.SEMIMONTHLY);
  });
});
