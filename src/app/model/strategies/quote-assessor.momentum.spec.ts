import { InstantQuotes, Quote} from '../core/quotes';
import { NullReport, ReportedData } from '../core/reporting';
import { NoNameSuppliedQuoteAssessorError, QuoteAssessor } from './quote-assessor';
import { MomentumQuoteAssessor } from './quote-assessor.momentum';

describe("MomentumQuoteAssessor", () => {
  it("Can throw an error if name is not supplied", () => {
    expect(() => {
      new MomentumQuoteAssessor({
        name: null
      });
    }).toThrow(new NoNameSuppliedQuoteAssessorError());
    let quoteAssessor: QuoteAssessor = new MomentumQuoteAssessor({
      name: "A"
    });
    expect(quoteAssessor.name).toBe("A");
  });

  it("Can indicate the minimum assessment duration", () => {
    let assessor1 = new MomentumQuoteAssessor({
      name: "A",
      gapDistance: 10,
      averageTrueRangeDistance: 10,
      momentumDistance: 10,
      movingAverageDistance: 20
    });
    expect(assessor1.minimumAssessmentDuration).toBe(20);

    let assessor2 = new MomentumQuoteAssessor({
      name: "A",
      gapDistance: 10,
      averageTrueRangeDistance: 10,
      momentumDistance: 21,
      movingAverageDistance: 20
    });
    expect(assessor2.minimumAssessmentDuration).toBe(21);

    let assessor3 = new MomentumQuoteAssessor({
      name: "A",
      gapDistance: 10,
      averageTrueRangeDistance: 22,
      momentumDistance: 21,
      movingAverageDistance: 20
    });
    expect(assessor3.minimumAssessmentDuration).toBe(22);

    let assessor4 = new MomentumQuoteAssessor({
      name: "A",
      gapDistance: 23,
      averageTrueRangeDistance: 22,
      momentumDistance: 21,
      movingAverageDistance: 20
    });
    expect(assessor4.minimumAssessmentDuration).toBe(23);
  });

  class MockReport extends NullReport {
    public reportedData: ReportedData[] = [];
    receiveData(reportedData: ReportedData): void {
      this.reportedData.push(reportedData);
    }
  }

  it("Can assess atr indicator", () => {
    let assessor = new MomentumQuoteAssessor({name: "A", gapDistance: 10, maximumAtrPerPosition: 0.04});
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  1), quotes: [new Quote({name: "A", open: 10, close: 11})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  2), quotes: [new Quote({name: "A", open: 11, close: 12})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  3), quotes: [new Quote({name: "A", open: 12, close: 13})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  4), quotes: [new Quote({name: "A", open: 13, close: 14})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  5), quotes: [new Quote({name: "A", open: 14, close: 15})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  6), quotes: [new Quote({name: "A", open: 15, close: 16})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  7), quotes: [new Quote({name: "A", open: 16, close: 17})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  8), quotes: [new Quote({name: "A", open: 17, close: 18})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  9), quotes: [new Quote({name: "A", open: 18, close: 19})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1, 10), quotes: [new Quote({name: "A", open: 19, close: 20})]}));

    expect(assessor.atr).toBeCloseTo(1, 2);

    expect(assessor.partsToBuy(100)).toBe(4);

    let report = new MockReport();
    assessor.reportTo(report);
    expect(report.reportedData).toContain({sourceName: "A.ATR", y: 1});
  });

  it("Can assess momentum indicator, compare assessors based on it, and report it", () => {
    // Given two assessors with 90 days momentum distance:
    let assessor1 = new MomentumQuoteAssessor({name: "A", momentumDistance: 90});
    let assessor2 = new MomentumQuoteAssessor({name: "B", momentumDistance: 90});

    // When fed during 90 days
    let p = 2000;
    let r = 2 / 100;

    for(var day = 0; day < 91; day++) {
      let year = day / 365;

      let c1 = p * ((1 + r) ** year);
      let c2 = c1 + (0.5 - Math.random()) * p / 100;

      // A is a 2% interest rate, absolutely non volatile:
      assessor1.assess(new InstantQuotes({instant: new Date(2001, 1, 1 + day), quotes: [new Quote({name: "A", close: c1})]}));
      // B is the same as A, plus some volatility:
      assessor2.assess(new InstantQuotes({instant: new Date(2001, 1, 1 + day), quotes: [new Quote({name: "B", close: c2})]}));

    }

    // Check if calculation is corrent:
    expect(assessor1.momentum).toBeCloseTo(r, 2);
    expect(assessor2.momentum).toBeLessThan(r);

    // Check if comparison is as expected:
    expect(assessor2.compare(assessor1)).toBeLessThan(0);

    // Check if momentum is reported:
    let report = new MockReport();
    assessor1.reportTo(report);
    assessor2.reportTo(report);

    let reportedData1 = report.reportedData.find(r => {return r.sourceName == "A.MOM";});
    expect(reportedData1).withContext("Reported A.MOM").toBeTruthy();
    expect(reportedData1.y).withContext("Reported A.MOM").toBeCloseTo(r, 2);

    let reportedData2 = report.reportedData.find(r => {return r.sourceName == "B.MOM";});
    expect(reportedData2).withContext("Reported B.MOM").toBeTruthy();
    expect(reportedData2.y).withContext("Reported B.MOM").toBeLessThan(r, 2);
  });

  it("Can assess moving average", () => {
    let assessor1 = new MomentumQuoteAssessor({name: "A", averageTrueRangeDistance: 10, momentumDistance: 10, movingAverageDistance: 10, gapDistance: 10});
    let assessor2 = new MomentumQuoteAssessor({name: "B", averageTrueRangeDistance: 10, momentumDistance: 10, movingAverageDistance: 10, gapDistance: 10});

    let day: number;
    for(day = 1; day < 10; day++) {
      assessor1.assess(new InstantQuotes({instant: new Date(2001, 1,  1 + day), quotes: [new Quote({name: "A", close: 10})]}));
      assessor2.assess(new InstantQuotes({instant: new Date(2001, 1,  1 + day), quotes: [new Quote({name: "B", close: 100 + day})]}));
      expect(assessor1.isEligible()).withContext("Assessor 1 day " + day + " waits for the minimum assessment distance").toBeFalse();
      expect(assessor2.isEligible()).withContext("Assessor 2 day " + day + " waits for the minimum assessment distance").toBeFalse();
    }

    expect(assessor1.movingAverage).toBeCloseTo(10, 2);
    expect(assessor2.movingAverage).toBeCloseTo(105, 2);

    assessor1.assess(new InstantQuotes({instant: new Date(2001, 1,  1 + day), quotes: [new Quote({name: "A", close: 10})]}));
    assessor2.assess(new InstantQuotes({instant: new Date(2001, 1,  1 + day), quotes: [new Quote({name: "B", close: 104})]}));

    expect(assessor1.isEligible()).toBeTrue();
    expect(assessor2.isEligible()).toBeFalse();

    // Check if moving average is reported:
    let report = new MockReport();
    assessor1.reportTo(report);
    assessor2.reportTo(report);

    let reportedData1 = report.reportedData.find(r => {return r.sourceName == "A.MOV";});
    expect(reportedData1).withContext("Reported A.MOV").toBeTruthy();
    expect(reportedData1.y).withContext("Reported A.MOV").toBeCloseTo(10, 2);

    let reportedData2 = report.reportedData.find(r => {return r.sourceName == "B.MOV";});
    expect(reportedData2).withContext("Reported B.MOM").toBeTruthy();
    expect(reportedData2.y).withContext("Reported B.MOM").toBeLessThan(105, 2);

  });

  it("Can assess the presence of gaps", () => {
    let assessor = new MomentumQuoteAssessor({name: "A", averageTrueRangeDistance: 10, momentumDistance: 10, movingAverageDistance: 10, gapDistance: 10, maximumAcceptableGap: 0.51});
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  1), quotes: [new Quote({name: "A", close: 90})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  2), quotes: [new Quote({name: "A", close: 95})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  3), quotes: [new Quote({name: "A", close: 100})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  4), quotes: [new Quote({name: "A", close: 150})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  5), quotes: [new Quote({name: "A", close: 155})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  6), quotes: [new Quote({name: "A", close: 160})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  7), quotes: [new Quote({name: "A", close: 165})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  8), quotes: [new Quote({name: "A", close: 170})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  9), quotes: [new Quote({name: "A", close: 175})]}));
    expect(assessor.isEligible()).toBeFalse();
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1, 10), quotes: [new Quote({name: "A", close: 180})]}));

    expect(assessor.gap).toBeCloseTo(0.5, 4);
    expect(assessor.isEligible()).toBeTrue();

    // Check if gap is reported:
    let report = new MockReport();
    assessor.reportTo(report);

    let reportedData1 = report.reportedData.find(r => {return r.sourceName == "A.GAP";});
    expect(reportedData1).withContext("Reported A.GAP").toBeTruthy();
    expect(reportedData1.y).withContext("Reported A.GAP").toBeCloseTo(0.5, 4);
  });

});
