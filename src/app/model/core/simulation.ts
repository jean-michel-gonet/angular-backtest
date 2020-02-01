import { StockData } from './stock';
import { Account } from './account';
import { DataProcessor, NullDataProcessor } from './data-processor';

class ISimulation {
  stockData: StockData;
  account: Account;
  dataProcessor?: DataProcessor;

  constructor(obj = {} as ISimulation) {
    let {
      stockData = new StockData([]),
      account = new Account(),
      dataProcessor = new NullDataProcessor()
    } = obj;
    this.stockData = stockData;
    this.account = account;
    this.dataProcessor = dataProcessor;
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
    this.account.accept(this.dataProcessor);
    this.stockData.accept(this.dataProcessor);

    this.stockData.forEachDate(stock => {
      this.dataProcessor.startReportingCycle(stock.time);
      this.account.process(stock);
      this.dataProcessor.collectReports();
    }, start, end);
  }
}
