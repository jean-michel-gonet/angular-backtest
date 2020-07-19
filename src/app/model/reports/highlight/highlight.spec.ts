import { MaxHighlight, MinHighlight, AvgHighlight, StdHighlight } from "./highlight";

let SOURCE: string = "SOURCE";
let YESTERDAY: Date = new Date(2019, 9, 15);
let TODAY: Date = new Date(2019, 9, 16);
let TOMORROW: Date = new Date(2019, 9, 17);

describe("MaxHighlight", () => {
  it("Can highlight the maximum value and corresponding instant", () => {
    let maxHighlight: MaxHighlight = new MaxHighlight(SOURCE);

    maxHighlight.startReportingCycle(YESTERDAY);
    maxHighlight.receiveData({sourceName: SOURCE, y: 10});
    maxHighlight.startReportingCycle(TODAY);
    maxHighlight.receiveData({sourceName: SOURCE, y: 13});
    maxHighlight.startReportingCycle(TOMORROW);
    maxHighlight.receiveData({sourceName: SOURCE, y: 9});

    maxHighlight.completeReport();
    expect(maxHighlight.max).toBe(13);
    expect(maxHighlight.instantMax).toBe(TODAY);
  });
});

describe("MinHighlight", () => {
  it("Can highlight the minimum value and corresponding instant", () => {
    let minHighlight: MinHighlight = new MinHighlight(SOURCE);

    minHighlight.startReportingCycle(YESTERDAY);
    minHighlight.receiveData({sourceName: SOURCE, y: 10});
    minHighlight.startReportingCycle(TODAY);
    minHighlight.receiveData({sourceName: SOURCE, y: 13});
    minHighlight.startReportingCycle(TOMORROW);
    minHighlight.receiveData({sourceName: SOURCE, y: 9});

    minHighlight.completeReport();
    expect(minHighlight.min).toBe(9);
    expect(minHighlight.instantMin).toBe(TOMORROW);
  });
});

describe("AvgHighlight", () => {
  it("Can highlight the average value", () => {
    let avgHighlight: AvgHighlight = new AvgHighlight(SOURCE);

    avgHighlight.startReportingCycle(YESTERDAY);
    avgHighlight.receiveData({sourceName: SOURCE, y: 10});
    avgHighlight.startReportingCycle(TODAY);
    avgHighlight.receiveData({sourceName: SOURCE, y: 13});
    avgHighlight.startReportingCycle(TOMORROW);
    avgHighlight.receiveData({sourceName: SOURCE, y: 9});

    avgHighlight.completeReport();
    expect(avgHighlight.avg).toBeCloseTo((10 + 13 + 9) / 3, 3);
  });
});

describe("StdHighlight", () => {
  it("Can highlight the average value", () => {
    let stdHighlight: StdHighlight = new StdHighlight(SOURCE);

    stdHighlight.startReportingCycle(YESTERDAY);
    stdHighlight.receiveData({sourceName: SOURCE, y: 10});
    stdHighlight.startReportingCycle(TODAY);
    stdHighlight.receiveData({sourceName: SOURCE, y: 13});
    stdHighlight.startReportingCycle(TOMORROW);
    stdHighlight.receiveData({sourceName: SOURCE, y: 9});

    stdHighlight.completeReport();
    expect(stdHighlight.std).toBeCloseTo(1.6996, 3);
  });
});
