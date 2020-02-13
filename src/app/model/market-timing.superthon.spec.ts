import { SuperthonMarketTiming } from "./market-timing.superthon";

describe('SuperthonMarketTiming', () => {
  it('Can create a new instance', () => {
    expect(new SuperthonMarketTiming({
      name: "ISIN1",
      months: 12
    })).toBeTruthy();
  });
});
