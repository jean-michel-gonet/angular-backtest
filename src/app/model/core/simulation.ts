import { Account } from './account';
import { Report, NullReport } from './reporting';
import { QuotesService } from 'src/app/services/quotes/quotes.service';

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
   */
  run(start?:Date, end?:Date) {
    // Lists all quotes of interest:
    let quotesOfInterest: string[] = [];
    this.accounts.forEach(a => {
      quotesOfInterest.concat(a.listQuotesOfInterest());
    });

    // Retrieves quotes of interest:
    this.quoteService
      .getQuotes(quotesOfInterest)
      .subscribe(historicalQuotes => {

        // Register all reporting sources:
        historicalQuotes.doRegister(this.report);
        this.accounts.forEach(account => {
          account.doRegister(this.report);
        });

        // Run the simulation:
        historicalQuotes.forEachDate(instantQuotes => {
          this.report.startReportingCycle(instantQuotes.instant);
          this.accounts.forEach(account => {
            account.process(instantQuotes);
          });
          this.report.collectReports();
        }, start, end);

        this.report.completeReport();
      });
  }
}
