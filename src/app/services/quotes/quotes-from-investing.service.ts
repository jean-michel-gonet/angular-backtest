import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoricalQuotes, InstantQuotes, Quote } from 'src/app/model/core/quotes';
import { map } from 'rxjs/operators';
import { IQuotesService } from './quotes.service.interface';

/**
 * Converts Investing data into HistoricalQuotes.
 * @class{InvestingConverter}
 */
export class InvestingConverter {
  /**
   * Class constructor.
   * @param{string} investingData The raw data downloaded from Investing.com.
   */
  constructor(private name: string, private investingData: string) {
  }

  /**
   * Transforms the provided Investing csv file into HistoricalQuotes.
   * @return {HistoricalQuotes} The transformed data.
   */
  asHistoricalQuotes(): HistoricalQuotes {
    let historicalQuotes: InstantQuotes[] = [];
    let lineNumber = 0;
    let csvContent: string[] = this.investingData.split(/\r\n|\r|\n/);
    csvContent.forEach( (line: string) => {
      if (lineNumber++ > 0 && line.length > 0) {
        let tokens: string[] = line.split(",");
        let sMonthDay: string = this.trimQuotes(tokens[0]);
        let sYear:     string = this.trimQuotes(tokens[1]);
        let sPrice:    string = this.trimQuotes(tokens[2]);
        let sOpen:     string = this.trimQuotes(tokens[3]);
        let sHigh:     string = this.trimQuotes(tokens[4]);
        let sLow:      string = this.trimQuotes(tokens[5]);
        let sVolume:   string = this.trimQuotes(tokens[6]);
        let sChange:   string = this.trimQuotes(tokens[7]);

        let volume: number = this.convertToNumber(sVolume);
        if (volume) {
          let instantQuotes: InstantQuotes = new InstantQuotes({
            instant: this.convertToDate(sMonthDay, sYear),
            quotes: [
              new Quote({
                name: this.name,
                open: this.convertToNumber(sOpen),
                close: this.convertToNumber(sPrice),
                high: this.convertToNumber(sHigh),
                low: this.convertToNumber(sLow),
                volume: this.convertToNumber(sVolume),
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

  private trimQuotes(value: string): string {
    while(value[0] == '"') {
      value = value.slice(1);
    }
    while(value[value.length - 1] == '"') {
      value = value.slice(0, -1);
    }
    return value;
  }
  /**
   * Converts a Yahoo Finance formatted date into a date.
   * @param {string} sMonthDay A string representing
   * a month and day, like in @code{Apr 09}.
   * @param {string} sYear A string with an integer, representing
   * the year.
   * @return {Date} The date.
   */
  private convertToDate(sMonthDay: string, sYear: string): Date {
    let year: number = parseInt(sYear);

    let tokens: string[] = sMonthDay.split(" ");
    let day: number = parseInt(tokens[1]);

    let month: number = this.convertToMonth(tokens[0]);

    return new Date(year, month, day);
  }

  private convertToMonth(sMonth: string): number {
    switch(sMonth) {
      case 'Jan':
        return 0;
      case 'Feb':
        return 1;
      case 'Mar':
        return 2;
      case 'Apr':
        return 3;
      case 'May':
        return 4;
      case 'Jun':
        return 5;
      case 'Jul':
        return 6;
      case 'Aug':
        return 7;
      case 'Sep':
        return 8;
      case 'Oct':
        return 9;
      case 'Nov':
        return 10;
      case 'Dec':
        return 11;
    }
    return null;
  }
  /**
   * Converts a string into a number.
   */
   private convertToNumber(s: string): number {
     if (s == '-') {
       return undefined;
     }
     let exponent: number = 1;
     if (s[s.length - 1] == 'M') {
       s = s.slice(0, -1);
       exponent = 1000000;
     }
     if (s[s.length - 1] == 'K') {
       s = s.slice(0, -1);
       exponent = 1000
     }
     let value: number = parseFloat(s) * exponent;
     return value;
   }
}


@Injectable({
  providedIn: 'root'
})
export class QuotesFromInvestingService implements IQuotesService {
  constructor(private http: HttpClient) {
  }

  getHistoricalQuotes(source: string, name: string): Observable<HistoricalQuotes> {
    return this.http.get(source,{responseType: 'text'}).pipe(map(s => {
        let investingConverter: InvestingConverter = new InvestingConverter(name, s as string);
        return investingConverter.asHistoricalQuotes();
      }));
  }
}
