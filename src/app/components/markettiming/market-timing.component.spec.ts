import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { MarketTimingComponent,
  EMAMarketTimingComponent,
  SuperthonMarketTimingComponent,
  MACDMarketTimingComponent } from './market-timing.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { BearBull } from 'src/app/model/core/market-timing';
import { SuperthonMarketTiming } from 'src/app/model/markettiming/market-timing.superthon';
import { PeriodLength } from 'src/app/model/core/period';
import { EMAMarketTiming } from 'src/app/model/markettiming/market-timing.ema';
import { MACDMarketTiming } from 'src/app/model/markettiming/market-timing.macd';
import { MovingAverageSource, MovingAveragePreprocessing } from 'src/app/model/core/moving-average';

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
      expect(candleFilter.bearBull()).toBe(BearBull.BEAR);
      expect(candleFilter.periods).toBe(10);
      expect(candleFilter.periodLength).toBe(PeriodLength.MONTHLY);
  });

  it('Can instantiate a EMA Filter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <market-timing>
            <ema-filter id="XX"
                        source="OPEN"
                        preprocessing="MEDIAN"
                        shortPeriod="7"
                        longPeriod="14"
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
      expect(emaFilter.shortEMA.numberOfPeriods).toBe(7);
      expect(emaFilter.shortEMA.periodLength).toBe(PeriodLength.WEEKLY);
      expect(emaFilter.shortEMA.source).toBe(MovingAverageSource.OPEN);
      expect(emaFilter.shortEMA.preprocessing).toBe(MovingAveragePreprocessing.MEDIAN);
      expect(emaFilter.longEMA.numberOfPeriods).toBe(14);
      expect(emaFilter.longEMA.periodLength).toBe(PeriodLength.WEEKLY);
      expect(emaFilter.longEMA.source).toBe(MovingAverageSource.OPEN);
      expect(emaFilter.longEMA.preprocessing).toBe(MovingAveragePreprocessing.MEDIAN);
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
