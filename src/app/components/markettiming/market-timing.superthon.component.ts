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

  asSuperthonMarketTimingComponent(): SuperthonMarketTiming {
    return new SuperthonMarketTiming({
      id: this.id,
      periods: this.periods,
      periodLength: this.periodLength,
      status: this.status
    });
  }
}
