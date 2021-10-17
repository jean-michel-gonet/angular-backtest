import { ExponentialMovingAverage } from "./exponential-moving-average";

describe("ExponentialMovingAverage", () => {
  it("Can calculate the exponential moving average", () => {
    let movingAverage = new ExponentialMovingAverage(10);

    movingAverage.movingAverageOf(1);
    movingAverage.movingAverageOf(2);
    movingAverage.movingAverageOf(3);
    movingAverage.movingAverageOf(4);
    movingAverage.movingAverageOf(5);
    movingAverage.movingAverageOf(6);
    movingAverage.movingAverageOf(7);
    movingAverage.movingAverageOf(8);
    movingAverage.movingAverageOf(9);

    // Returns the simple (not moving) average of previous samples:
    expect(movingAverage.movingAverageOf(10)).toBe(5.5);

    // From here, returns the simple moving average:
    expect(movingAverage.movingAverageOf(20)).toBeCloseTo( 8.14, 2);
    expect(movingAverage.movingAverageOf(30)).toBeCloseTo(12.11, 2);
    expect(movingAverage.movingAverageOf(40)).toBeCloseTo(17.18, 2);
  });
});
