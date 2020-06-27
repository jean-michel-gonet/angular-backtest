import { Component, Input } from '@angular/core';
import { SlidingPerformance } from 'src/app/model/reports/preprocessors/sliding-performance';
import { UnitOfTime } from 'src/app/model/calculations/unit-of-time';

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

  private _unitOfTime: UnitOfTime;
  @Input()
  set unitOfTime(value: UnitOfTime) {
    if (typeof value == 'string') {
      this._unitOfTime = UnitOfTime[value];
    } else {
      this._unitOfTime = value;
    }
  }
  get unitOfTime() {
    return this._unitOfTime;
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
      unitOfTime: this.unitOfTime,
      output: this.output
    });
  }
}
