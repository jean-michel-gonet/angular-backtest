import { Account } from './account';
import { NullStrategy } from './strategy';
import { Stock } from './stock';
import { Position, AssetOfInterest } from './asset';

class MockStrategy extends NullStrategy {
  gotCalled: boolean = false;

  applyStrategy(account: Account, stock: Stock): void {
    this.gotCalled = true;
  }
}

describe('Account', () => {
  it('Can calculate NAV', () => {
    let account: Account = new Account({
      cash: 1000.0,
      strategy: new MockStrategy(),
      positions: [
        new Position({
          isin: "XX",
          partValue: 100,
          parts: 3
        }),
        new Position({
          isin: "XX",
          partValue: 10,
          parts: 4
        })
      ]
    });
    expect(account.nav()).toBe(1000 + 3 * 100 + 4 * 10);
  });

  it('Can process stock updates and call the strategy', () => {
    let strategy: MockStrategy = new MockStrategy();
    let stock: Stock = new Stock({
      time: new Date(),
      assetsOfInterest: [
        new AssetOfInterest({isin: "XX", partValue: 110}),
        new AssetOfInterest({isin: "YY", partValue: 11})
      ]
    });
    let account: Account = new Account({
      cash: 1000.0,
      strategy: strategy,
      positions: [
        new Position({
          isin: "XX",
          partValue: 100,
          parts: 3
        }),
        new Position({
          isin: "YY",
          partValue: 10,
          parts: 4
        })
      ]
    });
    account.process(stock);
    expect(strategy.gotCalled).toBeTruthy();
    expect(account.nav()).toBe(1000 + 3 * 110 + 4 * 11);
  });

  it('Can cash the dividends coming from the positions', () => {
    let strategy: MockStrategy = new MockStrategy();
    let stock: Stock = new Stock({
      time: new Date(),
      assetsOfInterest: [
        new AssetOfInterest({isin: "YY", partValue: 11, dividend: 10})
      ]
    });
    let account: Account = new Account({
      cash: 1000.0,
      strategy: strategy,
      positions: [
        new Position({
          isin: "YY",
          partValue: 10,
          parts: 4
        })
      ]
    });
    account.process(stock);
    expect(account.cash).toBe(1004.4);
    expect(account.nav()).toBe(1004.4 + 4 * 11);
  });

  it('Can calculate costs based on the spread', () => {
    let partValue: number = 110;
    let spread: number = 0.1;
    let assetOfInterest: AssetOfInterest = new AssetOfInterest({
      isin: "XX",
      partValue: partValue,
      spread: spread
    });
    let account = new Account();
    expect(account.orderCost(assetOfInterest, 2)).toBe(2 * partValue * spread / 2);
    expect(account.orderCost(assetOfInterest, -3)).toBe(3 * partValue * spread / 2);
  });

  it('Can buy an asset taking in count the costs', () => {
    let partValue: number = 110;
    let spread: number = 0.1;
    let cash: number = 1000;

    let assetOfInterest: AssetOfInterest = new AssetOfInterest({
      isin: "XX",
      partValue: partValue,
      spread: spread
    });
    let account: Account = new Account({
      cash: cash
    });

    let costs = account.orderCost(assetOfInterest, 3);
    expect(costs).toBe(3 * partValue * spread / 2);

    account.order(assetOfInterest, 3);
    expect(account.cash).toBe(cash - 3 * partValue - costs);
    expect(account.nav()).toBe(cash - costs);
  });

  it('Can sell an asset taking in count the costs', () => {
    let partValue: number = 110;
    let spread: number = 0.1;
    let cash: number = 1000;

    let assetOfInterest: AssetOfInterest = new AssetOfInterest({
      isin: "XX",
      partValue: partValue,
      spread: spread
    });
    let account: Account = new Account({
      cash: cash,
      positions: [
        new Position({isin: "XX", parts: 4})
      ]
    });

    let costs = account.orderCost(assetOfInterest, -3);
    expect(costs).toBe(3 * partValue * spread / 2);

    account.order(assetOfInterest, -3);
    expect(account.cash).toBe(cash + 3 * partValue - costs);
    expect(account.nav()).toBe(cash + 4 * partValue - costs);
  });

  it('Can obtain one single position identified by its ISIN', () => {
    let account: Account = new Account({
      cash: 1000.0,
      strategy: new MockStrategy(),
      positions: [
        new Position({
          isin: "XX",
          partValue: 100,
          parts: 3
        }),
        new Position({
          isin: "YY",
          partValue: 10,
          parts: 4
        })
      ]
    });
    let position: Position = account.position("XX");
    expect(position).toEqual(new Position({
      isin: "XX",
      partValue: 100,
      parts: 3
    }));
  });

  it('Can transfer an amount of cash to another account', () => {
    let account1: Account = new Account({
      cash: 1000.0
    });
    let account2: Account = new Account({
      cash: 0
    });

    account1.transfer(account2, 250);

    expect(account1.cash).toBe(750);
    expect(account1.nav()).toBe(750);

    expect(account2.cash).toBe(250);
    expect(account2.nav()).toBe(250);
  });

  it('Can transfer an amount of cash to another account only if available', () => {
    let account1: Account = new Account({
      cash: 200.0
    });
    let account2: Account = new Account({
      cash: 0
    });

    account1.transfer(account2, 250);

    expect(account1.cash).toBe(200);
    expect(account2.cash).toBe(0);
  });

  class MockAccount extends Account {
    transferCost(account: Account, amount: number): number {
      return 100;
    }
  }

  it('Can compute possible costs when transfer an amount of cash to another account', () => {
    let account1: Account = new MockAccount({
      cash: 1000.0
    });
    let account2: Account = new Account({
      cash: 0
    });

    account1.transfer(account2, 250);

    expect(account1.cash).toBe(750);
    expect(account2.cash).toBe(150);
  });

});
