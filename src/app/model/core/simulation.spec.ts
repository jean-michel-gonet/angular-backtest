import { Simulation } from "./simulation";
import { Account } from './account';
import { HistoricalQuotes, InstantQuotes } from './quotes';
import { NullStrategy } from './strategy';
import { Quote } from './quotes';
import { QuotesService } from 'src/app/services/quotes/quotes.service';
import { Observable } from 'rxjs';

/**
 * A fake strategy, just to verify that it has been called.
 */
class TestStrategy extends NullStrategy {
  numberOfCalls: number = 0;
  instants: number[] = [];

  clear():void  {
    this.numberOfCalls = 0;
    this.instants = [];
  }

  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    this.numberOfCalls++;
    this.instants.push(instantQuotes.instant.valueOf());
  }
}

/**
 * A fake quotes service.
 */
class TestQuotesService implements QuotesService {
  constructor(private historicalQuotes: HistoricalQuotes) {}
  public getQuotes(names: string[]): Observable<HistoricalQuotes> {
    return new Observable<HistoricalQuotes>(observer => {
      observer.next(this.historicalQuotes);
      observer.complete();
    });
  }
}

describe('Simulation', () => {
  it('Can create a new instance', () => {
    expect(new Simulation({
      accounts: [new Account({})],
      quoteService: new TestQuotesService(new HistoricalQuotes([]))
    })).toBeTruthy();
  });

  let now: Date = new Date();
  let today: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let tomorrow: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  let afterTomorrow: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
  var strategy: TestStrategy = new TestStrategy();

  var simulation: Simulation = new Simulation({
    accounts: [new Account({strategy: strategy})],
    quoteService: new TestQuotesService(new HistoricalQuotes([
      new InstantQuotes({
        instant: tomorrow,
        quotes:[
          new Quote({name: "ISIN1", close: 1})
        ]
      }),
      new InstantQuotes({
        instant: afterTomorrow,
        quotes:[
          new Quote({name: "ISIN1", close: 2})
        ]
      }),
      new InstantQuotes({
        instant: today,
        quotes:[
          new Quote({name: "ISIN1", close: 3})
        ]
      })
    ]))
  });

  it('Can run a simulation over the provided instantQuotes data', () => {
    strategy.clear();
    simulation.run();

    // Expect the strategy to have been called the correct number of times:
    expect(strategy.numberOfCalls).toBe(3);

    // Expect the strategy to have received the dates in the proper order:
    expect(strategy.instants).toEqual([
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
