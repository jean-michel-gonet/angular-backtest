import { Component } from '@angular/core';
import { BaseMarketTimingComponent } from './market-timing.base.component';
import { StopLossMarketTiming } from 'src/app/model/markettiming/market-timing.stop-loss';

@Component({
  selector: 'stop-loss',
  template: ''
})
export class StopLossMarketTimingComponent extends BaseMarketTimingComponent {
  asSuperthonMarketTimingComponent(): StopLossMarketTiming {
    return new StopLossMarketTiming({
      assetName: this.assetName,
      id: this.id,
      status: this.status,
      threshold: this.threshold
    });
  }
}
