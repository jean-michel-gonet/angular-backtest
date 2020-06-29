import { RegressionPreprocessor} from "./regression-preprocessor";
import { UnitOfTime } from "./unit-of-time";
import { TestReport, TestReporter } from './test-utils';

describe('SlidingRegression', () =>{
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

    feedReportWith(new Date(1980,  1 - 1,  1),     7.24);
    feedReportWith(new Date(1980,  3 - 1, 17),   771.92);
    feedReportWith(new Date(1980,  5 - 1, 23),  1446.09);
    feedReportWith(new Date(1980,  6 - 1, 22),  1743.11);
    feedReportWith(new Date(1980,  9 - 1,  2),  2468.53);
    feedReportWith(new Date(1980, 11 - 1,  8),  3121.01);
    feedReportWith(new Date(1981,  1 - 1,  6),  3723.27);
    feedReportWith(new Date(1981,  2 - 1,  6),  4032.62);
    feedReportWith(new Date(1981,  3 - 1, 15),  4398.32);
    feedReportWith(new Date(1981,  4 - 1, 19),  4744.50);
    feedReportWith(new Date(1981,  7 - 1, 17),  5637.55);
    feedReportWith(new Date(1981, 10 - 1,  2),  6413.77);
    feedReportWith(new Date(1981, 12 - 1, 24),  7246.23);
    feedReportWith(new Date(1982,  1 - 1, 28),  7582.66);
    feedReportWith(new Date(1982,  4 - 1, 15),  8357.62);
    feedReportWith(new Date(1982,  6 - 1,  4),  8867.21);
    feedReportWith(new Date(1982,  8 - 1, 20),  9624.23);
    feedReportWith(new Date(1982, 10 - 1, 29), 10332.53);
    feedReportWith(new Date(1983,  1 - 1,  1), 10646.22);

    expect(testReport.numberOfEntries()).toBe(1);
    expect(testReport.entryOf(new Date(1983, 0, 1))).toBeCloseTo(9.909, 3);
  });
});
