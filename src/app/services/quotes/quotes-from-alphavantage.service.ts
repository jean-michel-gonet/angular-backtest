import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IQuotesService } from './quotes.service.interface';
import { HistoricalQuotes, InstantQuotes, Quote } from '../../../app/model/core/quotes';

/**
 * Converts Alpha Vantage data into HistoricalQuotes.
 * @class{AlphaVantageReader}
 */
export class AlphaVantageReader {
  /**
   * Class constructor.
   * @param{string} name The name of the asset.
   * @param{any} alphaVantageData The raw data returned by Alpha Vantage.
   */
  constructor(private name: string, private alphaVantageData: any) {
  }

  /**
   * Transforms the provided Alpha Vantage date into HistoricalQuotes.
   * @return {HistoricalQuotes} The transformed data.
   */
  asHistoricalQuotes(): HistoricalQuotes {
    let data: any = this.alphaVantageData["Time Series (Daily)"];

    let historicalQuotes: InstantQuotes[] = [];
    for(let sDate in data) {
      if (data.hasOwnProperty(sDate)) {
        let date: Date = this.convertToDate(sDate);

        let datum: any = data[sDate];
        let open: number = parseFloat(datum["1. open"]);
        let high: number = parseFloat(datum["2. high"]);
        let low: number = parseFloat(datum["3. low"]);
        let close:number = parseFloat(datum["4. close"]);
        let adjustedClose: number = parseFloat(datum["5. adjusted close"]);
        let volume: number = parseFloat(datum["6. volume"]);
        let instantQuotes: InstantQuotes = new InstantQuotes({
          instant: date,
          quotes: [
            new Quote({
              name: this.name,
              close: close,
              open: open,
              high: high,
              low: low,
              adjustedClose: adjustedClose,
              volume: volume,
              spread: 0,
              dividend: 0
            })
          ]
        });
        historicalQuotes.push(instantQuotes);
      }
    }
    return new HistoricalQuotes(historicalQuotes);
  }

  private convertToDate(dateAndTime: string): Date {
    //2020-11-27
    let t: string[] = dateAndTime.split("-");
    let year: number = parseInt(t[0]);
    let month: number = parseInt(t[1]);
    let day: number = parseInt(t[2]);
    return new Date(year, month - 1, day);
  }
}

@Injectable({
  providedIn: 'root'
})
export class QuotesFromAlphaVantageService implements IQuotesService {

  constructor(private http: HttpClient) {
  }

  getHistoricalQuotes(source: string, name: string): Observable<HistoricalQuotes> {
    return this.http.get(source).pipe(map(alphaVantageData => {
      console.log("Retrieved Alpha Vantage data for " + name, source);
      let reader: AlphaVantageReader = new AlphaVantageReader(name, alphaVantageData);
      return reader.asHistoricalQuotes();
    }));
  }
}
