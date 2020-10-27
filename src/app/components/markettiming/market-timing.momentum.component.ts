import { Component, Input } from '@angular/core';
import { BaseMarketTimingComponent } from './market-timing.base.component';
import { MomentumMarketTiming } from 'src/app/model/markettiming/market-timing.momentum';

@Component({
  selector: 'momentum-filter',
  template: ''
})
export class MomentumMarketTimingComponent extends BaseMarketTimingComponent {

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

  private _upperThreshold: number;
  @Input()
  set upperThreshold(value: number) {
    if (typeof value == 'string') {
      this._upperThreshold = parseFloat(value);
    } else {
      this._upperThreshold = value;
    }
  }
  get upperThreshold() {
    return this._upperThreshold;
  }

  private _lowerThreshold: number;
  @Input()
  set lowerThreshold(value: number) {
    if (typeof value == 'string') {
      this._lowerThreshold = parseFloat(value);
    } else {
      this._lowerThreshold = value;
    }
  }
  get lowerThreshold() {
    return this._lowerThreshold;
  }

  asMomentumMarketTiming(): MomentumMarketTiming {
    return new MomentumMarketTiming({
      assetName: this.assetName,
      id: this.id,
      status: this.status,
      source: this.source,
      preprocessing: this.preprocessing,
      periodicity: this.periodicity,
      numberOfPeriods: this.numberOfPeriods,
      upperThreshold: this.upperThreshold,
      lowerThreshold: this.lowerThreshold
    });
  }
}
