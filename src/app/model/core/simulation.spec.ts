import { Simulation } from "./simulation";
import { Account } from './account';
import { StockData, InstantQuotes } from './stock';
import { NullStrategy } from './strategy';
import { Quote } from './asset';

/**
 * A fake strategy, just to verify that it has been called.
 */
class TestStrategy extends NullStrategy {
  numberOfCalls: number = 0;
  stockTimes: number[] = [];

  clear():void  {
    this.numberOfCalls = 0;
    this.stockTimes = [];
  }

  applyStrategy(account: Account, stock: InstantQuotes): void {
    this.numberOfCalls++;
    this.stockTimes.push(stock.instant.valueOf());
  }
}

describe('Simulation', () => {
  it('Can create a new instance', () => {
    expect(new Simulation({
      account: new Account({}),
      stockData: new StockData([])
    })).toBeTruthy();
  });

  let now: Date = new Date();
  let today: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let tomorrow: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  let afterTomorrow: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
  var strategy: TestStrategy = new TestStrategy();

  var simulation: Simulation = new Simulation({
    account: new Account({strategy: strategy}),
    stockData: new StockData([
      new InstantQuotes({
        instant: tomorrow,
        quotes:[
          new Quote({name: "ISIN1", partValue: 1})
        ]
      }),
      new InstantQuotes({
        instant: afterTomorrow,
        quotes:[
          new Quote({name: "ISIN1", partValue: 2})
        ]
      }),
      new InstantQuotes({
        instant: today,
        quotes:[
          new Quote({name: "ISIN1", partValue: 3})
        ]
      })
    ])
  });

  it('Can run a simulation over the provided stock data', () => {
    strategy.clear();
    simulation.run();

    // Expect the strategy to have been called the correct number of times:
    expect(strategy.numberOfCalls).toBe(3);

    // Expect the strategy to have received the dates in the proper order:
    expect(strategy.stockTimes).toEqual([
      today.valueOf(),
      tomorrow.valueOf(),
      afterTomorrow.valueOf()]);
  });
  it('Can run a simulation over the specified range of dates', () => {
    strategy.clear();
    simulation.run(today, afterTomorrow);
    expect(strategy.numberOfCalls).toBe(3);

    strategy.clear();
    simulation.run(today, tomorrow);
    expect(strategy.numberOfCalls).toBe(2);

    strategy.clear();
    simulation.run(tomorrow, afterTomorrow);
    expect(strategy.numberOfCalls).toBe(2);

    strategy.clear();
    simulation.run(afterTomorrow, afterTomorrow);
    expect(strategy.numberOfCalls).toBe(1);
  });

});
