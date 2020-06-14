import { Component, Input } from '@angular/core';
import { BaseMarketTimingComponent } from './market-timing.base.component';
import { SuperthonMarketTiming } from 'src/app/model/markettiming/market-timing.superthon';

@Component({
  selector: 'candle-filter',
  template: ''
})
export class SuperthonMarketTimingComponent extends BaseMarketTimingComponent {
  private _periods: number;
  @Input()
  set periods(value: number) {
    if (typeof value == 'string') {
      this._periods = parseInt(value);
    } else {
      this._periods = value;
    }
  }
  get periods() {
    return this._periods;
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

  asSuperthonMarketTimingComponent(): SuperthonMarketTiming {
    return new SuperthonMarketTiming({
      id: this.id,
      periods: this.periods,
      periodLength: this.periodLength,
      threshold: this.threshold,
      status: this.status
    });
  }
}
