import { SmoothedMovingAverage } from "./smoothed-moving-average";

describe("SmoothedMovingAverage", () =>{
  it("Can create a new instance", () => {
    let movingAverage = new SmoothedMovingAverage(10);
    expect(movingAverage).toBeTruthy();
  });

  it("Can calculate the smoothed moving average over a range of values", () => {
    let movingAverage = new SmoothedMovingAverage(14);
    let sma: number;

    movingAverage.movingAverageOf(0.91);
    movingAverage.movingAverageOf(0.58);
    movingAverage.movingAverageOf(0.51);
    movingAverage.movingAverageOf(0.50);
    movingAverage.movingAverageOf(0.58);
    movingAverage.movingAverageOf(0.42);
    movingAverage.movingAverageOf(0.26);
    movingAverage.movingAverageOf(0.49);
    movingAverage.movingAverageOf(0.60);
    movingAverage.movingAverageOf(0.32);
    movingAverage.movingAverageOf(0.93);
    movingAverage.movingAverageOf(0.76);
    movingAverage.movingAverageOf(0.45);

    // Returns the simple (not moving) average of previous samples:
    sma = movingAverage.movingAverageOf(0.46);
    expect(sma).toBeCloseTo(0.56, 2);

    // From here, returns the simple moving average:
    sma = movingAverage.movingAverageOf(1.10);
    expect(sma).toBeCloseTo(0.59, 2);

    sma = movingAverage.movingAverageOf(0.48);
    expect(sma).toBeCloseTo(0.59, 2);

    sma = movingAverage.movingAverageOf(0.35);
    expect(sma).toBeCloseTo(0.57, 2);

    sma = movingAverage.movingAverageOf(1.22);
    expect(sma).toBeCloseTo(0.62, 2);

    sma = movingAverage.movingAverageOf(0.65);
    expect(sma).toBeCloseTo(0.62, 2);

    sma = movingAverage.movingAverageOf(0.96);
    expect(sma).toBeCloseTo(0.64, 2);

    sma = movingAverage.movingAverageOf(1.09);
    expect(sma).toBeCloseTo(0.67, 2);

    sma = movingAverage.movingAverageOf(0.93);
    expect(sma).toBeCloseTo(0.69, 2);

    sma = movingAverage.movingAverageOf(1.85);
    expect(sma).toBeCloseTo(0.78, 2);

    sma = movingAverage.movingAverageOf(0.86);
    expect(sma).toBeCloseTo(0.78, 2);

    sma = movingAverage.movingAverageOf(6.77);
    expect(sma).toBeCloseTo(1.21, 2);
  });
});
