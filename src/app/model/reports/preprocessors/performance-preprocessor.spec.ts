import { PerformancePreprocessor} from "./performance-preprocessor";
import { UnitOfTime } from "./unit-of-time";
import { TestReport, TestReporter } from '../test-utils/test-utils';
import { Reports } from "../reports";

describe('PerformancePreprocessor', () =>{
  let reports: Reports;
  let testReport: TestReport;
  let testReporter: TestReporter;

  beforeEach(() => {
    testReport = new TestReport("OUTPUT");
    reports = new Reports({
      preProcessors: [],
      reports: [testReport]
    });
    testReporter = new TestReporter("SOURCE");
    reports.register(testReporter);
  });

  it('Can be instantiated', () => {
    let performancePreprocessor: PerformancePreprocessor = new PerformancePreprocessor({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.YEAR,
      output: "OUTPUT"});
    expect(performancePreprocessor).toBeTruthy();
  });

  it('Can compute performance over 3 years', () => {
    reports.registerPreProcessor(new PerformancePreprocessor({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.YEAR,
      output: "OUTPUT"
    }));

    let instant: Date = new Date(1980, 0, 1);  // Some date in the past.
    let endDate: Date = new Date(1983, 0, 1);  // 3 years later.
    let initialValue = 1000;
    let value: number = initialValue;
    let days: number = 0;
    while(instant <= endDate) {
      reports.startReportingCycle(instant);
      testReporter.y = value;
      reports.collectReports();
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
    reports.registerPreProcessor(new PerformancePreprocessor({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.MONTH,
      output: "OUTPUT"
    }));

    reports.startReportingCycle(new Date(1980, 0, 1));
    testReporter.y = 10;
    reports.collectReports();
    reports.startReportingCycle(new Date(1980, 2, 31));
    testReporter.y = 11;
    reports.collectReports();

    reports.startReportingCycle(new Date(1980, 3, 1));
    testReporter.y = 100;
    reports.collectReports();

    expect(testReport.numberOfEntries()).toBe(1);

    expect(testReport.entryOf(new Date(1980, 3, 1))).toBeCloseTo(40.555, 2);
  });

});
