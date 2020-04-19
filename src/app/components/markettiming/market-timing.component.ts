import { Component, Input, ContentChild } from '@angular/core';
import { MarketTiming } from 'src/app/model/core/market-timing';
import { EMAMarketTimingComponent } from './market-timing.ema.component';
import { MACDMarketTimingComponent } from './market-timing.macd.component';
import { SuperthonMarketTimingComponent } from './market-timing.superthon.component';

@Component({
  selector: 'market-timing',
  template: '<ng-content></ng-content>'
})
export class MarketTimingComponent {
  @ContentChild(EMAMarketTimingComponent, {static: true})
  private emaFilter: EMAMarketTimingComponent;

  @ContentChild(MACDMarketTimingComponent, {static: true})
  private macdFilter: MACDMarketTimingComponent;

  @ContentChild(SuperthonMarketTimingComponent, {static: true})
  private candleFilter: SuperthonMarketTimingComponent;

  public asMarketTiming(): MarketTiming {
    if (this.emaFilter) {
      return this.emaFilter.asEmaMarketTiming();
    } else if (this.macdFilter) {
      return this.macdFilter.asMACDMarketTiming();
    } else if (this.candleFilter) {
      return this.candleFilter.asSuperthonMarketTimingComponent();
    } else {
      throw new Error('<market-timing> should contain one of <macd-filter>, <ema-filter> or <candle-filter>');
    }
  }
}
