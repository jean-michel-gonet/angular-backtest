import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HistoricalQuotes, InstantQuotes, Quote } from '../../../app/model/core/quotes';
import { IQuotesService } from './quotes.service.interface';

const YAHOO_HEADER: string = "Date,Open,High,Low,Close,Adj Close,Volume";

/**
 * Converts Historical quotes into Yahoo data.
 * @class{YahooWriter}
 */
export class YahooWriter {
  /**
   * Class constructor.
   * @param{string} name The name of the quote to export.
   * @param{HistoricalQuotes} historicalQuotes Historical data containing
   * the quote to export.
   */
  constructor(private name: string, private historicalQuotes: HistoricalQuotes) {
  }

  /**
   * Returns a string containing a csv file with the data extracetd from
   * the historical quotes.
   * @return{string} The yahoo flavored csv file.
   */
  public asYahooCsvFile(): string {
    let csv = YAHOO_HEADER + "\r\n";
    this.historicalQuotes.forEachDate(instantQuotes => {
      let date: Date = instantQuotes.instant;
      let quote: Quote = instantQuotes.quote(this.name);
      let line: string =
        this.formatDate(date) + "," +
        quote.open.toFixed(6) + "," +
        quote.high.toFixed(6) + "," +
        quote.low.toFixed(6) + "," +
        quote.close.toFixed(6) + "," +
        quote.close.toFixed(6) + "," +
        quote.volume.toFixed(6) + "\r\n";
      csv += line;
    });
    return csv;
  }

  private formatDate(date: Date): string {
    let nMonth: number = date.getMonth() + 1;
    let sMonth: string;
    if (nMonth < 10) {
      sMonth = "0" + nMonth.toString();
    } else {
      sMonth = nMonth.toString();
    }
    let sDay = date.getDate().toString()
    let sYear = date.getFullYear().toString();

    return sYear + "-" + sMonth + "-" + sDay;
  }
}

/**
 * Converts Yahoo data into HistoricalQuotes.
 * @class{YahooReader}
 */
export class YahooReader {
  /**
   * Class constructor.
   * @param{string} yahooData The raw data returned by SIX.
   */
  constructor(private name: string, private yahooData: string) {
  }

  /**
   * Transforms the provided Yahoo Finance csv file into HistoricalQuotes.
   * @return {HistoricalQuotes} The transformed data.
   */
  asHistoricalQuotes(): HistoricalQuotes {
    let historicalQuotes: InstantQuotes[] = [];
    let lineNumber = 0;
    let csvContent: string[] = this.yahooData.split(/\r\n|\r|\n/);
    csvContent.forEach( (line: string) => {
      if (lineNumber++ > 0) {
        let tokens: string[] = line.split(",");
        let date          = tokens[0];
        let open          = tokens[1];
        let high          = tokens[2];
        let low           = tokens[3];
        let close         = tokens[4];
        let adjustedClose = tokens[5];
        let volume        = tokens[6];

        let closePrice: number = this.convertToNumber(close);
        if (closePrice) {
          let instantQuotes: InstantQuotes = new InstantQuotes({
            instant: this.convertToDate(date),
            quotes: [
              new Quote({
                name: this.name,
                open: this.convertToNumber(open),
                close: closePrice,
                high: this.convertToNumber(high),
                low: this.convertToNumber(low),
                volume: this.convertToNumber(volume),
                spread: 0,
                dividend: 0})
            ]
          });
          historicalQuotes.push(instantQuotes);
        }
      }
    });
    return new HistoricalQuotes(historicalQuotes);
  }

  /**
   * Converts a Yahoo Finance formatted date into a date.
   * @param {string} yearMonthDay A string representing
   * a date as in @code{1993-02-15}.
   * @return {Date} The date.
   */
  private convertToDate(yearMonthDay: string): Date {
    let tokens: string[] = yearMonthDay.split("-");

    let year: number = parseInt(tokens[0]);
    let month: number = parseInt(tokens[1]) - 1;
    let day: number = parseInt(tokens[2]);

    return new Date(year, month, day);
  }

  /**
   * Converts a string into a number.
   */
   private convertToNumber(a: any): number {
     let s: string = a;
     let n: number = parseFloat(s);
     if (Number.isNaN(n)) {
       return null;
     }
     return n;
   }

}


@Injectable({
  providedIn: 'root'
})
export class QuotesFromYahooService implements IQuotesService {
  constructor(private http: HttpClient) {
  }

  getHistoricalQuotes(source: string, name: string): Observable<HistoricalQuotes> {
    return this.http.get(source,{responseType: 'text'}).pipe(map(s => {
        let yahooReader: YahooReader = new YahooReader(name, s as string);
        return yahooReader.asHistoricalQuotes();
      }));
  }
}
