import { RegressionPreprocessor} from "./regression-preprocessor";
import { UnitOfTime } from "./unit-of-time";
import { TestReport, TestReporter } from './test-utils';

describe('RegressionProcessor', () =>{
  let testReport: TestReport;
  let testReporter: TestReporter;
  let regressionPreprocessor: RegressionPreprocessor;

  beforeEach(() => {
    testReport = new TestReport("OUTPUT");
    testReporter = new TestReporter("SOURCE");
    testReport.register(testReporter);
  });

  it('Can be instantiated', () => {
    regressionPreprocessor = new RegressionPreprocessor({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.YEAR,
      output: "OUTPUT"});
    expect(regressionPreprocessor).toBeTruthy();
  });

  /**
   * Formats the provided number as a date
   */
  let feedReportWith = function(instant: Date, y: number): void {
    testReport.startReportingCycle(instant);
    testReporter.setY(y);
    testReport.collectReports();
  }

  it('Can compute performance over 3 years with uneven sampling', () => {
    testReport.setPreProcessor(new RegressionPreprocessor({
      source: "SOURCE",
      over: 3,
      unitOfTime: UnitOfTime.YEAR,
      output: "OUTPUT"
    }));

    feedReportWith(new Date(1980,  1 - 1,  1),  978.00);
    feedReportWith(new Date(1980,  3 - 1,  7),  979.62);
    feedReportWith(new Date(1980,  5 - 1, 28),  996.69);
    feedReportWith(new Date(1980,  6 - 1, 13),  995.05);
    feedReportWith(new Date(1980,  8 - 1,  1),  984.22);
    feedReportWith(new Date(1980, 11 - 1,  6), 1023.65);
    feedReportWith(new Date(1980, 11 - 1, 18), 1026.92);
    feedReportWith(new Date(1981,  1 - 1, 29),  984.72);
    feedReportWith(new Date(1981,  3 - 1, 11), 1038.71);
    feedReportWith(new Date(1981,  7 - 1,  1), 1007.50);
    feedReportWith(new Date(1981,  8 - 1, 20), 1020.76);
    feedReportWith(new Date(1981, 10 - 1, 16), 1005.11);
    feedReportWith(new Date(1981, 11 - 1, 26), 1032.10);
    feedReportWith(new Date(1982,  2 - 1,  2), 1019.81);
    feedReportWith(new Date(1982,  3 - 1, 27), 1044.16);
    feedReportWith(new Date(1982,  5 - 1, 27), 1045.60);
    feedReportWith(new Date(1982,  6 - 1, 23), 1009.32);
    feedReportWith(new Date(1982,  7 - 1, 12), 1047.77);
    feedReportWith(new Date(1982, 10 - 1, 20), 1034.20);
    feedReportWith(new Date(1983,  1 - 1,  1), 1036.54); // <- This is not part of the regression

    expect(testReport.numberOfEntries()).toBe(1);
    expect(testReport.entryOf(new Date(1983, 1 - 1, 1))).toBeCloseTo(2.009, 3);
  });
});
