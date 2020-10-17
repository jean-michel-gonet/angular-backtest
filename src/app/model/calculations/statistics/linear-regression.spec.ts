import { LinearRegression } from "./linear-regression";

describe("LinearRegression" , () => {
  it("Can calculate the linear regression", () => {
    let linearRegression: LinearRegression = new LinearRegression();

    linearRegression.regression(0,    -7.00);
    linearRegression.regression(0.08,  6.56);
    linearRegression.regression(0.29,  2.03);
    linearRegression.regression(0.51,  8.57);
    linearRegression.regression(0.56, 11.92);
    linearRegression.regression(0.69, 15.83);
    linearRegression.regression(0.78,  1.46);
    linearRegression.regression(0.98, 16.86);
    linearRegression.regression(1.12,  1.84);
    linearRegression.regression(1.37,  5.59);
    linearRegression.regression(1.42, 10.94);
    linearRegression.regression(1.72,  5.04);
    linearRegression.regression(1.98, 13.86);
    linearRegression.regression(2.12, 13.84);
    linearRegression.regression(2.41, 20.87);
    linearRegression.regression(2.43, 15.01);
    linearRegression.regression(2.67, 19.69);
    linearRegression.regression(2.85, 10.95);
    linearRegression.regression(3,    32.00);

    expect(linearRegression.getA()).toBeCloseTo(6.260, 3);
    expect(linearRegression.getB()).toBeCloseTo(1.946, 3);

    expect(linearRegression.getR()).toBeCloseTo(0.6938, 3);
    expect(linearRegression.getR2()).toBeCloseTo(0.4814, 3);
  });

});
