import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HistoricalQuotes, InstantQuotes, Quote } from '../../../app/model/core/quotes';
import { IQuotesService } from './quotes.service.interface';

const INVESTING_HEADER: string = `"Date","Price","Open","High","Low","Vol.","Change %"`;

/**
 * Converts Historical quotes into Yahoo data.
 * @class{InvestingWriter}
 */
export class InvestingWriter {
  /**
   * Class constructor.
   * @param{string} name The name of the quote to convert.
   * @param{HistoricalQuotes} historicalQuotes Historical data containing
   * the quote to convert.
   */
  constructor(private name: string, private historicalQuotes: HistoricalQuotes) {
  }

  /**
   * Returns a string containing a csv file with the data extracetd from
   * the historical quotes.
   * @return{string} The yahoo flavored csv file.
   */
  public asInvestingCsvFile(): string {
    let csv = INVESTING_HEADER + "\r\n";
    this.historicalQuotes.forEachDate(instantQuotes => {
      let date: Date = instantQuotes.instant;
      let quote: Quote = instantQuotes.quote(this.name);
      let change: number;

      if (quote.open) {
        change = (quote.close - quote.open) / quote.open;
      } else {
        change = 0;
      }

      let line: string =
        this.addQuotes(this.convertDate(date)) + "," +
        this.addQuotes(this.convertNumber(quote.close)) + "," +
        this.addQuotes(this.convertNumber(quote.open)) + "," +
        this.addQuotes(this.convertNumber(quote.high)) + "," +
        this.addQuotes(this.convertNumber(quote.low)) + "," +
        this.addQuotes(this.convertNumber(quote.volume)) + "," +
        this.addQuotes(this.convertNumber(change * 100) + "%") + "\r\n";
      csv += line;
    });
    return csv;
  }

  private convertDate(value: Date): string {
    let sDay: string;
    if (value.getDate() < 10) {
      sDay = "0" + value.getDate();
    } else {
      sDay = value.getDate().toString();
    }

    let sMonth: string;
    if (value.getMonth() < 9) {
      sMonth = "0" + value.getMonth() + 1;
    } else {
      sMonth = (value.getMonth() + 1).toString();
    }

    let sYear = value.getFullYear().toString();

    return sDay + "/" + sMonth + "/" + sYear;
  }

  private convertNumber(value: number): string {
    if (value > 1000000) {
      value /= 1000000;
      return value.toLocaleString('en-US', {maximumFractionDigits:2}) + "M";
    }
    return value.toLocaleString('en-US', {maximumFractionDigits:2})
  }

  private addQuotes(s: string): string {
    return "\"" + s  + "\"";
  }

}

/**
 * Converts Investing data into HistoricalQuotes.
 * @class{InvestingReader}
 */
export class InvestingReader {
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
        let tokens: string[] = line.split("\",\"");
        let sDate: string = this.trimQuotes(tokens[0]);
        let sPrice:    string = this.trimQuotes(tokens[1]);
        let sOpen:     string = this.trimQuotes(tokens[2]);
        let sHigh:     string = this.trimQuotes(tokens[3]);
        let sLow:      string = this.trimQuotes(tokens[4]);
        let sVolume:   string = this.trimQuotes(tokens[5]);

        let alert: string;
        let volume: number = this.convertToNumber(sVolume);
        if (!volume) {
          alert = "Circuit Breaker"
        }
        let instantQuotes: InstantQuotes = new InstantQuotes({
          instant: this.convertToDate(sDate),
          quotes: [
            new Quote({
              name: this.name,
              open: this.convertToNumber(sOpen),
              close: this.convertToNumber(sPrice),
              high: this.convertToNumber(sHigh),
              low: this.convertToNumber(sLow),
              volume: volume,
              alert: alert,
              spread: 0,
              dividend: 0})
          ]
        });
        historicalQuotes.push(instantQuotes);
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
   * @param {string} sDate A string representing
   * a date, like in @code{Apr 09, 2020}.
   * @return {Date} The date.
   */
  private convertToDate(sDate: string): Date {
    let token:string[] = sDate.split("/");
    let sMonthDay: string = token[0];
    let sMonth: string = token[1];
    let sYear: string = token[2];

    let day: number = parseInt(sMonthDay);
    let month: number = parseInt(sMonth) - 1;
    let year: number = parseInt(sYear);

    return new Date(year, month, day);
  }

  /**
   * Converts a string into a number.
   */
   private convertToNumber(s: string): number {
     if (s == '') {
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
     s = s.replace(",", "");
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
      console.log("Retrieved " + s.length + " chars in investing.com format for " + name, source);
      let investingReader: InvestingReader = new InvestingReader(name, s as string);
      return investingReader.asHistoricalQuotes();
    }));
  }
}
