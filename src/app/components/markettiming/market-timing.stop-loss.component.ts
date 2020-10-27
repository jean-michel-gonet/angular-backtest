import { Component, Input } from '@angular/core';
import { BaseMarketTimingComponent } from './market-timing.base.component';
import { StopLossMarketTiming } from 'src/app/model/markettiming/market-timing.stop-loss';

@Component({
  selector: 'stop-loss',
  template: ''
})
export class StopLossMarketTimingComponent extends BaseMarketTimingComponent {
  private _numberOfPeriods: number;
  @Input()
  set numberOfPeriods(value: number) {
    if (typeof value == 'string') {
      this._numberOfPeriods = parseInt(value);
    } else {
      this._numberOfPeriods = value;
    }
  }
  get numberOfPeriods() {
    return this._numberOfPeriods;
  }


  asSuperthonMarketTimingComponent(): StopLossMarketTiming {
    return new StopLossMarketTiming({
      assetName: this.assetName,
      id: this.id,
      status: this.status,
      threshold: this.threshold,
      numberOfPeriods: this.numberOfPeriods
    });
  }
}
