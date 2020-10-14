import { Highlight } from './highlight-report';
import { ReportedData } from '../../core/reporting';
import { CumulativeMovingAverage } from '../../calculations/moving-average/cumulative-moving-average';
import { StandardDeviation } from '../../calculations/statistics/standard-deviation';

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
  private cumulative: CumulativeMovingAverage = new CumulativeMovingAverage();
  public avg: number;
  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      this.avg = this.cumulative.movingAverageOf(providedData.y);
    }
  }
}

export class StdHighlight extends BaseHighlight {
  private standardDeviation: StandardDeviation = new StandardDeviation();
  public std: number;

  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      this.std = this.standardDeviation.std(providedData.y);
    }
  }
}
