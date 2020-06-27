import { OnlineLinearRegression } from "./linear-regression";

describe("OnlineLinearRegression" , () => {
  it("Can calculate the linear regression", () => {
    let onlineLinearRegression: OnlineLinearRegression = new OnlineLinearRegression();

    onlineLinearRegression.regression(new Date(2020, 6 - 1, 29), 29);
    onlineLinearRegression.regression(new Date(2020, 6 - 1, 30), 47);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 1), 77);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 2), 101);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 3), 125);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 6), 151);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 7), 176);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 8), 201);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 9), 223);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 10), 251);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 13), 270);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 14), 300);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 15), 323);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 16), 348);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 17), 378);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 18), 397);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 21), 423);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 22), 448);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 23), 479);

    expect(onlineLinearRegression.getA()).toBeCloseTo(18.143, 3);
    expect(onlineLinearRegression.getB()).toBeCloseTo(36.898, 3);
  })

  it("Can calculate the linear regression bis", () => {
    let onlineLinearRegression: OnlineLinearRegression = new OnlineLinearRegression();

    onlineLinearRegression.regression(new Date(2020, 6 - 1, 29), 6);
    onlineLinearRegression.regression(new Date(2020, 6 - 1, 30), 10);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 1), 25);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 2), 27);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 3), 34);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 6), 40);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 7), 48);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 8), 56);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 9), 58);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 10), 67);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 13), 78);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 14), 81);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 15), 91);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 16), 97);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 17), 107);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 18), 113);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 21), 118);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 22), 122);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 23), 137);

    expect(onlineLinearRegression.getA()).toBeCloseTo(5.154, 3);
    expect(onlineLinearRegression.getB()).toBeCloseTo(8.717, 3);
  });

  it("Can calculate the linear regression tris", () => {
    let onlineLinearRegression: OnlineLinearRegression = new OnlineLinearRegression();

    onlineLinearRegression.regression(new Date(2020, 6 - 1, 29), 998);
    onlineLinearRegression.regression(new Date(2020, 6 - 1, 30), 1006);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 1), 1005);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 2), 1006);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 3), 1005);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 6), 1011);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 7), 1009);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 8), 1017);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 9), 1022);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 10), 1023);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 13), 1021);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 14), 1028);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 15), 1028);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 16), 1027);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 17), 1033);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 18), 1027);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 21), 1029);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 22), 1041);
    onlineLinearRegression.regression(new Date(2020, 7 - 1, 23), 1043);

    expect(onlineLinearRegression.getA()).toBeCloseTo(1.613, 3);
    expect(onlineLinearRegression.getB()).toBeCloseTo(1001.021, 3);
  });
});
