import { Component, Input } from '@angular/core';
import { PerformancePreprocessor } from 'src/app/model/reports/preprocessors/performance-preprocessor';
import { UnitOfTime } from 'src/app/model/reports/preprocessors/unit-of-time';

@Component({
  selector: 'performance-preprocessor',
  template: ''
})
export class PerformancePreprocessorComponent {
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

  asPerformancePreprocessor(): PerformancePreprocessor {
    return new PerformancePreprocessor({
      source: this.source,
      over: this.over,
      unitOfTime: this.unitOfTime,
      output: this.output
    });
  }
}
