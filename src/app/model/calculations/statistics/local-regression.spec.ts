import { LocalRegression } from "./local-regression";

describe("Lowess Regression" , () => {

  it("Can create a new instance", () => {
    let localRegression: LocalRegression = new LocalRegression();
    localRegression.sample(new Date(2001, 1, 1), 1);
    localRegression.sample(new Date(2001, 1, 2), 8);
    localRegression.sample(new Date(2001, 1, 3), 2);
    localRegression.sample(new Date(2001, 1, 4), 9);
    localRegression.sample(new Date(2001, 1, 5), 3);
    let y = localRegression.regression();
    expect(y).toBeTruthy();
  });

  it("Can be accurate when source is a perfect line", () => {
    let localRegression: LocalRegression = new LocalRegression();
    for(var n = 0; n < 20; n++) {
      localRegression.sample(new Date(2001, 1, 1 + n), n * 2);
    }
    let y = localRegression.regression();
    expect(y).toBeCloseTo(38, 2);
  });

});
