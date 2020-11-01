import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef } from '@angular/core';
import { MaxHighlight, MinHighlight, AvgHighlight, StdHighlight } from 'src/app/model/reports/highlight/highlight';
import { Highlight } from 'src/app/model/reports/highlight/highlight-report';
import { ReportedData } from 'src/app/model/core/reporting';

export abstract class HighlightComponent implements Highlight {
  public highlight: Highlight;

  private _sourceName: string;

  @Input()
  set sourceName(value: string) {
    this._sourceName = value;
    this.highlight = this.initializeHighlight(value);
  }
  get sourceName(): string {
      return this._sourceName;
  }

  constructor(private cdr: ChangeDetectorRef) {
  }

  protected abstract initializeHighlight(sourceName: string): Highlight;

  startReportingCycle(instant: Date): void {
    this.highlight.startReportingCycle(instant);
  }

  receiveData(providedData: ReportedData): void {
    this.highlight.receiveData(providedData);
  }

  completeReport(): void {
    this.highlight.completeReport();
    this.cdr.detectChanges();
  }
}

@Component({
  selector: 'highlight-max',
  template: `{{highlight.max|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: HighlightComponent, useExisting: forwardRef(() => HighlightMaxComponent) }]
})
export class HighlightMaxComponent extends HighlightComponent {
  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  protected initializeHighlight(sourceName: string): Highlight {
    return new MaxHighlight(sourceName);
  }
}

@Component({
  selector: 'highlight-date-max',
  template: `{{highlight.instantMax|date:'y/M/d'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: HighlightComponent, useExisting: forwardRef(() => HighlightDateMaxComponent) }]
})
export class HighlightDateMaxComponent extends HighlightMaxComponent {
  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }
}

@Component({
  selector: 'highlight-min',
  template: `{{highlight.min|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: HighlightComponent, useExisting: forwardRef(() => HighlightMinComponent) }]
})
export class HighlightMinComponent extends HighlightComponent {
  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }
  protected initializeHighlight(sourceName: string): Highlight {
    return new MinHighlight(sourceName);
  }
}

@Component({
  selector: 'highlight-date-min',
  template: `{{highlight.instantMin|date:'y/M/d'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: HighlightComponent, useExisting: forwardRef(() => HighlightDateMinComponent) }]
})
export class HighlightDateMinComponent extends HighlightMinComponent {
  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }
}

@Component({
  selector: 'highlight-avg',
  template: `{{highlight.avg|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: HighlightComponent, useExisting: forwardRef(() => HighlightAvgComponent) }]
})
export class HighlightAvgComponent extends HighlightComponent {
  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }
  protected initializeHighlight(sourceName: string): Highlight {
    return new AvgHighlight(sourceName);
  }
}

@Component({
  selector: 'highlight-std',
  template: `{{highlight.std|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: HighlightComponent, useExisting: forwardRef(() => HighlightStdComponent) }]
})
export class HighlightStdComponent extends HighlightComponent {
  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }
  protected initializeHighlight(sourceName: string): Highlight {
    return new StdHighlight(sourceName);
  }
}
