import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef } from '@angular/core';
import { Highlight } from './highlight';
import { ReportedData } from 'src/app/model/core/reporting';

export interface Highlight {
  startReportingCycle(instant: Date): void;
  receiveData(providedData: ReportedData): void;
  completeReport(): void;
}

export abstract class BaseHighlightComponent implements Highlight {
  protected instant: Date;

  private _sourceName: string;
  @Input()
  set sourceName(value: string) {
    this._sourceName = value;
  }
  get sourceName(): string {
      return this._sourceName;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  startReportingCycle(instant: Date): void {
    this.instant = instant;
  }

  abstract receiveData(providedData: ReportedData): void;

  completeReport(): void {
    this.cdr.detectChanges();
  }
}

@Component({
  selector: 'highlight-max',
  template: `{{max|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlightComponent, useExisting: forwardRef(() => HighlightMaxComponent) }]
})
export class HighlightMaxComponent extends BaseHighlightComponent {
  public max: number;

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      if (this.max) {
        if (providedData.y > this.max) {
          this.max = providedData.y;
        }
      } else {
        this.max = providedData.y;
      }
    }
  }
}

@Component({
  selector: 'highlight-date-max',
  template: `{{instantMax|date:'y/M/d'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlightComponent, useExisting: forwardRef(() => HighlightDateMaxComponent) }]
})
export class HighlightDateMaxComponent extends BaseHighlightComponent {
  public max: number;
  public instantMax: Date;

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      if (this.max) {
        if (providedData.y > this.max) {
          this.max = providedData.y;
          this.instantMax = this.instant;
        }
      } else {
        this.max = providedData.y;
        this.instantMax = this.instant;
      }
    }
  }
}

@Component({
  selector: 'highlight-min',
  template: `{{min|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlightComponent, useExisting: forwardRef(() => HighlightMinComponent) }]
})
export class HighlightMinComponent extends BaseHighlightComponent {
  public min: number;

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      if (this.min) {
        if (providedData.y < this.min) {
          this.min = providedData.y;
        }
      } else {
        this.min = providedData.y;
      }
    }
  }
}

@Component({
  selector: 'highlight-date-min',
  template: `{{instantMin|date:'y/M/d'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlightComponent, useExisting: forwardRef(() => HighlightDateMinComponent) }]
})
export class HighlightDateMinComponent extends BaseHighlightComponent {
  public min: number;
  public instantMin: Date;

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      if (this.min) {
        if (providedData.y < this.min) {
          this.min = providedData.y;
          this.instantMin = this.instant;
        }
      } else {
        this.min = providedData.y;
        this.instantMin = this.instant;
      }
    }
  }
}

@Component({
  selector: 'highlight-avg',
  template: `{{avg|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlightComponent, useExisting: forwardRef(() => HighlightAvgComponent) }]
})
export class HighlightAvgComponent extends BaseHighlightComponent {
  private numberOfSamples: number;

  private avg: number;

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }
  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      if (this.numberOfSamples) {
        this.avg = (this.avg * this.numberOfSamples  + providedData.y) / (this.numberOfSamples + 1);
        this.numberOfSamples++;
      } else {
        this.avg = providedData.y;
        this.numberOfSamples = 1;
      }
    }
  }
}

@Component({
  selector: 'highlight-std',
  template: `{{std|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlightComponent, useExisting: forwardRef(() => HighlightStdComponent) }]
})
export class HighlightStdComponent extends BaseHighlightComponent {
  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }
  receiveData(providedData: ReportedData): void {
    // Nothing yet.
  }
}
