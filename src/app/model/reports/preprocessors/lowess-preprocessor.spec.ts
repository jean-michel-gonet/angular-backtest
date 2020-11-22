import { LowessPreprocessor} from "./lowess-preprocessor";
import { UnitOfTime } from "./unit-of-time";
import { TestReport, TestReporter } from '../test-utils/test-utils';

describe('LowessPreprocessor', () =>{
  let testReport: TestReport;
  let testReporter: TestReporter;

  beforeEach(() => {
    testReport = new TestReport("OUTPUT");
    testReporter = new TestReporter("SOURCE");
    testReport.register(testReporter);
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
    testReport.setPreProcessor(new LowessPreprocessor({
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
      testReport.startReportingCycle(instant);
      testReporter.setY(value);
      testReport.collectReports();
      instant.setDate(instant.getDate() + 1);
    }
    expect(testReport.numberOfEntries()).toBe(1);

    expect(testReport.entryOf(new Date(1983, 0, 1))).toBeCloseTo(value - 1, 1);
  });

  it('Can compute performance over 3 month with missing dayas', () => {
    testReport.setPreProcessor(new LowessPreprocessor({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.MONTH,
      output: "OUTPUT"
    }));

    testReport.startReportingCycle(new Date(1980, 0, 1));
    testReporter.setY(10);
    testReport.collectReports();
    testReport.startReportingCycle(new Date(1980, 2, 31));
    testReporter.setY(11);
    testReport.collectReports();

    testReport.startReportingCycle(new Date(1980, 3, 1));
    testReporter.setY(100);
    testReport.collectReports();

    expect(testReport.numberOfEntries()).toBe(1);

    expect(testReport.entryOf(new Date(1980, 3, 1))).toBeCloseTo(11, 2);
  });

});
