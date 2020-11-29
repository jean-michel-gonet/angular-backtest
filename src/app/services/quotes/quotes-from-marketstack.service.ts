import { Injectable } from '@angular/core';
import { HistoricalQuotes, InstantQuotes, Quote } from 'src/app/model/core/quotes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IQuotesService } from './quotes.service.interface';

/**
 * Converts Market Stack data into HistoricalQuotes.
 * @class{MarketStackConverter}
 */
export class MarketStackConverter {
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
        let sixConverter: MarketStackConverter = new MarketStackConverter(name, marketStackData);
        return sixConverter.asHistoricalQuotes();
      }));
  }
}
