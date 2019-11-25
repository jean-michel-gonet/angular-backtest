import { Account } from './account';
import { Asset } from './asset';

class TestAccount extends Account {
  public constructor(obj = {} as TestAccount) {
    super(obj);
  }

  buy(asset: Asset, parts: number): void {
    throw new Error("Method not implemented.");
  }
  sell(asset: Asset, parts: number): void {
    throw new Error("Method not implemented.");
  }
}

describe('Account', () => {
  it('Should be able to compute NAV', () => {
    expect(new TestAccount()).toBeTruthy();
  });
});
