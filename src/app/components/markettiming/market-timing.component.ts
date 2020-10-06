import { Component, ContentChildren, QueryList } from '@angular/core';
import { MarketTiming } from 'src/app/model/core/market-timing';
import { EMAMarketTimingComponent } from './market-timing.ema.component';
import { MACDMarketTimingComponent } from './market-timing.macd.component';
import { SuperthonMarketTimingComponent } from './market-timing.superthon.component';
import { StopLossMarketTimingComponent } from './market-timing.stop-loss.component';
import { MultipleMarketTiming } from 'src/app/model/markettiming/market-timing.multiple';
import { RsiMarketTimingComponent } from './market-timing.rsi.component';

@Component({
  selector: 'market-timing',
  template: '<ng-content></ng-content>'
})
export class MarketTimingComponent {
  @ContentChildren(EMAMarketTimingComponent)
  private emaFilter: QueryList<EMAMarketTimingComponent>;

  @ContentChildren(MACDMarketTimingComponent)
  private macdFilter: QueryList<MACDMarketTimingComponent>;

  @ContentChildren(SuperthonMarketTimingComponent)
  private candleFilter: QueryList<SuperthonMarketTimingComponent>;

  @ContentChildren(StopLossMarketTimingComponent)
  private stopLossFilter: QueryList<StopLossMarketTimingComponent>;

  @ContentChildren(RsiMarketTimingComponent)
  private risFilter: QueryList<RsiMarketTimingComponent>;

  public asMarketTiming(): MarketTiming {
    let marketTimings: MarketTiming[] = [];

    this.emaFilter.forEach(f => {
      marketTimings.push(f.asEmaMarketTiming());
    });

    this.macdFilter.forEach(f => {
      marketTimings.push(f.asMACDMarketTiming());
    });

    this.candleFilter.forEach(f => {
      marketTimings.push(f.asSuperthonMarketTimingComponent());
    });

    this.stopLossFilter.forEach(f => {
      marketTimings.push(f.asSuperthonMarketTimingComponent());
    });

    this.risFilter.forEach(f => {
      marketTimings.push(f.asRsiMarketTiming());
    });

    return new MultipleMarketTiming(marketTimings);
  }
}
