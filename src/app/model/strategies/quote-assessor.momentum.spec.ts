import { InstantQuotes, Quote} from '../core/quotes';
import { MomentumQuoteAssessor } from './quote-assessor.momentum';

describe("MomentumQuoteAssessor", () => {

  it("Can assess atr indicator", () => {
    let assessor = new MomentumQuoteAssessor({name: "A", gapDistance: 10});
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
  });

  it("Can assess momentum indicator", () => {
    let assessor1 = new MomentumQuoteAssessor({name: "A", momentumDistance: 90});
    let assessor2 = new MomentumQuoteAssessor({name: "B", momentumDistance: 90});

    let p = 2000;
    let r = 2 / 100;

    for(var day = 0; day < 91; day++) {
      let year = day / 365;
      let c1 = p * ((1 + r) ** year);
      let c2 = c1 + (0.5 - Math.random()) * p / 100;

      assessor1.assess(new InstantQuotes({instant: new Date(2001, 1, 1 + day), quotes: [new Quote({name: "A", close: c1})]}));
      assessor2.assess(new InstantQuotes({instant: new Date(2001, 1, 1 + day), quotes: [new Quote({name: "B", close: c2})]}));
    }

    expect(assessor1.momentum).toBeCloseTo(r, 2);
    expect(assessor2.momentum).toBeLessThan(r);
  });

  it("Can assess moving average", () => {
    let assessor1 = new MomentumQuoteAssessor({name: "A", movingAverageDistance: 10});
    let assessor2 = new MomentumQuoteAssessor({name: "B", movingAverageDistance: 10});

    for(var day = 0; day < 10; day++) {
      assessor1.assess(new InstantQuotes({instant: new Date(2001, 1,  1 + day), quotes: [new Quote({name: "A", close: 10})]}));
      assessor2.assess(new InstantQuotes({instant: new Date(2001, 1,  1 + day), quotes: [new Quote({name: "B", close: 100 + day})]}));
    }

    expect(assessor1.movingAverage).toBeCloseTo(10, 2);
    expect(assessor2.movingAverage).toBeCloseTo(104.5, 2);
  });

  it("Can assess the presence of gaps", () => {
    let assessor = new MomentumQuoteAssessor({name: "A", gapDistance: 10});
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  1), quotes: [new Quote({name: "A", close: 90})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  2), quotes: [new Quote({name: "A", close: 95})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  3), quotes: [new Quote({name: "A", close: 100})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  4), quotes: [new Quote({name: "A", close: 150})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  5), quotes: [new Quote({name: "A", close: 155})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  6), quotes: [new Quote({name: "A", close: 160})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  7), quotes: [new Quote({name: "A", close: 165})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  8), quotes: [new Quote({name: "A", close: 170})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1,  9), quotes: [new Quote({name: "A", close: 175})]}));
    assessor.assess(new InstantQuotes({instant: new Date(2001, 1, 10), quotes: [new Quote({name: "A", close: 180})]}));

    expect(assessor.gap).toBeCloseTo(50, 2);
  });

});
