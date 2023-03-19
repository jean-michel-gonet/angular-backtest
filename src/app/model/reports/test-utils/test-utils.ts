import { Reporter, Report, ReportedData } from '../../core/reporting';
import { StringUtils } from '../../utils/string-utils';
import { PreProcessor } from '../preprocessors/preprocessor';

/**
 * A test reporter, to make unit tests with it.
 * @class{TestReporter}
 */
export class TestReporter implements Reporter {
  public instant: Date;
  public y: number;

  constructor(private sourceName: string) {}

  doRegister(report: Report): void {
    report.register(this);
  }

  startReportingCycle(instant: Date): void {
    this.instant = instant;
  }

  reportTo(report: Report): void {
    report.receiveData(new ReportedData({
      sourceName: this.sourceName, 
      y: this.y
    }));
  }
}

/**
 * A test report, to make unit tests with it.
 * @class{TestReport}
 */
export class TestReport implements Report {
  public reporters: Reporter[] = [];
  public instant: Date;
  public y: number;
  private entries: Map<number, number> = new Map<number, number>();
  public reportIsCompleted: boolean = false;

  constructor(public sourceName: string) {}

  register(reporter: Reporter): void {
    this.reporters.push(reporter);
  }

  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      this.y = providedData.y;
      if (providedData.sourceName == this.sourceName) {
        this.entries.set(this.instant.valueOf(), providedData.y);    
      }
    }
  }

  startReportingCycle(instant: Date): void {
    this.instant = instant;
    this.reporters.forEach(r => {
      r.startReportingCycle(instant);
    });
  }

  collectReports(): void {
    this.reporters.forEach(r => {
      r.reportTo(this)
    });
  }

  completeReport(): void {
    this.reportIsCompleted = true;
  }

  listQuotesOfInterest(): string[] {
    return [StringUtils.quoteOfInterestFor(this.sourceName)];
  }

  public numberOfEntries(): number {
    return this.entries.size;
  }

  public entryOf(instant: Date): number {
    return this.entries.get(instant.valueOf());
  }
}

/**
 * A test pre-processor, to make unit tests with it.
 * @class{TestPreProcessor}
 */
export class TestPreProcessor implements PreProcessor {
  private y: number;

  public instant: Date;

  constructor(public sourceName: string, public output: string, public p:(y:number) => number) {}
  
  listQuotesOfInterest(): string[] {
    return [StringUtils.quoteOfInterestFor(this.sourceName)];
  }

  startReportingCycle(instant: Date): void {
    this.instant = instant;
  }

  receiveData(providedData: ReportedData): void {
    if (providedData.sourceName == this.sourceName) {
      this.y = this.p(providedData.y);
    }
  }
  reportTo(report: Report): void {
    if (this.y) {
      report.receiveData(new ReportedData({sourceName: this.output, y: this.y}));
    }
  }
}

