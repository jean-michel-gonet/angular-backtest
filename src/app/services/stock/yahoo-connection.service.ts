import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockData, Stock } from 'src/app/model/core/stock';
import { map } from 'rxjs/operators';
import { AssetOfInterest } from 'src/app/model/core/asset';



/**
 * Converts Yahoo data into StockData.
 * @class{YahooConverter}
 */
export class YahooConverter {
  /**
   * Class constructor.
   * @param{string} yahooData The raw data returned by SIX.
   */
  constructor(private isin: string, private yahooData: string) {
  }

  /**
   * Transforms the provided Yahoo Finance csv file into StockData.
   * @return {StockData} The transformed data.
   */
  asStockData(): StockData {
    let stockData: StockData = new StockData([]);
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
          let stock: Stock = new Stock({
            time: this.convertToDate(date),
            assetsOfInterest: [
              new AssetOfInterest({
                isin: this.isin,
                name: this.isin,
                partValue: this.convertToNumber(partValue),
                spread: 0,
                dividend: 0})
            ]
          });
          stockData.add(stock);
        }
      }
    });
    return stockData;
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
export class YahooConnectionService {

  constructor(private http: HttpClient) {
  }

  getQuotes(isin:string, file: string): Observable<StockData> {
    return this.http.get(file,{responseType: 'text'}).pipe(map(s => {
        let yahooConverter: YahooConverter = new YahooConverter(isin, s as string);
        return yahooConverter.asStockData();
      }));
  }
}
