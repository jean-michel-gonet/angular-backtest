import { StandardDeviation } from "./standard-deviation";

describe("StandardDeviation", () => {
  it("Can calculate the standard deviation", () => {
    let standardDeviation: StandardDeviation = new StandardDeviation();

    standardDeviation.std(1);
    standardDeviation.std(0);
    standardDeviation.std(2);
    standardDeviation.std(6);
    standardDeviation.std(8);
    standardDeviation.std(6);
    standardDeviation.std(6);
    standardDeviation.std(6);
    standardDeviation.std(0);
    standardDeviation.std(10);
    standardDeviation.std(4);
    standardDeviation.std(8);
    standardDeviation.std(8);
    standardDeviation.std(2);
    standardDeviation.std(6);
    standardDeviation.std(3);
    expect(standardDeviation.std(4)).toBeCloseTo(2.926, 3);
  });
});
