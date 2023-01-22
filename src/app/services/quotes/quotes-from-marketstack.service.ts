import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IQuotesService } from './quotes.service.interface';
import { HistoricalQuotes, InstantQuotes, Quote } from '../../../app/model/core/quotes';

/**
 * Converts Market Stack data into HistoricalQuotes.
 * @class{MarketStackReader}
 */
export class MarketStackReader {
  /**
   * Class constructor.
   * @param{any} sixData The raw data returned by SIX.
   */
  constructor(private name: string, private marketStackData: any) {
  }

  /**
   * Transforms the provided SIX data into HistoricalQuotes.
   * @return {HistoricalQuotes} The transformed data.
   */
  asHistoricalQuotes(): HistoricalQuotes {
    let data: any[] = this.marketStackData.data;

    let historicalQuotes: InstantQuotes[] = [];
    data.forEach(datum => {
      let date: Date = this.convertToDate(datum.date);
      let open: number = datum.open;
      let high: number = datum.high;
      let low: number = datum.low;
      let close:number = datum.close;
      let adjustedClose: number = datum.adj_close;
      let volume: number = datum.volume;

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
    });
    return new HistoricalQuotes(historicalQuotes);
  }

  private convertToDate(dateAndTime: string): Date {
    //2020-11-27T00:00:00+0000
    let t1: string[] = dateAndTime.split("T");
    let t2: string[] = t1[0].split("-");
    let year: number = parseInt(t2[0]);
    let month: number = parseInt(t2[1]);
    let day: number = parseInt(t2[2]);
    return new Date(year, month - 1, day);
  }
}

@Injectable({
  providedIn: 'root'
})
export class QuotesFromMarketStackService implements IQuotesService {

  constructor(private http: HttpClient) {
  }

  getHistoricalQuotes(source: string, name: string): Observable<HistoricalQuotes> {
    return this.http.get(source).pipe(map(marketStackData => {
      console.log("Retrieved Market Stack data for " + name, source);
      let reader: MarketStackReader = new MarketStackReader(name, marketStackData);
      return reader.asHistoricalQuotes();
    }));
  }
}
