import { LowessPreprocessor} from "./lowess-preprocessor";
import { UnitOfTime } from "./unit-of-time";
import { TestReport, TestReporter } from '../test-utils/test-utils';
import { Reports } from "../reports";

describe('LowessPreprocessor', () =>{
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
    let performancePreprocessor: LowessPreprocessor = new LowessPreprocessor({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.YEAR,
      output: "OUTPUT"});
    expect(performancePreprocessor).toBeTruthy();
  });

  it('Can compute performance over 3 years', () => {
    reports.registerPreProcessor(new LowessPreprocessor({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.YEAR,
      output: "OUTPUT"
    }));

    let instant: Date = new Date(1980, 0, 1);    // Some date in the past.
    let endDate: Date =   new Date(1983, 0, 1);  // 3 years later.
    let value: number = 1000;
    while(instant <= endDate) {
      value++;
      reports.startReportingCycle(instant);
      testReporter.y = value;
      reports.collectReports();
      instant.setDate(instant.getDate() + 1);
    }
    expect(testReport.numberOfEntries()).toBe(1);

    expect(testReport.entryOf(new Date(1983, 0, 1))).toBeCloseTo(value - 1, 1);
  });

  it('Can compute performance over 3 month with missing dayas', () => {
    reports.registerPreProcessor(new LowessPreprocessor({
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

    expect(testReport.entryOf(new Date(1980, 3, 1))).toBeCloseTo(11, 2);
  });

  it('Can list the quotest of interest', () => {
    reports.registerPreProcessor(new LowessPreprocessor({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.MONTH,
      output: "OUTPUT"
    }));
    expect(reports.listQuotesOfInterest()).toEqual(jasmine.arrayWithExactContents(["SOURCE", "OUTPUT"]));
  });
});
