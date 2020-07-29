import { EMAMarketTiming } from 'src/app/model/markettiming/market-timing.ema';
import { BaseMarketTimingComponent } from './market-timing.base.component';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ema-filter',
  template: ''
})
export class EMAMarketTimingComponent extends BaseMarketTimingComponent {

  private _offset: number;
  @Input()
  set offset(value: number) {
    if (typeof value == 'string') {
      this._offset = parseFloat(value);
    } else {
      this._offset = value;
    }
  }
  get offset() {
    return this._offset;
  }

  private _fastPeriod: number;
  @Input()
  set fastPeriod(value: number) {
    if (typeof value == 'string') {
      this._fastPeriod = parseInt(value);
    } else {
      this._fastPeriod = value;
    }
  }
  get fastPeriod() {
    return this._fastPeriod;
  }

  private _slowPeriod: number;
  @Input()
  set slowPeriod(value: number) {
    if (typeof value == 'string') {
      this._slowPeriod = parseInt(value);
    } else {
      this._slowPeriod = value;
    }
  }
  get slowPeriod() {
    return this._slowPeriod;
  }

  asEmaMarketTiming(): EMAMarketTiming {
    return new EMAMarketTiming({
      id: this.id,
      source: this._source,
      preprocessing: this._preprocessing,
      periodLength: this.periodLength,
      fastPeriod: this.fastPeriod,
      slowPeriod: this.slowPeriod,
      status: this.status,
      threshold: this.threshold,
      offset: this.offset
    });
  }
}
