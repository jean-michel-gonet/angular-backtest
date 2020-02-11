import { BuyAndHoldStrategy } from './strategy.buy-and-hold';
import { Account } from './core/account';
import { InstantQuotes } from './core/quotes';
import { Quote, Position } from './core/asset';
import { RegularTransfer, RegularPeriod } from './core/transfer';


describe('BuyAndHoldStrategy', () => {
  it('Can create a new instance', () => {
    expect(new BuyAndHoldStrategy()).toBeTruthy();
  });


  it('Can perform the initial investment', () => {
    let buyAndHoldStrategy: BuyAndHoldStrategy = new BuyAndHoldStrategy({
      name: "ISIN1"
    });

    let account: Account = new Account({
      strategy: buyAndHoldStrategy,
      cash:1000
    });

    let instantQuotes: InstantQuotes = new InstantQuotes({
      instant: new Date(2010, 10, 10),
      quotes: [
        new Quote({
          name: "ISIN1",
          partValue: 10})
      ]
    });

    account.process(instantQuotes);

    expect(account.cash).toBe(0);
    expect(account.position("ISIN1").parts).toBe(100);
    expect(account.nav()).toBe(1000);
  });

  it('Can reinvest dividends in the quote', () => {
    let buyAndHoldStrategy: BuyAndHoldStrategy = new BuyAndHoldStrategy({
      name: "ISIN1",
      reinvestDividends: true
    });

    let account: Account = new Account({
      strategy: buyAndHoldStrategy,
      cash:0,
      positions: [new Position({name: "ISIN1", parts: 1000})]
    });

    let instantQuotes: InstantQuotes = new InstantQuotes({
      instant: new Date(2010, 10, 10),
      quotes: [
        new Quote({
          name: "ISIN1",
          partValue: 10,
          dividend: 5
        })
      ]
    });
    account.process(instantQuotes);

    expect(account.cash).toBe(0);
    expect(account.position("ISIN1").parts).toBe(1050);
    expect(account.nav()).toBe(10500);

  });

  it('Only reinvest dividends if reinversion is enabled', () => {
    let buyAndHoldStrategy: BuyAndHoldStrategy = new BuyAndHoldStrategy({
      name: "ISIN1"
    });

    let account: Account = new Account({
      strategy: buyAndHoldStrategy,
      cash:0,
      positions: [new Position({name: "ISIN1", parts: 1000})]
    });

    let instantQuotes: InstantQuotes = new InstantQuotes({
      instant: new Date(2010, 10, 10),
      quotes: [
        new Quote({
          name: "ISIN1",
          partValue: 10,
          dividend: 5
        })
      ]
    });
    account.process(instantQuotes);

    expect(account.cash).toBe(500);
    expect(account.position("ISIN1").parts).toBe(1000);
    expect(account.nav()).toBe(10500);
  });

  it('Can output the monthly amount', () => {
    let monthlyOutput: number = 10;
    let accountOutput: Account = new Account();
    let buyAndHoldStrategy: BuyAndHoldStrategy = new BuyAndHoldStrategy({
      name: "ISIN1",
      transfer: new RegularTransfer({
        transfer: monthlyOutput,
        every: RegularPeriod.MONTH,
        to: accountOutput
      })
    });

    let account: Account = new Account({
      strategy: buyAndHoldStrategy,
      cash:0,
      positions: [
        new Position({
          name: "ISIN1",
          parts: 100,
          partValue: 5
        })
      ]
    });
    let instantQuotes: InstantQuotes = new InstantQuotes({
      instant: new Date(2010, 1, 1),
      quotes: [
        new Quote({
          name: "ISIN1",
          partValue: 5})
      ]
    });

    account.process(instantQuotes);

    expect(account.nav()).toBe(100 * 5 - monthlyOutput);
    expect(account.position("ISIN1").parts).toBe(100 - 2);
    expect(accountOutput.cash).toBe(monthlyOutput);
  });
});
