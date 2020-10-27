import { Component, Input } from '@angular/core';
import { BaseMarketTimingComponent } from './market-timing.base.component';
import { MACDMarketTiming } from 'src/app/model/markettiming/market-timing.macd';

@Component({
  selector: 'macd-filter',
  template: ''
})
export class MACDMarketTimingComponent extends BaseMarketTimingComponent {

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

  private _signalPeriod: number;
  @Input()
  set signalPeriod(value: number) {
    if (typeof value == 'string') {
      this._signalPeriod = parseInt(value);
    } else {
      this._signalPeriod = value;
    }
  }
  get signalPeriod() {
    return this._signalPeriod;
  }

  asMACDMarketTiming(): MACDMarketTiming {
    return new MACDMarketTiming({
      assetName: this.assetName,
      id: this.id,
      source: this._source,
      preprocessing: this._preprocessing,
      periodicity: this.periodicity,
      fastPeriod: this.fastPeriod,
      slowPeriod: this.slowPeriod,
      signalPeriod: this.signalPeriod,
      status: this.status
    });
  }
}
