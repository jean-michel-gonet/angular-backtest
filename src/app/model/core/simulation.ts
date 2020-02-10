import { StockData } from './stock';
import { Account } from './account';
import { Report, NullReport } from './reporting';

class ISimulation {
  stockData: StockData;
  account: Account;
  report?: Report;

  constructor(obj = {} as ISimulation) {
    let {
      stockData = new StockData([]),
      account = new Account(),
      report = new NullReport()
    } = obj;
    this.stockData = stockData;
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
    this.stockData.doRegister(this.report);

    this.stockData.forEachDate(stock => {
      this.report.startReportingCycle(stock.instant);
      this.account.process(stock);
      this.report.collectReports();
    }, start, end);
  }
}
