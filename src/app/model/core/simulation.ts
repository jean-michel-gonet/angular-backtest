import { HistoricalQuotes } from './quotes';
import { Account } from './account';
import { Report, NullReport } from './reporting';

class ISimulation {
  historicalQuotes: HistoricalQuotes;
  accounts: Account[];
  report?: Report;

  constructor(obj = {} as ISimulation) {
    let {
      historicalQuotes = new HistoricalQuotes([]),
      accounts = [],
      report = new NullReport()
    } = obj;
    this.historicalQuotes = historicalQuotes;
    this.accounts = accounts;
    this.report = report;
  }
}

/**
 * A class performing a back test simulation based on instantQuotes data,
 * over the specified account.
 */
export class Simulation extends ISimulation {
  constructor(obj = {} as ISimulation) {
    super(obj);
  }

  /**
   * Runs the simulation.
   * @param {Date} start Starts the simulation at this date.
   * @param {Date} end Ends the simulation at this date.
   */
  run(start?:Date, end?:Date) {
    this.accounts.forEach(account => {
      account.doRegister(this.report);
    });
    this.historicalQuotes.doRegister(this.report);

    this.historicalQuotes.forEachDate(instantQuotes => {
      this.report.startReportingCycle(instantQuotes.instant);
      this.accounts.forEach(account => {
        account.process(instantQuotes);
      });
      this.report.collectReports();
    }, start, end);

    this.report.completeReport();
  }
}
