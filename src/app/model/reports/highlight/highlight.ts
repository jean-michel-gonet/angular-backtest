import { Highlight } from './highlight-report';
import { ReportedData } from '../../core/reporting';
import { OnlineAverage } from '../../calculations/average';
import { OnlineStandardDeviation } from '../../calculations/standard-deviation';

export abstract class BaseHighlight implements Highlight {
  protected instant: Date;
  protected sourceName: string;

  constructor(sourceName?: string) {
    this.sourceName = sourceName;
  }

  startReportingCycle(instant: Date): void {
    this.instant = instant;
  }

  abstract receiveData(providedData: ReportedData): void;

  completeReport(): void {
    // Nothing to do.
  }
}

/**
 * Highlights the maximum reported value, and also the corresponding
 * instant.
 */
export class MaxHighlight extends BaseHighlight {
  public max: number;
  public instantMax: Date;

  constructor(sourceName?: string) {
    super(sourceName);
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

export class MinHighlight extends BaseHighlight {
  public min: number;
  public instantMin: Date;

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

export class AvgHighlight extends BaseHighlight {
  private onlineAverage: OnlineAverage = new OnlineAverage();
  public avg: number;
  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      this.avg = this.onlineAverage.average(providedData.y);
    }
  }
}

export class StdHighlight extends BaseHighlight {
  private onlineStandardDeviation: OnlineStandardDeviation = new OnlineStandardDeviation();
  public std: number;

  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      this.std = this.onlineStandardDeviation.std(providedData.y);
    }
  }
}
