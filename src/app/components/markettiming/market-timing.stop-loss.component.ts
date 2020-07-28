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

  private _threshold: number;
  @Input()
  set threshold(value: number) {
    if (typeof value == 'string') {
      this._threshold = parseInt(value);
    } else {
      this._threshold = value;
    }
  }
  get threshold(): number {
    return this._threshold;
  }

  asSuperthonMarketTimingComponent(): StopLossMarketTiming {
    return new StopLossMarketTiming({
      id: this.id,
      safety: this.safety,
      threshold: this.threshold,
      status: this.status
    });
  }
}
