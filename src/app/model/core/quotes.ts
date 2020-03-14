import { Quote } from './asset';
import { Reporter, Report, ReportedData } from './reporting';

export class IInstantQuotes {
  instant: Date;
  quotes?: Quote[];

  constructor(obj : IInstantQuotes) {
    let {
      instant,
      quotes = []
    } = obj;
    this.instant = instant;
    this.quotes = quotes;
  }
}

export class Dividend {
  instant: Date;
  name: string;
  dividend: number;
  constructor(obj : Dividend = {} as Dividend) {
    let {
      instant,
      name,
      dividend
    } = obj;
    this.instant = instant;
    this.name = name;
    this.dividend = dividend;
  }
}

export class InstantQuotes extends IInstantQuotes {
  private mapOfQuotes: Map<String, Quote>;

  constructor(obj : IInstantQuotes = {} as IInstantQuotes) {
    super(obj);
    this.mapOfQuotes = new Map<String, Quote>();
    this.quotes.forEach(quote => {
      this.mapOfQuotes.set(quote.name, quote);
    });
  }

  /**
   * Handy to make expectations, as IInstantQuotes is a simpler class.
   * @return {IInstantQuotes} An instance of a simpler class.
   */
  asIStock(): IInstantQuotes {
    return new IInstantQuotes({instant: this.instant, quotes: this.quotes});
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
   * @param {string} name The ISIN of the quote.
   * @return {Quote} The quote,
   * or null.
   */
  quote(name: String): Quote {
    return this.quotes.find(a => {
      return a.name == name;
    });
  }
}

export class HistoricalQuotes implements Reporter {
  private instantQuotes: InstantQuotes[] = [];

  constructor(instantQuotesArray:IInstantQuotes[]) {
    instantQuotesArray.forEach(instantQuotes => {
      this.instantQuotes.push(new InstantQuotes(instantQuotes));
    });
    this.instantQuotes.sort((a: InstantQuotes, b:InstantQuotes) => {
      return a.instant.valueOf() - b.instant.valueOf();
    });
  }

  /**
   * Merge this instantQuotes data with another.
   * This instantQuotes data gets modified.
   * @param {HistoricalQuotes} otherHistoricalQuotes The other data.
   */
  merge(otherHistoricalQuotes: HistoricalQuotes):void {
    let mergedHistoricalQuotes: InstantQuotes[] = [];
    let otherIndex: number = 0;
    let thisIndex: number = 0;


    while(otherIndex < otherHistoricalQuotes.instantQuotes.length && thisIndex < this.instantQuotes.length) {
      let otherEntry = otherHistoricalQuotes.instantQuotes[otherIndex];
      let thisEntry = this.instantQuotes[thisIndex];
      if (thisEntry.instant.valueOf() == otherEntry.instant.valueOf()) {
        let mergedEntry: InstantQuotes = new InstantQuotes(thisEntry);
        mergedEntry.add(otherEntry.quotes);
        mergedHistoricalQuotes.push(mergedEntry);
        thisIndex++;
        otherIndex++;
      }

      if (thisEntry.instant.valueOf() < otherEntry.instant.valueOf()) {
        let mergedEntry: InstantQuotes = new InstantQuotes(thisEntry);
        mergedHistoricalQuotes.push(mergedEntry);
        thisIndex++;
      }

      if (thisEntry.instant.valueOf() > otherEntry.instant.valueOf()) {
        let mergedEntry: InstantQuotes = new InstantQuotes(otherEntry);
        mergedHistoricalQuotes.push(mergedEntry);
        otherIndex++;
      }
    }

    while(otherIndex < otherHistoricalQuotes.instantQuotes.length) {
      let otherEntry = otherHistoricalQuotes.instantQuotes[otherIndex];
      mergedHistoricalQuotes.push(new InstantQuotes(otherEntry));
      otherIndex++;
    }

    while(thisIndex < this.instantQuotes.length) {
      let thisEntry = this.instantQuotes[thisIndex];
      mergedHistoricalQuotes.push(new InstantQuotes(thisEntry));
      thisIndex++;
    }

    this.instantQuotes = mergedHistoricalQuotes;
  }

  /**
   * Returns the instantQuotes at the specified date or, if date is not found,
   * then instantQuotes at the pior date.
   * @param {Date} instant The relevant date.
   */
  get(instant: Date): InstantQuotes {
    let valueOf: number = instant.valueOf();
    let index: number = this.instantQuotes.findIndex(instantQuotes => {
      return instantQuotes.instant.valueOf() >= valueOf;
    });
    if (index < 0) {
      return null;
    } else {
      let instantQuotesAtIndex: InstantQuotes = this.instantQuotes[index];
      if (instantQuotesAtIndex.instant.valueOf() == valueOf) {
        return instantQuotesAtIndex;
      } else {
        if (index == 0) {
          return null;
        } else {
          return this.instantQuotes[index - 1];
        }
      }
    }
  }

  enrichWithDividends(dividends: Dividend[]):void {
    let thisIndex: number = 0;
    let dividendIndex: number = 0;

    let previousEntry = this.instantQuotes[thisIndex];
    while(dividendIndex < dividends.length && thisIndex < this.instantQuotes.length) {
      let dividendEntry = dividends[dividendIndex];
      let thisEntry = this.instantQuotes[thisIndex];

      if (thisEntry.instant.valueOf() < dividendEntry.instant.valueOf()) {
        thisIndex++;
      }

      if (thisEntry.instant.valueOf() == dividendEntry.instant.valueOf()) {
        let quote = thisEntry.quote(dividendEntry.name);
        quote.dividend = dividendEntry.dividend;
        thisIndex++;
        dividendIndex++;
      }

      if (thisEntry.instant.valueOf() > dividendEntry.instant.valueOf()) {
        let quote = previousEntry.quote(dividendEntry.name);
        quote.dividend = dividendEntry.dividend;
        dividendIndex++;
      }

      previousEntry = thisEntry;
    }
  }

  /**
   * Transform this instantQuotes data into an array of simpler
   * data, that can be displayed as JSON.
   * @return {IInstantQuotes[]} The array of data.
   */
  asIStock():IInstantQuotes[] {
    let iStock: IInstantQuotes[] = [];

    this.instantQuotes.forEach(instantQuotes => {
      iStock.push(new IInstantQuotes({
        instant: instantQuotes.instant,
        quotes: instantQuotes.quotes
      }));
    });

    return iStock;
  }

  forEachDate(callbackfn:(instantQuotes:InstantQuotes)=>void, start?:Date, end?: Date):void {
    let firstIndex: number;

    // Look for the index of the start date:
    if (start) {
      firstIndex = this.instantQuotes.findIndex(instantQuotes => {
        return instantQuotes.instant.valueOf() >= start.valueOf();
      });
    } else {
      firstIndex = 0;
    }

    // Simulating until specified end date:
    let n: number;
    for(n = firstIndex; n < this.instantQuotes.length; n++) {
      let instantQuotes: InstantQuotes = this.instantQuotes[n];
      let instant: Date = instantQuotes.instant;
      if (end && instant.valueOf() > end.valueOf()) {
        break;
      }
      this.reportingStock = instantQuotes;
      callbackfn(instantQuotes);
    }
  }

  // ********************************************************************
  // **                  DataProvider interface.                       **
  // ********************************************************************

  private reportingStock: InstantQuotes;

  /**
   * Turns itself in as a data provider to the data processor.
   * @param {Report} report The data processor.
   */
  doRegister(report: Report): void {
    report.register(this);
  }

  /**
   * Next report will be about the closing values of all the assets of interest.
   * @param {Date} instant The date to report.
   */
  startReportingCycle(instant: Date): void {
    // Let's do nothing.
  }

  /**
   * Reports to a data processor all assets of interest
   * corresponding to the reporting instant.
   * @param {Report} report The data processor
   * to report.
   */
  reportTo(report: Report): void {
    this.reportingStock.quotes.forEach(quote => {
      report.receiveData(new ReportedData({
        y: quote.close,
        sourceName: quote.name + ".CLOSE"
      }));
    });
  }
}
