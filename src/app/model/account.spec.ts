import { Account } from './account';
import { Asset } from './asset';

class TestAccount extends Account {
  buy(asset: Asset, parts: number): void {
    throw new Error("Method not implemented.");
  }
  sell(asset: Asset, parts: number): void {
    throw new Error("Method not implemented.");
  }
}

describe('Position', () => {
  it('should create an instance', () => {
    expect(new TestAccount()).toBeTruthy();
  });
});
