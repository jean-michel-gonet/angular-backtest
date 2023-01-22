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


class CandlestickConfiguration {
  close: number;
  open?: number;
  high?: number;
  low?: number;
  adjustedClose?: number;
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
  adjustedClose: number;

  /**
   * Class constructor.
   */
  constructor(obj: CandlestickConfiguration = {} as CandlestickConfiguration) {
    let {
      close,
      open = close,
      high = Math.max(open, close),
      low = Math.min(open, close),
      adjustedClose = close
    } = obj;
    this.close = close;
    this.open = open;
    this.high = high;
    this.low = low;
    this.adjustedClose = adjustedClose;
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
      low: Math.min(this.low, other.low),
      adjustedClose: other.close,
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

class QuoteConfiguration extends CandlestickConfiguration {
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
  volume: number;

  /**
  * The spread is the gap between the bid and the ask prices of a security
  * or asset, like a stock, bond or commodity.
  * This is known as a bid-ask spread.
  * see https://www.investopedia.com/terms/s/spread.asp
  */
  spread: number;

  /**
   * A dividend is the distribution of reward from a portion of the company's
   * earnings and is paid to a class of its shareholders.
   * Dividends are given in absolute value per part.
   */
  dividend: number;

  /**
   * A text describing the kind of anomaly found in the data.
   * For example the infamous 'circuit breakers' that some stock exchange
   * organization implement when things get too scary to continue trading.
   * Could also be any other kind of alert.
   * See https://en.wikipedia.org/wiki/Trading_curb
   */
  alert: string;

  constructor(obj: QuoteConfiguration = {} as QuoteConfiguration) {
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

  /**
   * Returns the part value to be used during a transaction.
   * Transaction are typically ordered the previous day, and
   * executed this day, at opening.
   * @return {number} The open value, if available. The close value oterwise.
   */
  public partValue(): number {
    if (this.open && this.open > 0) {
      return this.open;
    } else {
      return this.close;
    }
  }
}

/**
 * Interface impemented by any component needing to be provided with specific quotes.
 * Typically, strategies require quotes.
 */
export interface QuotesOfInterest {
  /**
   * Return a list of quote names.
   */
  listQuotesOfInterest(): string[];
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
   * Returns the maximum date present in this historical quote series.
   * @param {string} name The name of the quote to verify.
   */
  maxDate(name: string): Date {
    let maxDate: Date;
    this.instantQuotes.forEach(instantQuote => {
      if (instantQuote.quote(name)) {
        if (maxDate) {
          if (instantQuote.instant.valueOf() > maxDate.valueOf()) {
            maxDate = instantQuote.instant;
          }
        } else {
          maxDate = instantQuote.instant;
        }
      }
    });
    return maxDate;
  }

  /**
   * Returns the maximum date present in this historical quote series.
   * @param {string} name The name of the quote to verify.
   */
  minDate(name: string): Date {
    let minDate: Date;
    this.instantQuotes.forEach(instantQuote => {
      if (instantQuote.quote(name)) {
        if (minDate) {
          if (instantQuote.instant.valueOf() < minDate.valueOf()) {
            minDate = instantQuote.instant;
          }
        } else {
          minDate = instantQuote.instant;
        }
      }
    });
    return minDate;
  }

  /**
   * Adjusts all quotes of the specified name, up to the specified instant,
   * based on the specified values.
   * @param {Date} instant All quotes up to this instant (including this)
   * instant) are adjusted.
   * @param {Quote} quote The quote to perform the adjustment.
   */
  adjust(instant: Date, adjustment: Quote): void {
    // Obtain the adjustment factors:
    let quotes: InstantQuotes = this.get(instant);
    if (quotes) {
      let name = adjustment.name;
      let quoteAtSeamPoint: Quote = quotes.quote(name);
      if (quoteAtSeamPoint) {
        let closeAdjustment: number = adjustment.close / quoteAtSeamPoint.close;
        let openAdjustment: number = adjustment.open / quoteAtSeamPoint.open;
        let highAdjustment: number = adjustment.high / quoteAtSeamPoint.high;
        let lowAdjustment: number = adjustment.low / quoteAtSeamPoint.low;
        let adjAdjustment: number = adjustment.adjustedClose / quoteAtSeamPoint.adjustedClose;
        let volumeAdjustment: number = adjustment.volume / quoteAtSeamPoint.volume;

        // Adjust all previous in series:
        this.forEachDate(instantQuotes => {
          let q = instantQuotes.quote(name);
          q.close = q.close * closeAdjustment;
          q.open = q.open * openAdjustment;
          q.high = q.high * highAdjustment;
          q.low = q.low * lowAdjustment;
          q.volume = q.volume * volumeAdjustment;
          q.adjustedClose = q.adjustedClose * adjAdjustment;
        }, null, instant);
      }
    }
  }

  /**
   * Merge this instantQuotes data with another.
   * This instantQuotes data gets modified.
   * @param {HistoricalQuotes} otherHistoricalQuotes The other data.
   */
  merge(otherHistoricalQuotes: HistoricalQuotes):void {
    let otherIndex: number = 0;
    let thisIndex: number = 0;


    while(otherIndex < otherHistoricalQuotes.instantQuotes.length && thisIndex < this.instantQuotes.length) {
      let otherEntry = otherHistoricalQuotes.instantQuotes[otherIndex];
      let thisEntry = this.instantQuotes[thisIndex];
      if (thisEntry.instant.valueOf() == otherEntry.instant.valueOf()) {
        thisEntry.add(otherEntry.quotes);
        thisIndex++;
        otherIndex++;
        continue;
      }

      if (thisEntry.instant.valueOf() < otherEntry.instant.valueOf()) {
        thisIndex++;
        continue;
      }

      if (thisEntry.instant.valueOf() > otherEntry.instant.valueOf()) {
        this.instantQuotes.splice(thisIndex, 0, otherEntry);
        thisIndex++;
        otherIndex++;
        continue;
      }
    }

    while(otherIndex < otherHistoricalQuotes.instantQuotes.length) {
      this.instantQuotes.push(otherHistoricalQuotes.instantQuotes[otherIndex++]);
    }
  }

  /**
   * Append this historical quotes with the other historical quotes.
   * @param {string} name The name of the instrument to complete.
   * @param {HistoricalQuotes} other The other historical quotes.
   */
  append(name: string, other: HistoricalQuotes) {
    let seamDate = other.minDate(name);
    let adjustmentQuote = other.get(seamDate).quote(name);
    this.adjust(seamDate, adjustmentQuote);
    this.merge(other);
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

  /**
   * Iterates through all available dates between (and including) the specified ones.
   * @param {(InstantQuotes) => void} callbackfn The call back function.
   * @param {Date} start Start from this date.
   * @param {Date} end End with this date.
   */
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
