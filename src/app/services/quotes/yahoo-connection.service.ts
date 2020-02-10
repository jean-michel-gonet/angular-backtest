import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoricalQuotes, InstantQuotes, Dividend } from 'src/app/model/core/quotes';
import { map } from 'rxjs/operators';
import { Quote } from 'src/app/model/core/asset';
import { IQuotesService } from './quotes.service.interface';



/**
 * Converts Yahoo data into HistoricalQuotes.
 * @class{YahooConverter}
 */
export class YahooConverter {
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

        let partValue: number = this.convertToNumber(close);
        if (partValue) {
          let stock: InstantQuotes = new InstantQuotes({
            instant: this.convertToDate(date),
            quotes: [
              new Quote({
                name: this.name,
                partValue: this.convertToNumber(partValue),
                spread: 0,
                dividend: 0})
            ]
          });
          historicalQuotes.push(stock);
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
        let yahooConverter: YahooConverter = new YahooConverter(name, s as string);
        return yahooConverter.asHistoricalQuotes();
      }));
  }

  getDividends(source: string): Observable<Dividend[]> {
    throw new Error("Method not implemented.");
  }

}
