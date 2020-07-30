import { OnlineAverage } from "./online-average";

describe("Average", () => {
  it("Can calculate the average of three numbers", () => {
    let average: OnlineAverage = new OnlineAverage();
    average.average(10);
    average.average(12);
    expect(average.average(9)).toBeCloseTo(10.333, 3);
  });
  it("Can calculate the average of more numbers", () => {
    let average: OnlineAverage = new OnlineAverage();
    average.average(1);
    average.average(0);
    average.average(2);
    average.average(6);
    average.average(8);
    average.average(6);
    average.average(6);
    average.average(6);
    average.average(0);
    average.average(10);
    average.average(4);
    average.average(8);
    average.average(8);
    average.average(2);
    average.average(6);
    average.average(3);
    expect(average.average(4)).toBeCloseTo(4.706, 3);
  });
});
