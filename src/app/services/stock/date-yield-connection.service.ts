import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoricalQuotes, Dividend } from 'src/app/model/core/stock';
import { map } from 'rxjs/operators';
import { ConnectionService } from './connection.service';



/**
 * Converts Date / Yield data into HistoricalQuotes.
 * @class{DateYieldConverter}
 */
export class DateYieldConverter {
  /**
   * Class constructor.
   * @param{string} dateYieldData The raw CSV with date and yield.
   */
  constructor(private name: string, private dateYieldData: string) {
  }

  /**
   * Transforms the provided Yahoo Finance csv file into HistoricalQuotes.
   * @return {HistoricalQuotes} The transformed data.
   */
  asHistoricalQuotes(): Dividend[] {
    let dividends: Dividend[] = [];
    let lineNumber = 0;
    let csvContent: string[] = this.dateYieldData.split(/\r\n|\r|\n/);
    csvContent.forEach( (line: string) => {
      if (lineNumber++ > 0) {
        let tokens: string[] = line.split(",");
        if (tokens.length == 2) {
          let date             = tokens[0];
          let yyield          = tokens[1];

          let dividend: Dividend = new Dividend({
            instant: this.convertToDate(date),
            name: this.name,
            dividend: this.convertToNumber(yyield)
          });
          dividends.push(dividend);
        }
      }
    });
    return dividends;
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
export class DateYieldConnectionService implements ConnectionService {
  constructor(private http: HttpClient) {
  }

  getQuotes(source: string, name: string): Observable<HistoricalQuotes> {
    throw new Error("Method not implemented - Quotes for " + name + " from " + source);
  }

  getDividends(source: string, name: string): Observable<Dividend[]> {
    return this.http.get(source,{responseType: 'text'}).pipe(map(s => {
        let dateYieldConverter: DateYieldConverter = new DateYieldConverter(name, s as string);
        return dateYieldConverter.asHistoricalQuotes();
      }));
  }
}
