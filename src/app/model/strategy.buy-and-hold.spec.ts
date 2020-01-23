import { BuyAndHoldStrategy } from './strategy.buy-and-hold';
import { Account } from './core/account';
import { Stock } from './core/stock';
import { AssetOfInterest } from './core/asset';


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
      time: new Date(),
      assetsOfInterest: [
        new AssetOfInterest({
          isin: "ISIN1",
          partValue: 10})
      ]
    });

    buyAndHoldStrategy.applyStrategy(account, stock);

    expect(account.cash).toBe(0);
    expect(account.position("ISIN1").parts).toBe(100);
  })
});
