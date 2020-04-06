import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { MarketTimingComponent, EMAMarketTimingComponent, SuperthonMarketTimingComponent, MACDMarketTimingComponent } from './market-timing.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { BearBull } from 'src/app/model/core/market-timing';
import { SuperthonMarketTiming } from 'src/app/model/markettiming/market-timing.superthon';
import { PeriodLength } from 'src/app/model/core/period';
import { EMAMarketTiming } from 'src/app/model/markettiming/market-timing.ema';
import { MACDMarketTiming } from 'src/app/model/markettiming/market-timing.macd';

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
      expect(emaFilter.shortPeriod).toBe(7);
      expect(emaFilter.longPeriod).toBe(14);
      expect(emaFilter.periodLength).toBe(PeriodLength.WEEKLY);
  });

  it('Can instantiate a MACD filter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <market-timing>
            <macd-filter id="XX"
                         shortPeriod="9"
                         longPeriod="14"
                         triggerPeriod="16"
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
      expect(macdFilter.shortPeriod).toBe(9);
      expect(macdFilter.longPeriod).toBe(14);
      expect(macdFilter.triggerPeriod).toBe(16);
      expect(macdFilter.periodLength).toBe(PeriodLength.SEMIMONTHLY);
  });
});
