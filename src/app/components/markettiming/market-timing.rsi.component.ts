import { Component, Input } from '@angular/core';
import { BaseMarketTimingComponent } from './market-timing.base.component';
import { RsiMarketTiming } from 'src/app/model/markettiming/market-timing.rsi';
import { RsiAverage } from 'src/app/model/calculations/indicators/rsi-indicator';

@Component({
  selector: 'rsi-filter',
  template: ''
})
export class RsiMarketTimingComponent extends BaseMarketTimingComponent {

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

  protected _rsiAverage: RsiAverage;
  @Input()
  set rsiAverage(value: RsiAverage) {
    if (typeof value == 'string') {
      this._rsiAverage = RsiAverage[value];
    } else {
      this._rsiAverage = value;
    }
  }
  get rsiAverage() {
    return this._rsiAverage;
  }


  private _upperThreshold: number;
  @Input()
  set upperThreshold(value: number) {
    if (typeof value == 'string') {
      this._upperThreshold = parseInt(value);
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
      this._lowerThreshold = parseInt(value);
    } else {
      this._lowerThreshold = value;
    }
  }
  get lowerThreshold() {
    return this._lowerThreshold;
  }

  asRsiMarketTiming(): RsiMarketTiming {
    return new RsiMarketTiming({
      assetName: this.assetName,
      id: this.id,
      status: this.status,
      source: this.source,
      preprocessing: this.preprocessing,
      periodLength: this.periodLength,
      numberOfPeriods: this.numberOfPeriods,
      rsiAverage: this.rsiAverage,
      upperThreshold: this.upperThreshold,
      lowerThreshold: this.lowerThreshold
    });
  }
}
