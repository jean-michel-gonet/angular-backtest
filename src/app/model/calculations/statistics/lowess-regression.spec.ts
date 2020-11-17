import { LowessRegression } from "./lowess-regression";

describe("Lowess Regression" , () => {

  it("Can create a new instance", () => {
    let lowessRegression: LowessRegression = new LowessRegression();
    lowessRegression.sample(new Date(2001, 1, 1), 1);
    lowessRegression.sample(new Date(2001, 1, 2), 8);
    lowessRegression.sample(new Date(2001, 1, 3), 2);
    lowessRegression.sample(new Date(2001, 1, 4), 9);
    lowessRegression.sample(new Date(2001, 1, 5), 3);
    let xy = lowessRegression.regression();
    expect(xy).toBeTruthy();
  });

  it("Can be accurate when source is a perfect line", () => {
    let lowessRegression: LowessRegression = new LowessRegression();
    for(var n = 0; n < 20; n++) {
      lowessRegression.sample(new Date(2001, 1, 1 + n), n * 2);
    }
    let xy = lowessRegression.regression();
    expect(xy.y).toBeCloseTo(20, 2);
  });

});
