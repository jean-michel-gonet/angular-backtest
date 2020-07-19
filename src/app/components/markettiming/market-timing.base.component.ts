import { Input } from "@angular/core";
import { MovingAverageSource, MovingAveragePreprocessing } from 'src/app/model/calculations/moving-average';
import { PeriodLength } from 'src/app/model/core/period';
import { BearBull } from 'src/app/model/core/market-timing';

export class BaseMarketTimingComponent {
  @Input()
  protected id: string;

  protected _source: MovingAverageSource;
  @Input()
  set source(value: MovingAverageSource) {
    if (typeof value == 'string') {
      this._source = MovingAverageSource[value];
    } else {
      this._source = value;
    }
  }
  get source() {
    return this._source;
  }

  protected _preprocessing: MovingAveragePreprocessing;
  @Input()
  set preprocessing(value: MovingAveragePreprocessing) {
    if (typeof value == 'string') {
      this._preprocessing = MovingAveragePreprocessing[value];
    } else {
      this._preprocessing = value;
    }
  }
  get preprocessing() {
    return this._preprocessing;
  }

  protected _periodLength: PeriodLength;
  @Input()
  set periodLength(value: PeriodLength) {
    if (typeof value == 'string') {
      this._periodLength = PeriodLength[value];
    } else {
      this._periodLength = value;
    }
  }
  get periodLength() {
    return this._periodLength;
  }

  protected _status: BearBull;
  @Input()
  set status(value: BearBull) {
    if (typeof value == 'string') {
      this._status = BearBull[value];
    } else {
      this._status = value;
    }
  }
  get status() {
    return this._status;
  }
}
