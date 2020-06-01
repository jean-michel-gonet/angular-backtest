import { SlidingPerformance} from "./sliding-performance";
import { Reporter, Report, ReportedData, PreProcessor } from "../../core/reporting";
import { UnitOfTime } from "../../core/unit-of-time";

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
  }

  it('Can do something nice', () => {
    let slidingPerformance: SlidingPerformance = new SlidingPerformance({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.YEAR,
      output: "OUTPUT"});

    let startDate: Date = new Date(1980, 0, 1);  // Some date in the past.
    let endDate: Date =   new Date(1983, 0, 3);  // 3 years and 3 days later.

    let testReport: TestReport = new TestReport(slidingPerformance, "OUTPUT");
    let testReporter: TestReporter = new TestReporter("SOURCE");

    testReporter.doRegister(testReport);

    let instant: Date = startDate;
    let n: number = 1000;
    while(instant <= endDate) {
      testReport.startReportingCycle(instant);
      testReporter.setY(n++);
      testReport.collectReports();
      instant.setDate(instant.getDate() + 1);
    }
    expect(testReport.numberOfEntries()).toBe(2);
  });
});
