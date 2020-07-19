import { Reporter, Report, ReportedData, PreProcessor } from '../../core/reporting';

/**
 * A test reporter, to make unit tests with it.
 * @class{TestReporter}
 */
export class TestReporter implements Reporter {
  private y: number;

  constructor(private sourceName: string) {}

  public setY(y: number) {
    this.y = y;
  }

  doRegister(report: Report): void {
    report.register(this);
  }

  startReportingCycle(instant: Date): void {
    // Nothing to do.
  }

  reportTo(report: Report): void {
    report.receiveData(new ReportedData({sourceName: this.sourceName, y: this.y}));
  }
}

/**
 * A test report, to make unit tests with it.
 * @class{TestReport}
 */
export class TestReport implements Report {
  private reporter: Reporter;
  private instant: Date;
  private info: Map<number, number> = new Map<number, number>();
  public preProcessor: PreProcessor;

  constructor(private source: string) {}

  setPreProcessor(preProcessor: PreProcessor): void {
    this.preProcessor = preProcessor;
  }

  register(reporter: Reporter): void {
    this.reporter = reporter;
  }

  receiveData(providedData: ReportedData): void {
    this.preProcessor.receiveData(providedData);
    if (providedData.sourceName == this.source) {
      this.info.set(this.instant.valueOf(), providedData.y);
    }
  }

  startReportingCycle(instant: Date): void {
    this.instant = instant;
    this.reporter.startReportingCycle(instant);
    this.preProcessor.startReportingCycle(instant);
  }

  collectReports(): void {
    this.reporter.reportTo(this);
    this.preProcessor.reportTo(this);
  }

  completeReport(): void {
    // Nothing to do.
  }

  public numberOfEntries(): number {
    return this.info.size;
  }

  public entryOf(instant: Date): number {
    return this.info.get(instant.valueOf());
  }
}
