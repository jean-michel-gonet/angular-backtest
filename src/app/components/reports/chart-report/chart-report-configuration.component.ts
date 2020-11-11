import { Component, Input } from '@angular/core';
import { ShowDataAs, ShowDataOn, ChartConfiguration } from 'src/app/model/reports/chart-report';

@Component({
  selector: 'chart-report-configuration',
  template: '',
})
export class ChartReportConfigurationComponent {

  private _showDataAs: ShowDataAs;
  @Input()
  set showDataAs(value: ShowDataAs) {
    if (typeof value == 'string') {
      this._showDataAs = ShowDataAs[value];
    } else {
      this._showDataAs = value;
    }
  }
  get showDataAs(): ShowDataAs {
      return this._showDataAs;
  }

  private _showDataOn: ShowDataOn
  @Input()
  set showDataOn(value: ShowDataOn) {
    if (typeof value == 'string') {
      this._showDataOn = ShowDataOn[value];
    } else {
      this._showDataOn = value;
    }
  }
  get showDataOn(): ShowDataOn {
    return this._showDataOn;
  }

  @Input()
  public show: string;

  asNg2ChartConfiguration(): ChartConfiguration {
    return  {
      show: this.show,
      as: this.showDataAs,
      on: this.showDataOn
    };
  }
}
