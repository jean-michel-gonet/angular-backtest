import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoricalValue } from 'src/app/model/core/quotes';

/**
 * Converts csv file with two columns (Date and Yield) data into
 * an array of HistoricalValue.
 * @class{DateYieldConverter}
 */
export class DateYieldCsvConverter {
  /**
   * Class constructor.
   * @param{string} dateYieldData The content of the CSV file
   * with date and yield columns
   */
  constructor(private dateYieldData: string) {
  }

  /**
   * Transforms the provided CSV file into HistoricalValues.
   * @return {HistoricalValue[]} The transformed data, sorted by date.
   */
  asHistoricalValues(): HistoricalValue[] {
    // Split the CSV file per lines:
    let csvContent: string[] = this.dateYieldData.split(/\r\n|\r|\n/);

    // For each line, extract dividends:
    let historicalValues: HistoricalValue[] = [];
    let lineNumber = 0;
    csvContent.forEach( (line: string) => {
      if (lineNumber++ > 0) {
        let tokens: string[] = line.split(",");
        if (tokens.length == 2) {
          let date             = tokens[0];
          let yyield          = tokens[1];

          let historicalValue: HistoricalValue = {
            instant: this.convertToDate(date),
            value: this.convertToNumber(yyield)
          };
          historicalValues.push(historicalValue);
        }
      }
    });

    // Sort the dividends by date, oldest first:
    historicalValues.sort((a: HistoricalValue, b:HistoricalValue) => {
      return a.instant.valueOf() - b.instant.valueOf();
    });

    // Done:
    return historicalValues;
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

export interface IPlainDataService {
  getHistoricalValues(uri: string): Observable<HistoricalValue[]>;
}

@Injectable({
  providedIn: 'root'
})
export class PlainDataService implements IPlainDataService {
  constructor(private http: HttpClient) {
  }

  /**
   * To retrieve the dividends of the specified instrument.
   * @param {string} uri Where to find the file with data.
   * @return {Observable<HistoricalValue[]>} An observable providing
   * an array of historical values.
   */
  getHistoricalValues(uri: string): Observable<HistoricalValue[]> {
    return new Observable<HistoricalValue[]>(observer => {
      this.http.get(uri, {responseType: 'text'}).subscribe(s => {
        if (!s) {
          throw new Error("Could not find historical values at '" + uri + "'");
        }
        let dateYieldConverter: DateYieldCsvConverter = new DateYieldCsvConverter(s as string);
        observer.next(dateYieldConverter.asHistoricalValues());
        observer.complete();
      });
    });
  }
}
