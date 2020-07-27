import { Component, ContentChildren, QueryList } from '@angular/core';
import { MarketTiming } from 'src/app/model/core/market-timing';
import { EMAMarketTimingComponent } from './market-timing.ema.component';
import { MACDMarketTimingComponent } from './market-timing.macd.component';
import { SuperthonMarketTimingComponent } from './market-timing.superthon.component';
import { MultipleMarketTiming } from 'src/app/model/markettiming/market-timing.multiple';

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

    return new MultipleMarketTiming(marketTimings);
  }
}
