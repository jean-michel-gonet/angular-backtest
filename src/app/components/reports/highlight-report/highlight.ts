import { Report, ReportedData } from 'src/app/model/core/reporting';

export interface Highlight {
  startReportingCycle(instant: Date);
  receiveData(providedData: ReportedData);
  completeReport(): void;
}

abstract class BaseHighlight implements Highlight {
  constructor(protected sourceName: string) {}

  startReportingCycle(instant: Date): void {
    // Nothing to do.
  }

  abstract receiveData(providedData: ReportedData): void;

  completeReport(): void {
    // Nothing to do.
  }
}

export class HighlightMax extends BaseHighlight {
  private maximum: number;

  constructor(sourceName: string) {
    super(sourceName);
  }

  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      if (this.maximum) {
        if (providedData.y > this.maximum) {
          this.maximum = providedData.y;
        }
      } else {
        this.maximum = providedData.y;
      }
    }
  }
}
