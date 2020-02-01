import { BuyAndHoldStrategy } from './strategy.buy-and-hold';
import { Account } from './core/account';
import { Stock } from './core/stock';
import { AssetOfInterest, Position } from './core/asset';
import { RegularTransfer, RegularPeriod } from './core/transfer';


describe('BuyAndHoldStrategy', () => {
  it('Can create a new instance', () => {
    expect(new BuyAndHoldStrategy()).toBeTruthy();
  });


  it('Can perform the initial investment', () => {
    let buyAndHoldStrategy: BuyAndHoldStrategy = new BuyAndHoldStrategy({
      isin: "ISIN1"
    });

    let account: Account = new Account({
      cash:1000
    });

    let stock: Stock = new Stock({
      time: new Date(2010, 10, 10),
      assetsOfInterest: [
        new AssetOfInterest({
          isin: "ISIN1",
          partValue: 10})
      ]
    });

    buyAndHoldStrategy.applyStrategy(account, stock);

    expect(account.cash).toBe(0);
    expect(account.position("ISIN1").parts).toBe(100);
    expect(account.nav()).toBe(1000);
  });

  it('Can output the monthly amount', () => {
    let monthlyOutput: number = 10;
    let accountOutput: Account = new Account();
    let buyAndHoldStrategy: BuyAndHoldStrategy = new BuyAndHoldStrategy({
      isin: "ISIN1",
      transfer: new RegularTransfer({
        transfer: monthlyOutput,
        every: RegularPeriod.MONTH,
        to: accountOutput
      })
    });

    let account: Account = new Account({
      cash:0,
      positions: [
        new Position({
          isin: "ISIN1",
          parts: 100,
          partValue: 5
        })
      ]
    });
    let stock: Stock = new Stock({
      time: new Date(2010, 1, 1),
      assetsOfInterest: [
        new AssetOfInterest({
          isin: "ISIN1",
          partValue: 5})
      ]
    });

    buyAndHoldStrategy.applyStrategy(account, stock);

    expect(account.nav()).toBe(100 * 5 - monthlyOutput);
    expect(account.position("ISIN1").parts).toBe(100 - 2);
    expect(accountOutput.cash).toBe(monthlyOutput);
  });
});
