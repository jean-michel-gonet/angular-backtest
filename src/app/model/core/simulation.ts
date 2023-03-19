import { Account } from './account';
import { Report, NullReport } from './reporting';
import { QuotesService } from 'src/app/services/quotes/quotes.service';
import { Observable, Observer } from 'rxjs';

interface SimulationConfig {
  quoteService: QuotesService;
  accounts: Account[];
  report?: Report;
}

/**
 * A class performing a back test simulation based on instantQuotes data,
 * over the specified account.
 */
export class Simulation {
  public quoteService: QuotesService;
  public accounts: Account[];
  public report: Report;

  constructor(obj = {} as SimulationConfig) {
    let {
      quoteService,
      accounts,
      report = new NullReport()
    } = obj;
    this.quoteService = quoteService;
    this.accounts = accounts;
    this.report = report;
  }

  /**
   * Runs the simulation.
   * @param {Date} start Starts the simulation at this date.
   * @param {Date} end Ends the simulation at this date.
   * @return Subscribe to the returned observable to launch simulation.
   */
  run(start?:Date, end?:Date): Observable<void> {
    // Lists all quotes of interest:
    let quotesOfInterest = this.listQuotesOfInterest();

    // As soon as an observer subscribes:
    return new Observable(o => {
      // Retrieves quotes of interest:
      console.log("Simulation: Retrieving quotes of interest", quotesOfInterest);
      this.quoteService
        .getQuotes(quotesOfInterest)
        .subscribe(historicalQuotes => {
          console.log("Simulation: Retrieved quotes of interest");

          // Register all reporting sources:
          historicalQuotes.doRegister(this.report);
          this.accounts.forEach(account => {
            account.doRegister(this.report);
          });

          // Run the simulation:
          console.log("Simulation: All accounts registerd, let's start");
          historicalQuotes.forEachDate(instantQuotes => {
            console.log("Simulation: ", instantQuotes.instant);
            this.report.startReportingCycle(instantQuotes.instant);
            this.accounts.forEach(account => {
              account.process(instantQuotes);
            });
            this.report.collectReports();
          }, start, end);

          this.report.completeReport();
          o.next();
          o.complete();
        });
    });
  }

  private listQuotesOfInterest(): string[] {
    let quotesOfInterest: string[] = this.report.listQuotesOfInterest();
    this.accounts.forEach(a => {
      quotesOfInterest = quotesOfInterest.concat(a.listQuotesOfInterest());
    });
    return quotesOfInterest;
  }
}
