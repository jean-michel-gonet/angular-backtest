import { OnlineLinearRegression } from "./linear-regression";

describe("OnlineLinearRegression" , () => {
  it("Can calculate the linear regression", () => {
    let onlineLinearRegression: OnlineLinearRegression = new OnlineLinearRegression();

    onlineLinearRegression.regression(0,    -7.00);
    onlineLinearRegression.regression(0.08,  6.56);
    onlineLinearRegression.regression(0.29,  2.03);
    onlineLinearRegression.regression(0.51,  8.57);
    onlineLinearRegression.regression(0.56, 11.92);
    onlineLinearRegression.regression(0.69, 15.83);
    onlineLinearRegression.regression(0.78,  1.46);
    onlineLinearRegression.regression(0.98, 16.86);
    onlineLinearRegression.regression(1.12,  1.84);
    onlineLinearRegression.regression(1.37,  5.59);
    onlineLinearRegression.regression(1.42, 10.94);
    onlineLinearRegression.regression(1.72,  5.04);
    onlineLinearRegression.regression(1.98, 13.86);
    onlineLinearRegression.regression(2.12, 13.84);
    onlineLinearRegression.regression(2.41, 20.87);
    onlineLinearRegression.regression(2.43, 15.01);
    onlineLinearRegression.regression(2.67, 19.69);
    onlineLinearRegression.regression(2.85, 10.95);
    onlineLinearRegression.regression(3,    32.00);

    expect(onlineLinearRegression.getA()).toBeCloseTo(6.260, 3);
    expect(onlineLinearRegression.getB()).toBeCloseTo(1.946, 3);
  })
});
