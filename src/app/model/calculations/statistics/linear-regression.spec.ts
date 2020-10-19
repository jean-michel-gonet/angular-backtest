import { LinearRegression } from "./linear-regression";

describe("LinearRegression" , () => {
  it("Can calculate the linear regression 1", () => {
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

  it("Can calculate the linear regression 2", () => {
    let linear: LinearRegression = new LinearRegression();

    linear.regression(new Date(2018,  1 - 1,  1), 2099);
    linear.regression(new Date(2018,  1 - 1, 17), 1997.73687449615);
    linear.regression(new Date(2018,  2 - 1,  2), 2015.47525735881);
    linear.regression(new Date(2018,  2 - 1, 15), 2010.88880499162);
    linear.regression(new Date(2018,  2 - 1, 25), 2042.97682794115);
    linear.regression(new Date(2018,  3 - 1, 15), 1965.93675740886);
    linear.regression(new Date(2018,  4 - 1,  1), 1985.78956019036);
    linear.regression(new Date(2018,  4 - 1, 20), 1994.86236303265);
    linear.regression(new Date(2018,  5 - 1,  4), 1953.39105926891);
    linear.regression(new Date(2018,  5 - 1, 15), 1947.59299257059);
    linear.regression(new Date(2018,  5 - 1, 28), 2020.01438429742);
    linear.regression(new Date(2018,  6 - 1,  7), 2044.10844493122);
    linear.regression(new Date(2018,  6 - 1, 17), 2035.20309929525);
    linear.regression(new Date(2018,  7 - 1,  7), 2008.39419050299);
    linear.regression(new Date(2018,  7 - 1, 22), 2110.03906984833);
    linear.regression(new Date(2018,  8 - 1,  4), 2097.46571513887);
    linear.regression(new Date(2018,  8 - 1, 22), 2086.44273203496);
    linear.regression(new Date(2018,  9 - 1,  4), 2083.87177877199);
    linear.regression(new Date(2018,  9 - 1, 18), 1941.41187978314);
    linear.regression(new Date(2018, 10 - 1,  5), 2035.28357577108);
    linear.regression(new Date(2018, 10 - 1, 22), 2060.15699884705);
    linear.regression(new Date(2018, 11 - 1,  7), 2002.92179967879);
    linear.regression(new Date(2018, 11 - 1, 27), 1986.12995611956);
    linear.regression(new Date(2018, 12 - 1, 15), 2119.11934654796);
    linear.regression(new Date(2019,  1 - 1,  4), 2059.33206011583);
    linear.regression(new Date(2019,  1 - 1, 14), 2123.43931758594);
    linear.regression(new Date(2019,  1 - 1, 29), 2106.10133056541);
    linear.regression(new Date(2019,  2 - 1, 15), 1947.98658109145);


    expect(linear.getA()).toBeCloseTo(44.2778, 3);
    expect(linear.getB()).toBeCloseTo(2007.212, 3);

    expect(linear.getR()).toBeCloseTo(0.26645, 3);
    expect(linear.getR2()).toBeCloseTo(0.07099, 3);
  });

});
