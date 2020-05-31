import { Component, Input } from '@angular/core';
import { PeriodLength } from 'src/app/model/core/period';
import { SlidingPerformance } from 'src/app/model/reports/preprocessors/sliding-performance';

@Component({
  selector: 'sliding-performance',
  template: ''
})
export class SlidingPerformanceComponent {
  private _source: string;
  @Input()
  set source(value: string) {
    this._source = value;
  }
  get source() {
    return this._source;
  }

  private _over: number;
  @Input()
  set over(value: number) {
    if (typeof value == 'string') {
      this._over = parseInt(value);
    } else {
      this._over = value;
    }
  }
  get over() {
    return this._over;
  }

  private _periodLength: PeriodLength;
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

  private _output: string;
  @Input()
  set output(value: string) {
    this._output = value;
  }
  get output() {
    return this._output;
  }

  asSlidingPerformance(): SlidingPerformance {
    return new SlidingPerformance({
      source: this.source,
      over: this.over,
      periodLength: this.periodLength,
      output: this.output
    });
  }
}
