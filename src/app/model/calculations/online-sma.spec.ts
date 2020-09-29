import { OnlineSma } from "./online-sma";

describe("OnlineSma", () =>{
  it("Can create a new instance", () => {
    let onlineSma = new OnlineSma(10);
    expect(onlineSma).toBeTruthy();
  });

  it("Can calculate the simple moving average over a range of values", () => {
    let onlineSma = new OnlineSma(14);
    let sma: number;

    onlineSma.smaOf(0.91);
    onlineSma.smaOf(0.58);
    onlineSma.smaOf(0.51);
    onlineSma.smaOf(0.50);
    onlineSma.smaOf(0.58);
    onlineSma.smaOf(0.42);
    onlineSma.smaOf(0.26);
    onlineSma.smaOf(0.49);
    onlineSma.smaOf(0.60);
    onlineSma.smaOf(0.32);
    onlineSma.smaOf(0.93);
    onlineSma.smaOf(0.76);
    onlineSma.smaOf(0.45);

    // Returns the simple (not moving) average of previous samples:
    sma = onlineSma.smaOf(0.46);
    expect(sma).toBeCloseTo(0.56, 2);

    // From here, returns the simple moving average:
    sma = onlineSma.smaOf(1.10);
    expect(sma).toBeCloseTo(0.59, 2);

    sma = onlineSma.smaOf(0.48);
    expect(sma).toBeCloseTo(0.59, 2);

    sma = onlineSma.smaOf(0.35);
    expect(sma).toBeCloseTo(0.57, 2);

    sma = onlineSma.smaOf(1.22);
    expect(sma).toBeCloseTo(0.62, 2);

    sma = onlineSma.smaOf(0.65);
    expect(sma).toBeCloseTo(0.62, 2);

    sma = onlineSma.smaOf(0.96);
    expect(sma).toBeCloseTo(0.64, 2);

    sma = onlineSma.smaOf(1.09);
    expect(sma).toBeCloseTo(0.67, 2);

    sma = onlineSma.smaOf(0.93);
    expect(sma).toBeCloseTo(0.69, 2);

    sma = onlineSma.smaOf(1.85);
    expect(sma).toBeCloseTo(0.78, 2);

    sma = onlineSma.smaOf(0.86);
    expect(sma).toBeCloseTo(0.78, 2);

    sma = onlineSma.smaOf(6.77);
    expect(sma).toBeCloseTo(1.21, 2);
  });
});
