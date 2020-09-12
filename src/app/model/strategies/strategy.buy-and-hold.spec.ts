import { BuyAndHoldStrategy } from './strategy.buy-and-hold';
import { Account, Position } from '../core/account';
import { InstantQuotes, Quote } from '../core/quotes';
import { RegularTransfer, RegularPeriod } from '../core/transfer';
import { DefaultMarketTiming, BearBull } from '../core/market-timing';


describe('BuyAndHoldStrategy', () => {
  it('Can create a new instance', () => {
    expect(new BuyAndHoldStrategy()).toBeTruthy();
  });


  it('Can perform the initial investment', () => {
    let buyAndHoldStrategy: BuyAndHoldStrategy = new BuyAndHoldStrategy({
      assetName: "ISIN1"
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
          close: 10})
      ]
    });

    account.process(instantQuotes);

    expect(account.cash).toBe(0);
    expect(account.position("ISIN1").parts).toBe(100);
    expect(account.nav()).toBe(1000);
  });

  it('Can reinvest dividends in the quote', () => {
    let buyAndHoldStrategy: BuyAndHoldStrategy = new BuyAndHoldStrategy({
      assetName: "ISIN1"
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
          close: 10,
          dividend: 0.5
        })
      ]
    });
    account.process(instantQuotes);

    expect(account.cash).toBe(0);
    expect(account.position("ISIN1").parts).toBe(1050);
    expect(account.nav()).toBe(10500);

  });

  class MarketTimingMock extends DefaultMarketTiming {
    constructor(private _bearBull: BearBull){
      super();
    }
    public setBearBull(bearBull: BearBull = BearBull.BEAR): void {
      this._bearBull = bearBull;
    };
    public bearBull(): BearBull {
      return this._bearBull;
    }
  }

  it('Can sell everything on Bear period', () => {
    let buyAndHoldStrategy: BuyAndHoldStrategy = new BuyAndHoldStrategy({
      assetName: "ISIN1",
      marketTiming: new MarketTimingMock(BearBull.BEAR)
    });

    let account: Account = new Account({
      strategy: buyAndHoldStrategy,
      cash: 0,
      positions: [
        new Position({
          name: "ISIN1",
          partValue: 10,
          parts: 100})]
    });

    let instantQuotes: InstantQuotes = new InstantQuotes({
      instant: new Date(2010, 10, 10),
      quotes: [
        new Quote({
          name: "ISIN1",
          close: 10})
      ]
    });

    account.process(instantQuotes);

    expect(account.cash).toBe(1000);
    expect(account.position("ISIN1").parts).toBe(0);
    expect(account.nav()).toBe(1000);
  });

  it('Can reinvest everything in asset for Bear period', () => {
    let buyAndHoldStrategy: BuyAndHoldStrategy = new BuyAndHoldStrategy({
      assetName: "ISIN1",
      assetNameDuringBear: "ISIN2",
      marketTiming: new MarketTimingMock(BearBull.BEAR)
    });

    let account: Account = new Account({
      strategy: buyAndHoldStrategy,
      cash: 0,
      positions: [
        new Position({
          name: "ISIN1",
          partValue: 10,
          parts: 100})]
    });

    let instantQuotes: InstantQuotes = new InstantQuotes({
      instant: new Date(2010, 10, 10),
      quotes: [
        new Quote({name: "ISIN1", close: 10}),
        new Quote({name: "ISIN2", close: 20})
      ]
    });

    account.process(instantQuotes);

    expect(account.cash).toBe(0);
    expect(account.position("ISIN1").parts).toBe(0);
    expect(account.position("ISIN2").parts).toBe(50);
    expect(account.nav()).toBe(1000);
  });


  it('Can output the monthly amount', () => {
    let monthlyOutput: number = 10;
    let accountOutput: Account = new Account();
    let buyAndHoldStrategy: BuyAndHoldStrategy = new BuyAndHoldStrategy({
      assetName: "ISIN1",
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
          close: 5})
      ]
    });

    account.process(instantQuotes);

    expect(account.nav()).toBe(100 * 5 - monthlyOutput);
    expect(account.position("ISIN1").parts).toBe(100 - 2);
    expect(accountOutput.cash).toBe(monthlyOutput);
  });
});
