import { Input } from "@angular/core";
import { Periodicity } from 'src/app/model/core/period';
import { BearBull } from 'src/app/model/core/market-timing';
import { ConfigurableSource, ConfigurablePreprocessing } from 'src/app/model/calculations/indicators/configurable-source';

export class BaseMarketTimingComponent {
  @Input()
  protected assetName: string;

  @Input()
  protected id: string;

  protected _source: ConfigurableSource;
  @Input()
  set source(value: ConfigurableSource) {
    if (typeof value == 'string') {
      this._source = ConfigurableSource[value];
    } else {
      this._source = value;
    }
  }
  get source() {
    return this._source;
  }

  protected _preprocessing: ConfigurablePreprocessing;
  @Input()
  set preprocessing(value: ConfigurablePreprocessing) {
    if (typeof value == 'string') {
      this._preprocessing = ConfigurablePreprocessing[value];
    } else {
      this._preprocessing = value;
    }
  }
  get preprocessing() {
    return this._preprocessing;
  }

  protected _periodicity: Periodicity;
  @Input()
  set periodicity(value: Periodicity) {
    if (typeof value == 'string') {
      this._periodicity = Periodicity[value];
    } else {
      this._periodicity = value;
    }
  }
  get periodicity() {
    return this._periodicity;
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

  private _threshold: number;
  @Input()
  set threshold(value: number) {
    if (typeof value == 'string') {
      this._threshold = parseFloat(value);
    } else {
      this._threshold = value;
    }
  }
  get threshold(): number {
    return this._threshold;
  }
}
