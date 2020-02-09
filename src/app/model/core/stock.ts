import { Quote } from './asset';
import { Reporter, Report, ReportedData } from './reporting';

export class IStock {
  time: Date;
  quotes?: Quote[];

  constructor(obj : IStock) {
    let {
      time,
      quotes = []
    } = obj;
    this.time = time;
    this.quotes = quotes;
  }
}

export class Dividend {
  time: Date;
  name: string;
  dividend: number;
  constructor(obj : Dividend = {} as Dividend) {
    let {
      time,
      name,
      dividend
    } = obj;
    this.time = time;
    this.name = name;
    this.dividend = dividend;
  }
}

export class Stock extends IStock {
  private mapOfQuotes: Map<String, Quote>;

  constructor(obj : IStock = {} as IStock) {
    super(obj);
    this.mapOfQuotes = new Map<String, Quote>();
    this.quotes.forEach(quote => {
      this.mapOfQuotes.set(quote.name, quote);
    });
  }

  /**
   * Handy to make expectations, as IStock is a simpler class.
   * @return {IStock} An instance of a simpler class.
   */
  asIStock(): IStock {
    return new IStock({time: this.time, quotes: this.quotes});
  }

  add(newAssetsOfInterest: Quote[]): void {
    newAssetsOfInterest.forEach(newQuote => {
      let existingQuote = this.mapOfQuotes.get(newQuote.name);
      if (existingQuote) {
        let i = this.quotes.indexOf(existingQuote);
        this.quotes.splice(i, 1);
        this.mapOfQuotes.delete(existingQuote.name);
      }
      this.quotes.push(newQuote);
      this.mapOfQuotes.set(newQuote.name, newQuote);
    });
  }

  /**
   * Returns the specified quote.
   * @param {string} name The ISIN of the asset.
   * @return {Quote} The quote,
   * or null.
   */
  quote(name: String): Quote {
    return this.quotes.find(a => {
      return a.name == name;
    });
  }
}

export class StockData implements Reporter {
  private stock: Stock[] = [];

  constructor(newStocks:IStock[]) {
    newStocks.forEach(newStock => {
      this.stock.push(new Stock(newStock));
    });
    this.stock.sort((a: Stock, b:Stock) => {
      return a.time.valueOf() - b.time.valueOf();
    });
  }

  /**
   * Merge this stock data with another.
   * This stock data gets modified.
   * @param {StockData} otherStockData The other data.
   */
  merge(otherStockData: StockData):void {
    let mergedStockData: Stock[] = [];
    let otherIndex: number = 0;
    let thisIndex: number = 0;


    while(otherIndex < otherStockData.stock.length && thisIndex < this.stock.length) {
      let otherEntry = otherStockData.stock[otherIndex];
      let thisEntry = this.stock[thisIndex];
      if (thisEntry.time.valueOf() == otherEntry.time.valueOf()) {
        let mergedEntry: Stock = new Stock(thisEntry);
        mergedEntry.add(otherEntry.quotes);
        mergedStockData.push(mergedEntry);
        thisIndex++;
        otherIndex++;
      }

      if (thisEntry.time.valueOf() < otherEntry.time.valueOf()) {
        let mergedEntry: Stock = new Stock(thisEntry);
        mergedStockData.push(mergedEntry);
        thisIndex++;
      }

      if (thisEntry.time.valueOf() > otherEntry.time.valueOf()) {
        let mergedEntry: Stock = new Stock(otherEntry);
        mergedStockData.push(mergedEntry);
        otherIndex++;
      }
    }

    while(otherIndex < otherStockData.stock.length) {
      let otherEntry = otherStockData.stock[otherIndex];
      mergedStockData.push(new Stock(otherEntry));
      otherIndex++;
    }

    while(thisIndex < this.stock.length) {
      let thisEntry = this.stock[thisIndex];
      mergedStockData.push(new Stock(thisEntry));
      thisIndex++;
    }

    this.stock = mergedStockData;
  }

  /**
   * Returns the stock at the specified date or, if date is not found,
   * then stock at the pior date.
   * @param {Date} time The relevant date.
   */
  get(time: Date): Stock {
    let valueOf: number = time.valueOf();
    let index: number = this.stock.findIndex(stock => {
      return stock.time.valueOf() >= valueOf;
    });
    if (index < 0) {
      return null;
    } else {
      let stockAtIndex: Stock = this.stock[index];
      if (stockAtIndex.time.valueOf() == valueOf) {
        return stockAtIndex;
      } else {
        if (index == 0) {
          return null;
        } else {
          return this.stock[index - 1];
        }
      }
    }
  }

  enrichWithDividends(dividends: Dividend[]):void {
    let thisIndex: number = 0;
    let dividendIndex: number = 0;

    let previousEntry = this.stock[thisIndex];
    while(dividendIndex < dividends.length && thisIndex < this.stock.length) {
      let dividendEntry = dividends[dividendIndex];
      let thisEntry = this.stock[thisIndex];

      if (thisEntry.time.valueOf() < dividendEntry.time.valueOf()) {
        thisIndex++;
      }

      if (thisEntry.time.valueOf() == dividendEntry.time.valueOf()) {
        let quote = thisEntry.quote(dividendEntry.name);
        quote.dividend = dividendEntry.dividend;
        thisIndex++;
        dividendIndex++;
      }

      if (thisEntry.time.valueOf() > dividendEntry.time.valueOf()) {
        let quote = previousEntry.quote(dividendEntry.name);
        quote.dividend = dividendEntry.dividend;
        dividendIndex++;
      }

      previousEntry = thisEntry;
    }
  }

  /**
   * Transform this stock data into an array of simpler
   * data, that can be displayed as JSON.
   * @return {IStock[]} The array of data.
   */
  asIStock():IStock[] {
    let iStock: IStock[] = [];

    this.stock.forEach(stock => {
      iStock.push(new IStock({
        time: stock.time,
        quotes: stock.quotes
      }));
    });

    return iStock;
  }

  forEachDate(callbackfn:(stock:Stock)=>void, start?:Date, end?: Date):void {
    let firstIndex: number;

    // Look for the index of the start date:
    if (start) {
      firstIndex = this.stock.findIndex(stock => {
        return stock.time.valueOf() >= start.valueOf();
      });
    } else {
      firstIndex = 0;
    }

    // Simulating until specified end date:
    let n: number;
    for(n = firstIndex; n < this.stock.length; n++) {
      let stock: Stock = this.stock[n];
      let time: Date = stock.time;
      if (end && time.valueOf() > end.valueOf()) {
        break;
      }
      this.reportingStock = stock;
      callbackfn(stock);
    }
  }

  // ********************************************************************
  // **                  DataProvider interface.                       **
  // ********************************************************************

  private reportingStock: Stock;

  /**
   * Turns itself in as a data provider to the data processor.
   * @param {Report} report The data processor.
   */
  doRegister(report: Report): void {
    report.register(this);
  }

  /**
   * Next report will be about the closing values of all the assets of interest.
   * @param {Date} time The date to report.
   */
  startReportingCycle(time: Date): void {
    // Let's do nothing.
  }

  /**
   * Reports to a data processor all assets of interest
   * corresponding to the reporting time.
   * @param {Report} report The data processor
   * to report.
   */
  reportTo(report: Report): void {
    this.reportingStock.quotes.forEach(quote => {
      report.receiveData(new ReportedData({
        y: quote.partValue,
        sourceName: quote.name + ".CLOSE"
      }));
    });
  }
}
