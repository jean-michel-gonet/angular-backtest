import { BuyAndHoldStrategy } from './strategy.buy-and-hold';


describe('BuyAndHoldStrategy', () => {
  it('Can create a new instance', () => {
    expect(new BuyAndHoldStrategy()).toBeTruthy();
  });
});
