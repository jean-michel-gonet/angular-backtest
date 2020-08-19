import { Component, Input } from '@angular/core';
import { BaseMarketTimingComponent } from './market-timing.base.component';
import { StopLossMarketTiming } from 'src/app/model/markettiming/market-timing.stop-loss';

@Component({
  selector: 'stop-loss',
  template: ''
})
export class StopLossMarketTimingComponent extends BaseMarketTimingComponent {
  private _safety: number;
  @Input()
  set safety(value: number) {
    if (typeof value == 'string') {
      this._safety = parseInt(value);
    } else {
      this._safety = value;
    }
  }
  get safety() {
    return this._safety;
  }

  private _recovery: number;
  @Input()
  set recovery(value: number) {
    if (typeof value == 'string') {
      this._recovery = parseFloat(value);
    } else {
      this._recovery = value;
    }
  }
  get recovery() {
    return this._recovery;
  }

  asSuperthonMarketTimingComponent(): StopLossMarketTiming {
    return new StopLossMarketTiming({
      assetName: this.assetName,
      id: this.id,
      status: this.status,
      threshold: this.threshold,
      safety: this.safety,
      recovery: this.recovery
    });
  }
}
