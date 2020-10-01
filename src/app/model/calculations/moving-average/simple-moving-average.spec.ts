import { SimpleMovingAverage } from "./simple-moving-average";

describe("SimpleMovingAverage", () =>{
  it("Can create a new instance", () => {
    let movingAverage = new SimpleMovingAverage(10);
    expect(movingAverage).toBeTruthy();
  });

  it("Can calculate the simple moving average over a range of values", () => {
    let movingAverage = new SimpleMovingAverage(14);

    expect(movingAverage.movingAverageOf(96)).toBeCloseTo(96.00, 2);
    expect(movingAverage.movingAverageOf(89)).toBeCloseTo(92.50, 2);
    expect(movingAverage.movingAverageOf(14)).toBeCloseTo(66.33, 2);
    expect(movingAverage.movingAverageOf(31)).toBeCloseTo(57.50, 2);
    expect(movingAverage.movingAverageOf(65)).toBeCloseTo(59.00, 2);
    expect(movingAverage.movingAverageOf(78)).toBeCloseTo(62.17, 2);
    expect(movingAverage.movingAverageOf(32)).toBeCloseTo(57.86, 2);
    expect(movingAverage.movingAverageOf(96)).toBeCloseTo(62.63, 2);
    expect(movingAverage.movingAverageOf(22)).toBeCloseTo(58.11, 2);
    expect(movingAverage.movingAverageOf(1)).toBeCloseTo(52.40, 2);
    expect(movingAverage.movingAverageOf(62)).toBeCloseTo(53.27, 2);
    expect(movingAverage.movingAverageOf(96)).toBeCloseTo(56.83, 2);
    expect(movingAverage.movingAverageOf(4)).toBeCloseTo(52.77, 2);
    expect(movingAverage.movingAverageOf(91)).toBeCloseTo(55.50, 2);
    expect(movingAverage.movingAverageOf(0)).toBeCloseTo(48.64, 2);
    expect(movingAverage.movingAverageOf(52)).toBeCloseTo(46.00, 2);
    expect(movingAverage.movingAverageOf(57)).toBeCloseTo(49.07, 2);
    expect(movingAverage.movingAverageOf(83)).toBeCloseTo(52.79, 2);
    expect(movingAverage.movingAverageOf(80)).toBeCloseTo(53.86, 2);
    expect(movingAverage.movingAverageOf(13)).toBeCloseTo(49.21, 2);
  });
});
