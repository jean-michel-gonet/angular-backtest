import { Quote, InstantQuotes } from '../core/quotes';
import { NullReport, Report, ReportedData, Reporter } from '../core/reporting';
import { Universe } from '../core/universe';
import { QuoteAssessor } from './quote-assessor';
import { TopOfUniverseQuotesAssessor } from "./quotes-assessor.top-of-universe";

describe("TopOfUniverseQuotesAssessor", () => {
  class MockQuoteAssessor implements QuoteAssessor {
    quote: Quote;
    instant: Date;

    /**
     * Class constructor.
     * Directly sets the assessment results.
     * @param name The name / ticker of the asset.
     * @param position The position of the asset in the universe.
     * @param eligible Is this asset eligible.
     * @param minimumAssessmentDuration Number of days a quote has to be
     * assessed before assessment can be meaningful.
     */
    constructor(public name: string, public position: number, public eligible: boolean, public minimumAssessmentDuration:number) {
    }

    assess(instantQuotes: InstantQuotes): void {
      this.quote = instantQuotes.quote(this.name);
    }

    compare(otherQuoteAssessor: MockQuoteAssessor): number {
      return otherQuoteAssessor.position - this.position;
    }

    isEligible(): boolean {
      return this.eligible;
    }

    partsToBuy(nav: number): number {
      return Math.round(nav / 100);
    }

    doRegister(report: Report): void {
      report.register(this);
    }

    startReportingCycle(instant: Date): void {
      this.instant = instant;
    }

    reportTo(report: Report): void {
      report.receiveData({
        sourceName: this.quote.name + ".X",
        y: 12
      })
    }
  }

  class MockUniverse implements Universe {
    constructor(public names: string[] = []){}

    isRelatedToUniverse(name: string): boolean {
      if (this.names.length > 0) {
        return this.names.includes(name);
      } else {
        return true;
      }
    }

    belongsToUniverse(name: string, instant: Date): boolean {
      return this.isRelatedToUniverse(name);
    }

    worthAssessing(name: string, instant: Date, assessmentDays: number): boolean {
      return this.isRelatedToUniverse(name);
    }

    allQuotes(instant?: Date): string[] {
      return this.names;
    }
  }

  it("Can create quote assessors as needed", () => {
    let c = new Map<string, QuoteAssessor>();

    let quotesAssessor = new TopOfUniverseQuotesAssessor({
      quoteAssessorFactory: (name: string) => {
        let quoteAssessor = new MockQuoteAssessor(name, 1, true, 10);
        c.set(name, quoteAssessor);
        return quoteAssessor;
      },
      universe: new MockUniverse(),
      topOfIndex: 4
    });

    quotesAssessor.assessQuotes(new InstantQuotes({instant: new Date(), quotes:[
      new Quote({name: "A", close: 10}),
      new Quote({name: "B", close: 10}),
      new Quote({name: "C", close: 10}),
      new Quote({name: "D", close: 10}),
      new Quote({name: "E", close: 10}),
      new Quote({name: "F", close: 10}),
      new Quote({name: "G", close: 10})
    ]}));

    expect(c.size).toBe(7);

    quotesAssessor.assessQuotes(new InstantQuotes({instant: new Date(), quotes:[
      new Quote({name: "A1", close: 11}),
      new Quote({name: "B1", close: 11}),
      new Quote({name: "C", close: 11}),
      new Quote({name: "D", close: 11}),
      new Quote({name: "E", close: 11}),
      new Quote({name: "F", close: 11}),
      new Quote({name: "G", close: 11})
    ]}));

    expect(c.size).toBe(9);

    expect(c.get("A").quote.close).toBe(10);
    expect(c.get("A1").quote.close).toBe(11);
  });

  it("Can return only top of the index", () => {
    let position = 100;
    let quotesAssessor = new TopOfUniverseQuotesAssessor({
      quoteAssessorFactory: (name: string) => {
        return new MockQuoteAssessor(name, position--, true, 10);
      },
      universe: new MockUniverse(),
      topOfIndex: 4
    });
    quotesAssessor.assessQuotes(new InstantQuotes({instant: new Date(), quotes:[
      new Quote({name: "A", close: 10}),
      new Quote({name: "B", close: 10}),
      new Quote({name: "C", close: 10}),
      new Quote({name: "D", close: 10}),
      new Quote({name: "E", close: 10}),
      new Quote({name: "F", close: 10}),
      new Quote({name: "G", close: 10})
    ]}));

    let targetPositions = quotesAssessor.listTargetPositions(10000);

    expect(targetPositions.positions.length).withContext("Number of target positions").toBe(4);

    expect(targetPositions.positions[0].name).withContext("First position").toBe("G");
    expect(targetPositions.positions[1].name).withContext("Second position").toBe("F");
    expect(targetPositions.positions[2].name).withContext("Third position").toBe("E");
    expect(targetPositions.positions[3].name).withContext("Fourth position").toBe("D");

    expect(targetPositions.name("G")).toBe(targetPositions.positions[0]);
    expect(targetPositions.name("F")).toBe(targetPositions.positions[1]);
    expect(targetPositions.name("E")).toBe(targetPositions.positions[2]);
    expect(targetPositions.name("D")).toBe(targetPositions.positions[3]);
  });

  it("Can remove non eligible instruments from top of the index", () => {
    let position = 0;
    let quotesAssessor = new TopOfUniverseQuotesAssessor({
      quoteAssessorFactory: (name: string) => {
        return new MockQuoteAssessor(name, position, position++ % 2 == 0, 10);
      },
      universe: new MockUniverse(),
      topOfIndex: 4
    });
    quotesAssessor.assessQuotes(new InstantQuotes({instant: new Date(), quotes:[
      new Quote({name: "A", close: 10}),
      new Quote({name: "B", close: 10}),
      new Quote({name: "C", close: 10}),
      new Quote({name: "D", close: 10}),
      new Quote({name: "E", close: 10}),
      new Quote({name: "F", close: 10}),
      new Quote({name: "G", close: 10})
    ]}));

    let targetPositions = quotesAssessor.listTargetPositions(10000);

    expect(targetPositions.positions.length).withContext("Number of target positions").toBe(2);

    expect(targetPositions.positions[0].name).withContext("First position").toBe("A");
    expect(targetPositions.positions[1].name).withContext("Second position").toBe("C");
  });

  it("Can remove instruments not in the universe", () => {
    let position = 0;
    let quotesAssessor = new TopOfUniverseQuotesAssessor({
      quoteAssessorFactory: (name: string) => {
        return new MockQuoteAssessor(name, position, true, 10);
      },
      universe: new MockUniverse(["A", "B", "C", "G"]),
      topOfIndex: 10
    });

    expect(quotesAssessor.listQuotesOfInterest())
      .withContext("Before any assessment").toEqual(["A", "B", "C", "G"]);

    quotesAssessor.assessQuotes(new InstantQuotes({instant: new Date(), quotes:[
      new Quote({name: "A", close: 10}),
      new Quote({name: "B", close: 10}),
      new Quote({name: "C", close: 10}),
      new Quote({name: "D", close: 10}),
      new Quote({name: "E", close: 10}),
      new Quote({name: "F", close: 10}),
      new Quote({name: "G", close: 10})
    ]}));

    expect(quotesAssessor.listQuotesOfInterest())
      .withContext("After doing assessment").toEqual(["A", "B", "C", "G"]);

    let targetPositions = quotesAssessor.listTargetPositions(10000);
    expect(targetPositions.positions.length).withContext("Number of target positions").toBe(4);
    expect(targetPositions.positions[0].name).withContext("First position") .toBe("A");
    expect(targetPositions.positions[1].name).withContext("Second position").toBe("B");
    expect(targetPositions.positions[2].name).withContext("Third position") .toBe("C");
    expect(targetPositions.positions[3].name).withContext("Fourth position").toBe("G");
  });

  class MockReport extends NullReport {

    public reporters: Reporter[] = [];
    public reportedData: ReportedData[] = [];
    register(reporter: Reporter): void {
      this.reporters.push(reporter);
    }
    receiveData(reportedData: ReportedData): void {
      this.reportedData.push(reportedData);
    }
  }

  it("Can let register quote assessors to reports", ()=> {
    let report1 = new MockReport();
    let report2 = new MockReport();

    let quotesAssessor = new TopOfUniverseQuotesAssessor({
      quoteAssessorFactory: (name: string) => {
        return new MockQuoteAssessor(name, 0, true, 10);
      },
      universe: new MockUniverse(["A", "B", "C", "G"]),
      topOfIndex: 10
    });

    quotesAssessor.doRegister(report1);
    expect(report1.reporters).toHaveSize(0);

    quotesAssessor.assessQuotes(new InstantQuotes({instant: new Date(2010, 11, 1), quotes:[
      new Quote({name: "A", close: 10}),
      new Quote({name: "B", close: 10}),
      new Quote({name: "C", close: 10}),
      new Quote({name: "D", close: 10}),
    ]}));

    quotesAssessor.doRegister(report2);
    expect(report2.reporters).toHaveSize(0);

    quotesAssessor.assessQuotes(new InstantQuotes({instant: new Date(2010, 11, 2), quotes:[
      new Quote({name: "E", close: 10}),
      new Quote({name: "F", close: 10}),
      new Quote({name: "G", close: 10})
    ]}));

    expect(report1.reporters).withContext("First report").toHaveSize(4);
    expect(report2.reporters).withContext("Second Report").toHaveSize(1);
  });
});
