import { Component, Input, ContentChild } from '@angular/core';
import { PeriodLength } from 'src/app/model/core/period';
import { BearBull, MarketTiming } from 'src/app/model/core/market-timing';
import { SuperthonMarketTiming } from 'src/app/model/markettiming/market-timing.superthon';
import { EMAMarketTiming } from 'src/app/model/markettiming/market-timing.ema';
import { MACDMarketTiming } from 'src/app/model/markettiming/market-timing.macd';

class BaseMarketTimingComponent {
  @Input()
  protected id: string;

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

@Component({
  selector: 'ema-filter',
  template: ''
})
export class EMAMarketTimingComponent extends BaseMarketTimingComponent {

  private _shortPeriod: number;
  @Input()
  set shortPeriod(value: number) {
    if (typeof value == 'string') {
      this._shortPeriod = parseInt(value);
    } else {
      this._shortPeriod = value;
    }
  }
  get shortPeriod() {
    return this._shortPeriod
  }

  private _longPeriod: number;
  @Input()
  set longPeriod(value: number) {
    if (typeof value == 'string') {
      this._longPeriod = parseInt(value);
    } else {
      this._longPeriod = value;
    }
  }
  get longPeriod() {
    return this._longPeriod;
  }

  asEmaMarketTiming(): EMAMarketTiming {
    return new EMAMarketTiming({
      id: this.id,
      periodLength: this.periodLength,
      shortPeriod: this.shortPeriod,
      longPeriod: this.longPeriod,
      status: this.status
    });
  }
}

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

@Component({
  selector: 'macd-filter',
  template: ''
})
export class MACDMarketTimingComponent extends BaseMarketTimingComponent {

  private _shortPeriod: number;
  @Input()
  set shortPeriod(value: number) {
    if (typeof value == 'string') {
      this._shortPeriod = parseInt(value);
    } else {
      this._shortPeriod = value;
    }
  }
  get shortPeriod() {
    return this._shortPeriod;
  }

  private _longPeriod: number;
  @Input()
  set longPeriod(value: number) {
    if (typeof value == 'string') {
      this._longPeriod = parseInt(value);
    } else {
      this._longPeriod = value;
    }
  }
  get longPeriod() {
    return this._longPeriod;
  }

  private _triggerPeriod: number;
  @Input()
  set triggerPeriod(value: number) {
    if (typeof value == 'string') {
      this._triggerPeriod = parseInt(value);
    } else {
      this._triggerPeriod = value;
    }
  }
  get triggerPeriod() {
    return this._triggerPeriod;
  }

  asMACDMarketTiming(): MACDMarketTiming {
    return new MACDMarketTiming({
      id: this.id,
      periodLength: this.periodLength,
      shortPeriod: this.shortPeriod,
      longPeriod: this.longPeriod,
      triggerPeriod: this.triggerPeriod,
      status: this.status
    });
  }
}

@Component({
  selector: 'market-timing',
  template: '<ng-content></ng-content>'
})
export class MarketTimingComponent {
  @ContentChild(EMAMarketTimingComponent, {static: true})
  private emaFilter: EMAMarketTimingComponent;

  @ContentChild(MACDMarketTimingComponent, {static: true})
  private macdFilter: MACDMarketTimingComponent;

  @ContentChild(SuperthonMarketTimingComponent, {static: true})
  private candleFilter: SuperthonMarketTimingComponent;

  public asMarketTiming(): MarketTiming {
    if (this.emaFilter) {
      return this.emaFilter.asEmaMarketTiming();
    } else if (this.macdFilter) {
      return this.macdFilter.asMACDMarketTiming();
    } else if (this.candleFilter) {
      return this.candleFilter.asSuperthonMarketTimingComponent();
    } else {
      throw new Error('<market-timing> should contain one of <macd-filter>, <ema-filter> or <candle-filter>');
    }
  }
}
