import { HighlightReport } from './highlight-report';
import { TestReporter } from '../test-utils/test-utils';
import { MaxHighlight } from './highlight';

let SOURCE: string = "SOURCE";
let YESTERDAY: Date = new Date(2019, 9, 15);
let TODAY: Date = new Date(2019, 9, 16);
let TOMORROW: Date = new Date(2019, 9, 17);

describe("HighlighReport", () => {

  it("Can propagate all events to the highlight children", () => {
    let reporter: TestReporter = new TestReporter(SOURCE);
    let maxHighlight: MaxHighlight = new MaxHighlight(SOURCE);
    let highlightReport: HighlightReport = new HighlightReport([maxHighlight]);

    highlightReport.register(reporter);

    highlightReport.startReportingCycle(YESTERDAY);
    reporter.y = 10;
    highlightReport.collectReports();

    highlightReport.startReportingCycle(TODAY);
    reporter.y = 13;
    highlightReport.collectReports();

    highlightReport.startReportingCycle(TOMORROW);
    reporter.y = 9;
    highlightReport.collectReports();

    highlightReport.completeReport();

    expect(maxHighlight.max).toBe(13);
    expect(maxHighlight.instantMax).toBe(TODAY);
  });

  it("Can list the quotes of interest", () => {
    let maxHighlight: MaxHighlight = new MaxHighlight(SOURCE);
    let highlightReport: HighlightReport = new HighlightReport([maxHighlight]);
    expect(highlightReport.listQuotesOfInterest()).toEqual([SOURCE]);
  });
});
