import { SlidingPerformance} from "./sliding-performance";
import { UnitOfTime } from "./unit-of-time";
import { TestReport, TestReporter } from './test-utils';

describe('SlidingPerformance', () =>{
  let testReport: TestReport;
  let testReporter: TestReporter;

  beforeEach(() => {
    testReport = new TestReport("OUTPUT");
    testReporter = new TestReporter("SOURCE");
    testReport.register(testReporter);
  });

  it('Can be instantiated', () => {
    let slidingPerformance: SlidingPerformance = new SlidingPerformance({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.YEAR,
      output: "OUTPUT"});
    expect(slidingPerformance).toBeTruthy();
  });

  it('Can compute performance over 3 years', () => {
    testReport.setPreProcessor(new SlidingPerformance({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.YEAR,
      output: "OUTPUT"
    }));

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
    testReport.setPreProcessor(new SlidingPerformance({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.MONTH,
      output: "OUTPUT"
    }));

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
