import { QuoteMomentumAssessment } from './strategy.momentum';
import { Quote} from '../core/quotes';

describe("QuoteMomentumAssessment", () => {

  it("Can assess atr indicator", () => {
    let quoteMomentumAssessment = new QuoteMomentumAssessment(5, 2, 10);
    quoteMomentumAssessment.assess(new Date(2001, 1,  1), new Quote({name: "A", open: 10, close: 11}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  2), new Quote({name: "A", open: 11, close: 12}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  3), new Quote({name: "A", open: 12, close: 13}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  4), new Quote({name: "A", open: 13, close: 14}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  5), new Quote({name: "A", open: 14, close: 15}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  6), new Quote({name: "A", open: 15, close: 16}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  7), new Quote({name: "A", open: 16, close: 17}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  8), new Quote({name: "A", open: 17, close: 18}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  9), new Quote({name: "A", open: 18, close: 19}));
    quoteMomentumAssessment.assess(new Date(2001, 1, 10), new Quote({name: "A", open: 19, close: 20}));

    expect(quoteMomentumAssessment.atr).toBeCloseTo(1, 2);
  });

  it("Can assess momentum indicator", () => {
    let quoteMomentumAssessment1 = new QuoteMomentumAssessment(90, 10, 100);
    let quoteMomentumAssessment2 = new QuoteMomentumAssessment(90, 10, 100);

    let p = 2000;
    let r = 2 / 100;

    for(var day = 0; day < 91; day++) {
      let year = day / 365;
      let c1 = p * ((1 + r) ** year);
      let c2 = c1 + (0.5 - Math.random()) * p / 100;

      quoteMomentumAssessment1.assess(new Date(2001, 1, 1 + day), new Quote({name: "A", close: c1}));
      quoteMomentumAssessment2.assess(new Date(2001, 1, 1 + day), new Quote({name: "B", close: c2}));
    }

    expect(quoteMomentumAssessment1.momentum).toBeCloseTo(r, 2);
    expect(quoteMomentumAssessment2.momentum).toBeLessThan(r);
  });

  it("Can assess moving average", () => {
    let quoteMomentumAssessment1 = new QuoteMomentumAssessment(1, 1, 10);
    let quoteMomentumAssessment2 = new QuoteMomentumAssessment(1, 1, 10);

    for(var day = 0; day < 10; day++) {
      quoteMomentumAssessment1.assess(new Date(2001, 1,  1 + day), new Quote({name: "A", close: 10}));
      quoteMomentumAssessment2.assess(new Date(2001, 1,  1 + day), new Quote({name: "A", close: 100 + day}));
    }

    expect(quoteMomentumAssessment1.movingAverage).toBeCloseTo(10, 2);
    expect(quoteMomentumAssessment2.movingAverage).toBeCloseTo(104.5, 2);
  });

  it("Can assess the presence of gaps", () => {
    let quoteMomentumAssessment = new QuoteMomentumAssessment(10, 10, 10);
    quoteMomentumAssessment.assess(new Date(2001, 1,  1), new Quote({name: "A", close: 90}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  2), new Quote({name: "A", close: 95}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  3), new Quote({name: "A", close: 100}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  4), new Quote({name: "A", close: 150}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  5), new Quote({name: "A", close: 155}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  6), new Quote({name: "A", close: 160}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  7), new Quote({name: "A", close: 165}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  8), new Quote({name: "A", close: 170}));
    quoteMomentumAssessment.assess(new Date(2001, 1,  9), new Quote({name: "A", close: 175}));
    quoteMomentumAssessment.assess(new Date(2001, 1, 10), new Quote({name: "A", close: 180}));

    expect(quoteMomentumAssessment.gap).toBeCloseTo(50, 2);
  });

});
