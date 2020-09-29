import { Account, Position } from './account';
import { NullStrategy } from './strategy';
import { InstantQuotes, Quote } from './quotes';


describe('Position', () => {
  it('Can calculate the NAV', () => {
    let position = new Position({
      name: "XX",
      partValue: 1.5,
      parts: 3
    });
    expect(position.nav()).toBe(4.5);
  });

  it('Can update its part value', () => {
    let position = new Position({
      name: "XX",
      parts: 6
    });

    position.update(new Quote({name: "XX", close: 1.5}));
    expect(position.nav()).toBe(9);
  });
});

class MockStrategy extends NullStrategy {
  gotCalled: boolean = false;

  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
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
          name: "XX",
          partValue: 100,
          parts: 3
        }),
        new Position({
          name: "XX",
          partValue: 10,
          parts: 4
        })
      ]
    });
    expect(account.nav()).toBe(1000 + 3 * 100 + 4 * 10);
  });

  it('Can process instantQuotes updates and call the strategy', () => {
    let strategy: MockStrategy = new MockStrategy();
    let instantQuotes: InstantQuotes = new InstantQuotes({
      instant: new Date(),
      quotes: [
        new Quote({name: "XX", close: 110}),
        new Quote({name: "YY", close: 11})
      ]
    });
    let account: Account = new Account({
      cash: 1000.0,
      strategy: strategy,
      positions: [
        new Position({
          name: "XX",
          partValue: 100,
          parts: 3
        }),
        new Position({
          name: "YY",
          partValue: 10,
          parts: 4
        })
      ]
    });
    account.process(instantQuotes);
    expect(strategy.gotCalled).toBeTruthy();
    expect(account.nav()).toBe(1000 + 3 * 110 + 4 * 11);
  });

  it('Can cash the dividends coming from the positions', () => {
    let strategy: MockStrategy = new MockStrategy();
    let instantQuotes: InstantQuotes = new InstantQuotes({
      instant: new Date(),
      quotes: [
        new Quote({name: "YY", close: 11, dividend: 5})
      ]
    });
    let account: Account = new Account({
      cash: 1000.0,
      strategy: strategy,
      positions: [
        new Position({
          name: "YY",
          partValue: 10,
          parts: 4
        })
      ]
    });
    account.process(instantQuotes);
    expect(account.cash).toBe(1000 + 4 * 5);
    expect(account.nav()).toBe(1000 + 4 * 5 + 4 * 11);
  });

  it('Can calculate costs based on the spread', () => {
    let partValue: number = 110;
    let spread: number = 0.1;
    let quote: Quote = new Quote({
      name: "XX",
      close: partValue,
      spread: spread
    });
    let account = new Account();
    expect(account.orderCost(quote, 2)).toBe(2 * partValue * spread / 2);
    expect(account.orderCost(quote, -3)).toBe(3 * partValue * spread / 2);
  });

  it("Can buy an instrument using next day's open value, taking in count the costs", () => {
    let partOpenValue: number = 110;
    let partCloseValue: number = 55;
    let spread: number = 0.1;
    let initialCash: number = 1000;

    let account: Account = new Account({
      cash: initialCash
    });
    // Parts are ordered today:
    account.order("XX", 3);

    // But are executed next opening day, at open value:
    account.process(new InstantQuotes({
      instant: new Date(),
      quotes: [
        new Quote({
          name: "XX",
          open: partOpenValue,
          close: partCloseValue,
          spread: spread
        })
      ]
    }));

    let costs = account.accumulatedCosts;
    expect(costs).toBe(3 * partOpenValue * spread / 2);

    let cash = account.cash
    expect(cash).toBe(initialCash - 3 * partOpenValue - costs);

    let nav = account.nav();
    expect(nav).toBe(3 * partCloseValue + cash);
  });

  it("Can prevent buying more parts of an instrument when there is not enough cash", () => {
    let partOpenValue: number = 110;
    let partCloseValue: number = 55;
    let spread: number = 0.1;
    let initialCash: number = 1000;

    let account: Account = new Account({
      cash: initialCash
    });

    // Order a big bunch of parts:
    account.order("XX", 30);

    // Execute next opening day:
    account.process(new InstantQuotes({
      instant: new Date(),
      quotes: [
        new Quote({
          name: "XX",
          open: partOpenValue,
          close: partCloseValue,
          spread: spread
        })
      ]
    }));

    let position: Position = account.position("XX");

    // Bought parts only up to available cash:
    // (The -1 is because of the costs)
    let expectedParts = Math.floor(initialCash / partOpenValue) - 1;
    expect(position.parts).toBe(8);

    // Costs are based on the number of parts actually bought.
    let costs = expectedParts * partOpenValue * spread / 2
    expect(account.accumulatedCosts).toBe(costs);
  });

  it("Can sell an instrument using next day's open value, taking in count the costs", () => {
    let partOpenValue: number = 110;
    let partCloseValue: number = 55;
    let spread: number = 0.1;
    let initialCash: number = 1000;

    let account: Account = new Account({
      cash: initialCash,
      positions: [
        new Position({name: "XX", parts: 4})
      ]
    });

    // Parts are ordered today:
    account.order("XX", -3);

    // But are executed next opening day, at open value:
    account.process(new InstantQuotes({
      instant: new Date(),
      quotes: [
        new Quote({
          name: "XX",
          open: partOpenValue,
          close: partCloseValue,
          spread: spread
        })
      ]
    }));

    let costs = account.accumulatedCosts;
    expect(costs).toBe(3 * partOpenValue * spread / 2);

    let cash = account.cash
    expect(cash).toBe(initialCash + 3 * partOpenValue - costs);

    let nav = account.nav();
    expect(nav).toBe(1 * partCloseValue + cash);
  });

  it("Can prevent selling more parts of an instrument that available", () => {
    let partOpenValue: number = 110;
    let partCloseValue: number = 55;
    let spread: number = 0.1;
    let initialCash: number = 0;

    let account: Account = new Account({
      cash: initialCash,
      positions: [
        new Position({name: "XX", parts: 4})
      ]
    });

    // Sell a lot of parts:
    account.order("XX", -50);

    // Execute at next opening day:
    account.process(new InstantQuotes({
      instant: new Date(),
      quotes: [
        new Quote({
          name: "XX",
          open: partOpenValue,
          close: partCloseValue,
          spread: spread
        })
      ]
    }));

    let position: Position = account.position("XX");
    expect(position.parts).toBe(0);
    let costs = 4 * partOpenValue * spread / 2;
    expect(account.accumulatedCosts).toBe(costs);
  });

  it('Can obtain one single position identified by its ISIN', () => {
    let account: Account = new Account({
      cash: 1000.0,
      strategy: new MockStrategy(),
      positions: [
        new Position({
          name: "XX",
          partValue: 100,
          parts: 3
        }),
        new Position({
          name: "YY",
          partValue: 10,
          parts: 4
        })
      ]
    });
    let position: Position = account.position("XX");
    expect(position).toEqual(new Position({
      name: "XX",
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
