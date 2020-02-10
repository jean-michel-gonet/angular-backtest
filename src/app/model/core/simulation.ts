import { HistoricalQuotes } from './quotes';
import { Account } from './account';
import { Report, NullReport } from './reporting';

class ISimulation {
  historicalQuotes: HistoricalQuotes;
  account: Account;
  report?: Report;

  constructor(obj = {} as ISimulation) {
    let {
      historicalQuotes = new HistoricalQuotes([]),
      account = new Account(),
      report = new NullReport()
    } = obj;
    this.historicalQuotes = historicalQuotes;
    this.account = account;
    this.report = report;
  }
}

/**
 * A class performing a back test simulation based on stock data,
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
    this.account.doRegister(this.report);
    this.historicalQuotes.doRegister(this.report);

    this.historicalQuotes.forEachDate(stock => {
      this.report.startReportingCycle(stock.instant);
      this.account.process(stock);
      this.report.collectReports();
    }, start, end);
  }
}
