import { DefaultMarketTiming, BearBull } from "./core/market-timing";
import { DoubleMarketTiming } from './market-timing.double';

class FakeMarketTiming extends DefaultMarketTiming {
  constructor(private status: BearBull) {
    super();
  }
  public setStatus(status: BearBull):void  {
      this.status = status;
  }
  public bearBull(): BearBull {
    return this.status;
  }
}

describe('DoubleMarketTiming', () => {
  it('Can create a new instance', () => {
    let doubleMarketTiming: DoubleMarketTiming = new DoubleMarketTiming({
      bear: new FakeMarketTiming(BearBull.BEAR),
      bull: new FakeMarketTiming(BearBull.BULL),
      status: BearBull.BEAR
    });
    expect(doubleMarketTiming).toBeTruthy();
  });

  it('Can switch from BEAR to BULL when the bull indicator says it', () => {
    let bearIndicator: FakeMarketTiming = new FakeMarketTiming(BearBull.BEAR);
    let bullIndicator: FakeMarketTiming = new FakeMarketTiming(BearBull.BEAR);
    let doubleMarketTiming: DoubleMarketTiming = new DoubleMarketTiming({
      bear: bearIndicator,
      bull: bullIndicator,
      status: BearBull.BEAR
    });
    expect(doubleMarketTiming.bearBull()).toBe(BearBull.BEAR);
    bearIndicator.setStatus(BearBull.BULL);
    expect(doubleMarketTiming.bearBull()).toBe(BearBull.BEAR);
    bullIndicator.setStatus(BearBull.BULL);
    expect(doubleMarketTiming.bearBull()).toBe(BearBull.BULL);
  });

  it('Can switch from BULL to BEAR when the bear indicator says it', () => {
    let bearIndicator: FakeMarketTiming = new FakeMarketTiming(BearBull.BULL);
    let bullIndicator: FakeMarketTiming = new FakeMarketTiming(BearBull.BULL);
    let doubleMarketTiming: DoubleMarketTiming = new DoubleMarketTiming({
      bear: bearIndicator,
      bull: bullIndicator,
      status: BearBull.BULL
    });
    expect(doubleMarketTiming.bearBull()).toBe(BearBull.BULL);
    bullIndicator.setStatus(BearBull.BEAR);
    expect(doubleMarketTiming.bearBull()).toBe(BearBull.BULL);
    bearIndicator.setStatus(BearBull.BEAR);
    expect(doubleMarketTiming.bearBull()).toBe(BearBull.BEAR);
  });
});
