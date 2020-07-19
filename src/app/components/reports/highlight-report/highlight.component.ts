import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef } from '@angular/core';
import { BaseHighlight, MaxHighlight, MinHighlight, AvgHighlight, StdHighlight } from 'src/app/model/reports/highlight/highlight';

@Component({
  selector: 'highlight-max',
  template: `{{max|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlight, useExisting: forwardRef(() => HighlightMaxComponent) }]
})
export class HighlightMaxComponent extends MaxHighlight {
  @Input()
  set sourceName(value: string) {
    super.sourceName = value;
  }
  get sourceName(): string {
      return super.sourceName;
  }

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  completeReport(): void {
    this.cdr.detectChanges();
  }
}

@Component({
  selector: 'highlight-date-max',
  template: `{{instantMax|date:'y/M/d'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlight, useExisting: forwardRef(() => HighlightDateMaxComponent) }]
})
export class HighlightDateMaxComponent extends MaxHighlight {
  @Input()
  set sourceName(value: string) {
    super.sourceName = value;
  }
  get sourceName(): string {
      return super.sourceName;
  }

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  completeReport(): void {
    this.cdr.detectChanges();
  }
}

@Component({
  selector: 'highlight-min',
  template: `{{min|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlight, useExisting: forwardRef(() => HighlightMinComponent) }]
})
export class HighlightMinComponent extends MinHighlight {
  @Input()
  set sourceName(value: string) {
    super.sourceName = value;
  }
  get sourceName(): string {
      return super.sourceName;
  }

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  completeReport(): void {
    this.cdr.detectChanges();
  }
}

@Component({
  selector: 'highlight-date-min',
  template: `{{instantMin|date:'y/M/d'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlight, useExisting: forwardRef(() => HighlightDateMinComponent) }]
})
export class HighlightDateMinComponent extends MinHighlight {
  @Input()
  set sourceName(value: string) {
    super.sourceName = value;
  }
  get sourceName(): string {
      return super.sourceName;
  }

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  completeReport(): void {
    this.cdr.detectChanges();
  }
}

@Component({
  selector: 'highlight-avg',
  template: `{{avg|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlight, useExisting: forwardRef(() => HighlightAvgComponent) }]
})
export class HighlightAvgComponent extends AvgHighlight {
  @Input()
  set sourceName(value: string) {
    super.sourceName = value;
  }
  get sourceName(): string {
      return super.sourceName;
  }

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  completeReport(): void {
    this.cdr.detectChanges();
  }
}

@Component({
  selector: 'highlight-std',
  template: `{{std|number:'1.2-2'}}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseHighlight, useExisting: forwardRef(() => HighlightStdComponent) }]
})
export class HighlightStdComponent extends StdHighlight {
  @Input()
  set sourceName(value: string) {
    super.sourceName = value;
  }
  get sourceName(): string {
      return super.sourceName;
  }

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  completeReport(): void {
    this.cdr.detectChanges();
  }
}
