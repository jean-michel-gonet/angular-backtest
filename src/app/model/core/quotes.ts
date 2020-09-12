import { Reporter, Report, ReportedData } from './reporting';

/**
 * A pair of date / value, to represent any historized value.
 * Typically used for dividends.
 * @class {HistoricalValue}
 */
export class HistoricalValue {
  instant: Date;
  value: number;
}


class ICandleStick {
  close: number;
  open?: number;
  high?: number;
  low?: number;
}

/**
 * The wide part of the candlestick is called the "real body" and tells
 * investors whether the closing price was higher or lower than the opening
 * price (black/red if the stock closed lower, white/green if the
 * stock closed higher).
 * see https://www.investopedia.com/terms/c/candlestick.asp
 * @class{CandlestickType}
 */
export enum CandlestickType {
  GREEN = +1,
  RED = -1
};

/**
 * A candlestick is a type of price chart used that displays the high,
 * low, open, and closing prices of a security for a specific period.
 * It originated from Japanese rice merchants and traders to track market
 * prices and daily momentum hundreds of years before becoming popularized
 * in the United States.
 * see https://www.investopedia.com/terms/c/candlestick.asp
 * @class{Candlestick}
 */
export class Candlestick {
  open: number;
  high: number;
  low: number;
  close: number;

  /**
   * Class constructor.
   */
  constructor(obj: ICandleStick = {} as ICandleStick) {
    let {
      open,
      high,
      low,
      close
    } = obj;
    this.close = close;
    if (open) {
      this.open = open;
    } else {
      this.open = close;
    }
    if (high) {
      this.high = high;
    } else {
      this.high = Math.max(this.open, this.close);
    }
    if (low) {
      this.low = low;
    } else {
      this.low = Math.min(this.open, this.close);
    }
  }

  /**
   * Returns a new candlestick instance representing the merge
   * of this candle and another one.
   * @param {Candlestick} other The other candlestick.
   * @return A new instance.
   */
  merge(other: Candlestick): Candlestick {
    return new Candlestick({
      open: this.open,
      close: other.close,
      high: Math.max(this.high, other.high),
      low: Math.min(this.low, other.low)
    })
  }

  /**
   * Returns the type of candle.
   * GREEN candles have a closing price higher or equal to opening price.
   * Otherwise, the candle is red.
   * @return {CandlestickType} The candle type.
   */
  type(): CandlestickType {
    if (this.close >= this.open) {
      return CandlestickType.GREEN;
    } else {
      return CandlestickType.RED;
    }
  }
}

class IQuote extends ICandleStick {
  name: string;
  volume?: number;
  spread?: number;
  dividend?: number;
  alert?: string;
}

/**
 * A quote is the last price at which a security or commodity traded, meaning
 * the most recent price to which a buyer and seller agreed and at which some
 * amount of the quote was transacted.
 * See https://www.investopedia.com/terms/q/quote.asp
 * @class{Quote}
 */
export class Quote extends Candlestick {
  /** The asset name. */
  name: string;

  /**
   * The number of shares or contracts traded in a security or an
   * entire market during a given period of time.
   * While volume is not directly used when performing operations,
   * it is important to estimate the dividends.
   * see https://www.investopedia.com/terms/v/volume.asp
   */
  volume?: number;

  /**
  * The spread is the gap between the bid and the ask prices of a security
  * or asset, like a stock, bond or commodity.
  * This is known as a bid-ask spread.
  * see https://www.investopedia.com/terms/s/spread.asp
  */
  spread?: number;

  /**
   * A dividend is the distribution of reward from a portion of the company's
   * earnings and is paid to a class of its shareholders.
   * Dividends are given in absolute value per part.
   */
  dividend?: number;

  /**
   * A text describing the kind of anomaly found in the data.
   * For example the infamous 'circuit breakers' that some stock exchange
   * organization implement when things get too scary to continue trading.
   * Could also be any other kind of alert.
   * See https://en.wikipedia.org/wiki/Trading_curb
   */
  alert?: string;

  constructor(obj: IQuote = {} as IQuote) {
    super(obj);
    let {
      name = "",
      volume = 0,
      spread = 0,
      dividend = 0,
      alert
    } = obj;
    this.name = name;
    this.volume = volume;
    this.spread = spread;
    this.dividend = dividend;
    this.alert = alert;
  }
}


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
