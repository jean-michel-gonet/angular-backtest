import { TestReport, TestReporter, TestPreProcessor } from "./test-utils/test-utils";
import { Reports } from './reports';

describe("Reports", () => {

  const SOURCE1: string = "SOURCE1";
  const SOURCE2: string = "SOURCE2";
  const SOURCE3: string = "SOURCE3";
  const SOURCE4: string = "SOURCE4";
  const FP1: (y: number) => number = y => y * 2;
  const FP2: (y: number) => number = y => y + 2;
  const TODAY: Date = new Date(1, 0, 2001);

  let report1: TestReport;
  let report2: TestReport;
  let reporter1: TestReporter;
  let reporter2: TestReporter;
  let preProcessor1: TestPreProcessor;
  let preProcessor2: TestPreProcessor;

  let reports: Reports;

  beforeEach(() => {
    // Reporters produce SOURCE1 and SOURCE2, respectively:
    reporter1 = new TestReporter(SOURCE1);
    reporter2 = new TestReporter(SOURCE2);

    // Pre processors transform: - SOURCE1 into SOURCE3 using function FP1
    //                           - SOURCE2 into SOURCE4 using function FP2
    preProcessor1 = new TestPreProcessor(SOURCE1, SOURCE3, FP1);
    preProcessor2 = new TestPreProcessor(SOURCE2, SOURCE4, FP2);

    // Reports are interested in SOURCE3 and SOURCE4, respectively:
    report1 = new TestReport(SOURCE3);
    report2 = new TestReport(SOURCE4);

    // Create the reports holder:
    reports = new Reports({
      preProcessors: [preProcessor1, preProcessor2],
      reports: [report1, report2]
    });

    // Register the reporters:
    reports.register(reporter1);
    reports.register(reporter2);
  });

  it("Can create a new instance", () => {
    expect(reports).toBeTruthy();
  });

  it("Can propagate the start of new cycle to all concerned parties", () => {
    reports.startReportingCycle(TODAY);

    expect(report1.instant).toBe(TODAY);
    expect(report2.instant).toBe(TODAY);
    expect(reporter1.instant).toBe(TODAY);
    expect(reporter2.instant).toBe(TODAY);
    expect(preProcessor1.instant).toBe(TODAY);
    expect(preProcessor2.instant).toBe(TODAY);
  });

  it("Can collect reports from all concerned parties", () => {
    reports.startReportingCycle(TODAY);
    reporter1.y = 10;
    reporter2.y = 100;
    reports.collectReports();

    expect(report1.y).toBe(FP1(10));
    expect(report2.y).toBe(FP2(100));
  });

  it("Can complete the report", () =>{
    expect(report1.reportIsCompleted).toBeFalsy();
    expect(report2.reportIsCompleted).toBeFalsy();
    reports.completeReport();
    expect(report1.reportIsCompleted).toBeTruthy();
    expect(report2.reportIsCompleted).toBeTruthy();
  });

  it("Can list the quotes of interest", () => {
    let quotesOfInterest = reports.listQuotesOfInterest();
    expect(quotesOfInterest).toEqual(jasmine.arrayWithExactContents([SOURCE1, SOURCE2, SOURCE3, SOURCE4]));
  });
});
