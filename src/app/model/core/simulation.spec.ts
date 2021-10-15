import { Simulation } from "./simulation";
import { Account, Position } from './account';
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

  constructor(public quotesOfInterest: string[] = []) {
    super();
  }

  clear():void  {
    this.numberOfCalls = 0;
    this.instants = [];
  }

  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    this.numberOfCalls++;
    this.instants.push(instantQuotes.instant.valueOf());
  }

  listQuotesOfInterest(): string[] {
    return this.quotesOfInterest;
  }

}

/**
 * A fake quotes service.
 */
class TestQuotesService implements QuotesService {
  public requestedQuoteNames: string[];
  constructor(private historicalQuotes: HistoricalQuotes) {}
  public getQuotes(names: string[]): Observable<HistoricalQuotes> {
    this.requestedQuoteNames = names;
    return new Observable<HistoricalQuotes>(observer => {
      observer.next(this.historicalQuotes);
      observer.complete();
    });
  }
}

describe('Simulation', () => {
  it('Can create a new instance', (done: DoneFn) => {
    let quotesService = new TestQuotesService(new HistoricalQuotes([]));
    let simulation = new Simulation({
      accounts: [new Account({
        positions: [
          new Position({
            name: "P1"
          }),
          new Position({
            name: "P2"
          })],
        strategy: new TestStrategy(["X1", "X2"])})],
      quoteService: quotesService
    });
    expect(simulation).toBeTruthy();
    simulation.run().subscribe(() => {
      done();
    })
    expect(quotesService.requestedQuoteNames).toEqual(["X1", "X2", "P1", "P2"]);
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

  it('Can run a simulation over the provided instantQuotes data', (done: DoneFn) => {
    strategy.clear();
    let simulationFinished: boolean;
    simulation.run().subscribe(() => {
      simulationFinished = true;
      done();
    });

    // Expect the strategy to have been called the correct number of times:
    expect(strategy.numberOfCalls).toBe(3);

    // Expect the strategy to have received the dates in the proper order:
    expect(strategy.instants).toEqual([
      today.valueOf(),
      tomorrow.valueOf(),
      afterTomorrow.valueOf()]);

    expect(simulationFinished).toBeTrue();
  });

  it('Can run a simulation over the specified range of dates 1', (done: DoneFn) => {
    strategy.clear();
    simulation.run(today, afterTomorrow).subscribe( () => {
      done()
    });

    expect(strategy.numberOfCalls).toBe(3);
  });
  it('Can run a simulation over the specified range of dates 2', (done: DoneFn) => {
    strategy.clear();
    simulation.run(today, tomorrow).subscribe( () => {
      done();
    });
    expect(strategy.numberOfCalls).toBe(2);

  });
  it('Can run a simulation over the specified range of dates 3', (done: DoneFn) => {
    strategy.clear();
    simulation.run(tomorrow, afterTomorrow).subscribe( () => {
      done();
    });
    expect(strategy.numberOfCalls).toBe(2);

  });
  it('Can run a simulation over the specified range of dates 4', (done: DoneFn) => {
    strategy.clear();
    simulation.run(afterTomorrow, afterTomorrow).subscribe( () => {
      done();
    });
    expect(strategy.numberOfCalls).toBe(1);
  });

});
