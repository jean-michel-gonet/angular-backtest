import { CumulativeMovingAverage } from "./cumulative-moving-average";

describe("Average", () => {
  it("Can calculate the movingAverage of three numbers", () => {
    let movingAverage: CumulativeMovingAverage = new CumulativeMovingAverage();
    movingAverage.movingAverageOf(10);
    movingAverage.movingAverageOf(12);
    expect(movingAverage.movingAverageOf(9)).toBeCloseTo(10.333, 3);
  });
  it("Can calculate the movingAverage of more numbers", () => {
    let movingAverage: CumulativeMovingAverage = new CumulativeMovingAverage();
    movingAverage.movingAverageOf(1);
    movingAverage.movingAverageOf(0);
    movingAverage.movingAverageOf(2);
    movingAverage.movingAverageOf(6);
    movingAverage.movingAverageOf(8);
    movingAverage.movingAverageOf(6);
    movingAverage.movingAverageOf(6);
    movingAverage.movingAverageOf(6);
    movingAverage.movingAverageOf(0);
    movingAverage.movingAverageOf(10);
    movingAverage.movingAverageOf(4);
    movingAverage.movingAverageOf(8);
    movingAverage.movingAverageOf(8);
    movingAverage.movingAverageOf(2);
    movingAverage.movingAverageOf(6);
    movingAverage.movingAverageOf(3);
    expect(movingAverage.movingAverageOf(4)).toBeCloseTo(4.706, 3);
  });
});
