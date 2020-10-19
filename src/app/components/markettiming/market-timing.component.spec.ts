import { ViewChild, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { BearBull } from 'src/app/model/core/market-timing';
import { SuperthonMarketTiming } from 'src/app/model/markettiming/market-timing.superthon';
import { Periodicity } from 'src/app/model/core/period';
import { EMAMarketTiming } from 'src/app/model/markettiming/market-timing.ema';
import { MACDMarketTiming } from 'src/app/model/markettiming/market-timing.macd';
import { EMAMarketTimingComponent } from './market-timing.ema.component';
import { MarketTimingComponent } from './market-timing.component';
import { SuperthonMarketTimingComponent } from './market-timing.superthon.component';
import { MACDMarketTimingComponent } from './market-timing.macd.component';
import { MultipleMarketTiming } from 'src/app/model/markettiming/market-timing.multiple';
import { StopLossMarketTiming } from 'src/app/model/markettiming/market-timing.stop-loss';
import { StopLossMarketTimingComponent } from './market-timing.stop-loss.component';
import { ConfigurableSource, ConfigurablePreprocessing } from 'src/app/model/calculations/indicators/configurable-source';
import { RsiMarketTimingComponent } from './market-timing.rsi.component';
import { RsiMarketTiming } from 'src/app/model/markettiming/market-timing.rsi';

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
        MACDMarketTimingComponent,
        StopLossMarketTimingComponent,
        RsiMarketTimingComponent
      ]
    });
  }));

  it('Can instantiate a Candle Filter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <market-timing>
            <candle-filter assetName="ANY"
                           id="XX"
                           periods="10"
                           periodicity="MONTHLY"
                           threshold="3"
                           status="BEAR"></candle-filter>
          </market-timing>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.marketTimingComponent;
      let multipleMarketTiming = component.asMarketTiming() as MultipleMarketTiming;
      let candleFilter = multipleMarketTiming.marketTimings[0] as SuperthonMarketTiming;
      expect(candleFilter.assetName).toBe("ANY")
      expect(candleFilter.id).toBe("XX");
      expect(candleFilter.periods).toBe(10);
      expect(candleFilter.periodicity).toBe(Periodicity.MONTHLY);
      expect(candleFilter.threshold).toBe(3);
      expect(candleFilter.bearBull()).toBe(BearBull.BEAR);
  });

  it('Can instantiate a EMA Filter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <market-timing>
            <ema-filter assetName="SPY"
                        id="XX"
                        source="OPEN"
                        preprocessing="MEDIAN"
                        fastPeriod="7"
                        slowPeriod="14"
                        periodicity="WEEKLY"
                        status="BEAR"
                        threshold="1.5"
                        offset="3.3"></ema-filter>
          </market-timing>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.marketTimingComponent;
      let multipleMarketTiming = component.asMarketTiming() as MultipleMarketTiming;
      let emaFilter = multipleMarketTiming.marketTimings[0] as EMAMarketTiming;
      expect(emaFilter.assetName).toBe("SPY")
      expect(emaFilter.id).toBe("XX");
      expect(emaFilter.threshold).toBe(1.5);
      expect(emaFilter.offset).toBe(3.3);
      expect(emaFilter.bearBull()).toBe(BearBull.BEAR);
      expect(emaFilter.fastEMA.numberOfPeriods).toBe(7);
      expect(emaFilter.fastEMA.periodicity).toBe(Periodicity.WEEKLY);
      expect(emaFilter.fastEMA.source).toBe(ConfigurableSource.OPEN);
      expect(emaFilter.fastEMA.preprocessing).toBe(ConfigurablePreprocessing.MEDIAN);
      expect(emaFilter.slowEMA.numberOfPeriods).toBe(14);
      expect(emaFilter.slowEMA.periodicity).toBe(Periodicity.WEEKLY);
      expect(emaFilter.slowEMA.source).toBe(ConfigurableSource.OPEN);
      expect(emaFilter.slowEMA.preprocessing).toBe(ConfigurablePreprocessing.MEDIAN);
  });

  it('Can instantiate a MACD filter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <market-timing>
            <macd-filter assetName="MANY"
                         id="XX"
                         source="OPEN"
                         preprocessing="MEDIAN"
                         fastPeriod="9"
                         slowPeriod="14"
                         signalPeriod="16"
                         periodicity="SEMIMONTHLY"
                         status="BEAR"></macd-filter>
          </market-timing>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.marketTimingComponent;
      let multipleMarketTiming = component.asMarketTiming() as MultipleMarketTiming;
      let macdFilter = multipleMarketTiming.marketTimings[0] as MACDMarketTiming;
      expect(macdFilter.assetName).toBe("MANY");
      expect(macdFilter.id).toBe("XX");
      expect(macdFilter.bearBull()).toBe(BearBull.BEAR);
      expect(macdFilter.fastEma.numberOfPeriods).toBe(9);
      expect(macdFilter.fastEma.periodicity).toBe(Periodicity.SEMIMONTHLY);
      expect(macdFilter.fastEma.source).toBe(ConfigurableSource.OPEN);
      expect(macdFilter.fastEma.preprocessing).toBe(ConfigurablePreprocessing.MEDIAN);

      expect(macdFilter.slowEma.numberOfPeriods).toBe(14);
      expect(macdFilter.slowEma.periodicity).toBe(Periodicity.SEMIMONTHLY);
      expect(macdFilter.slowEma.source).toBe(ConfigurableSource.OPEN);
      expect(macdFilter.slowEma.preprocessing).toBe(ConfigurablePreprocessing.MEDIAN);

      expect(macdFilter.signalEma.numberOfPeriods).toBe(16);
  });

  it('Can instantiate a Stop Loss filter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <market-timing>
            <stop-loss assetName="SANY"
                       id="XX"
                       status="BEAR"
                       threshold="4"></stop-loss>
          </market-timing>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.marketTimingComponent;
      let multipleMarketTiming = component.asMarketTiming() as MultipleMarketTiming;
      let stopLossFilter = multipleMarketTiming.marketTimings[0] as StopLossMarketTiming;
      expect(stopLossFilter.assetName).toBe("SANY");
      expect(stopLossFilter.id).toBe("XX");
      expect(stopLossFilter.threshold).toBe(4);
      expect(stopLossFilter.bearBull()).toBe(BearBull.BEAR);
  });

  it('Can instantiate a RSI Filter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <market-timing>
            <rsi-filter
                  assetName="ASS"
                  id="RSIID"
                  status="BEAR"
                  source="OPEN"
                  preprocessing="MEDIAN"
                  periodicity="SEMIMONTHLY"
                  numberOfPeriods="19"
                  rsiAverage="CUTLER"
                  upperThreshold="71"
                  lowerThreshold="31"></rsi-filter>
          </market-timing>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.marketTimingComponent;
      let multipleMarketTiming = component.asMarketTiming() as MultipleMarketTiming;
      let rsiMarketTiming = multipleMarketTiming.marketTimings[0] as RsiMarketTiming;
      expect(rsiMarketTiming.assetName).toBe("ASS");
      expect(rsiMarketTiming.id).toBe("RSIID");
      expect(rsiMarketTiming.bearBull()).toBe(BearBull.BEAR);
      expect(rsiMarketTiming.rsiIndicator.source).toBe(ConfigurableSource.OPEN);
      expect(rsiMarketTiming.rsiIndicator.preprocessing).toBe(ConfigurablePreprocessing.MEDIAN);
      expect(rsiMarketTiming.rsiIndicator.periodicity).toBe(Periodicity.SEMIMONTHLY);
      expect(rsiMarketTiming.rsiIndicator.numberOfPeriods).toBe(19);
      expect(rsiMarketTiming.upperThreshold).toBe(71);
      expect(rsiMarketTiming.lowerThreshold).toBe(31);
  });

  it('Can instantiate multiple filters filter', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <market-timing>
            <candle-filter assetName="ANY"
                           id="XX"
                           periods="10"
                           periodicity="MONTHLY"
                           threshold="3"
                           status="BEAR"></candle-filter>
            <ema-filter assetName="ANY"
                        id="XX"
                        source="OPEN"
                        preprocessing="MEDIAN"
                        fastPeriod="7"
                        slowPeriod="14"
                        periodicity="WEEKLY"
                        status="BEAR"></ema-filter>
            <macd-filter assetName="ANY"
                         id="XX"
                         source="OPEN"
                         preprocessing="MEDIAN"
                         fastPeriod="9"
                         slowPeriod="14"
                         signalPeriod="16"
                         periodicity="SEMIMONTHLY"
                         status="BEAR"></macd-filter>
          </market-timing>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.marketTimingComponent;
      let multipleMarketTiming = component.asMarketTiming() as MultipleMarketTiming;
      expect(multipleMarketTiming.marketTimings.length).toBe(3);
  });
});
