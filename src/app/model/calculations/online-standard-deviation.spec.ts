import { OnlineStandardDeviation } from "./online-standard-deviation";

describe("OnlineStandardDeviation", () => {
  it("Can calculate the standard deviation", () => {
    let onlineStandardDeviation: OnlineStandardDeviation = new OnlineStandardDeviation();

    onlineStandardDeviation.std(1);
    onlineStandardDeviation.std(0);
    onlineStandardDeviation.std(2);
    onlineStandardDeviation.std(6);
    onlineStandardDeviation.std(8);
    onlineStandardDeviation.std(6);
    onlineStandardDeviation.std(6);
    onlineStandardDeviation.std(6);
    onlineStandardDeviation.std(0);
    onlineStandardDeviation.std(10);
    onlineStandardDeviation.std(4);
    onlineStandardDeviation.std(8);
    onlineStandardDeviation.std(8);
    onlineStandardDeviation.std(2);
    onlineStandardDeviation.std(6);
    onlineStandardDeviation.std(3);
    expect(onlineStandardDeviation.std(4)).toBeCloseTo(2.926, 3);
  });
});
