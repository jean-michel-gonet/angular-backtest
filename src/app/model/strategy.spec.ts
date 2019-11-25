import { Strategy } from './strategy';
import { Account } from './account';
import { Stock } from './stock';

class TestStrategy extends Strategy {
  applyStrategy(account: Account, stock: Stock): void {
    throw new Error("Method not implemented.");
  }

}

describe('Strategy', () => {
  it('should create an instance', () => {
    expect(new TestStrategy()).toBeTruthy();
  });
});
