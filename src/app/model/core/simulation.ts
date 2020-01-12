import { StockData } from './stock';
import { Account } from './account';

class ISimulation {
  stockData: StockData;
  account: Account;

  constructor(obj = {} as ISimulation) {
    let {
      stockData = new StockData([]),
      account = new Account(),
    } = obj;
    this.stockData = stockData;
    this.account = account;
  }
}

export class Simulation extends ISimulation {
  constructor(obj = {} as ISimulation) {
    super(obj);
  }

  run(start?:Date, end?:Date) {
    this.stockData.forEachDate(stock => {
      this.account.process(stock);
    }, start, end);
  }
}
