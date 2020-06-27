import { SlidingPerformance} from "./sliding-performance";
import { Reporter, Report, ReportedData, PreProcessor } from "../../core/reporting";
import { UnitOfTime } from "../../calculations/unit-of-time";

describe('SlidingPerformance', () =>{
  it('Can be instantiated', () => {
    let slidingPerformance: SlidingPerformance = new SlidingPerformance({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.YEAR,
      output: "OUTPUT"});
    expect(slidingPerformance).toBeTruthy();
  });

  class TestReporter implements Reporter {
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

  class TestReport implements Report {
    private reporter: Reporter;
    private instant: Date;
    private info: Map<number, number> = new Map<number, number>();

    constructor(private preProcessor: PreProcessor, private source: string) {}

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

  it('Can compute performance over 3 years', () => {
    let slidingPerformance: SlidingPerformance = new SlidingPerformance({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.YEAR,
      output: "OUTPUT"});

    let testReport: TestReport = new TestReport(slidingPerformance, "OUTPUT");
    let testReporter: TestReporter = new TestReporter("SOURCE");
    testReporter.doRegister(testReport);

    let endDate: Date =   new Date(1983, 0, 1);  // 3 years later.
    let instant: Date = new Date(1980, 0, 1);    // Some date in the past.
    let initialValue = 1000;
    let value: number = initialValue;
    let days: number = 0;
    while(instant <= endDate) {
      testReport.startReportingCycle(instant);
      testReporter.setY(value);
      testReport.collectReports();
      instant.setDate(instant.getDate() + 1);
      days++;
      value++;
    }
    expect(testReport.numberOfEntries()).toBe(1);

    let expectedDifference = value - initialValue;
    let expectedPerformance = 100 * expectedDifference / initialValue;
    let expectedAnnualPerformance = expectedPerformance * 365 / days;

    expect(testReport.entryOf(new Date(1983, 0, 1))).toBeCloseTo(expectedAnnualPerformance, 1);
  });

  it('Can compute performance over 3 month with missing dayas', () => {
    let slidingPerformance: SlidingPerformance = new SlidingPerformance({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.MONTH,
      output: "OUTPUT"});

    let testReport: TestReport = new TestReport(slidingPerformance, "OUTPUT");
    let testReporter: TestReporter = new TestReporter("SOURCE");
    testReporter.doRegister(testReport);

    testReport.startReportingCycle(new Date(1980, 0, 1));
    testReporter.setY(10);
    testReport.collectReports();

    testReport.startReportingCycle(new Date(1980, 3, 1));
    testReporter.setY(11);
    testReport.collectReports();

    expect(testReport.numberOfEntries()).toBe(1);

    expect(testReport.entryOf(new Date(1980, 3, 1))).toBeCloseTo(40, 0);
  });

});
