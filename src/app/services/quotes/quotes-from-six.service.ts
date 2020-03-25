import { Injectable } from '@angular/core';
import { HistoricalQuotes, InstantQuotes, Quote } from 'src/app/model/core/quotes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IQuotesService } from './quotes.service.interface';

/**
 * Converts SIX data into HistoricalQuotes.
 * @class{SixConverter}
 */
export class SixConverter {
  /**
   * Class constructor.
   * @param{any} sixData The raw data returned by SIX.
   */
  constructor(private name: string, private sixData: any) {
  }

  /**
   * Transforms the provided SIX data into HistoricalQuotes.
   * @return {HistoricalQuotes} The transformed data.
   */
  asHistoricalQuotes(): HistoricalQuotes {
    let valors:any[] = this.sixData.valors;

    let historicalQuotes: InstantQuotes[] = [];
    valors.forEach(valor => {
      let data:any = valor.data;
      let dates:number[] = data.Date;
      let close:number[] = data.Close;
      let open: number[] = data.Open;
      let high: number[] = data.High;
      let low: number[] = data.Low;
      let volume: number[] = data.TotalVolume;

      for(let i = 0; i<dates.length; i++) {
        let date:Date = this.convertToDate(dates[i]);

        let instantQuotes: InstantQuotes = new InstantQuotes({
          instant: date,
          quotes: [
            new Quote({
              name: this.name,
              close: this.convertToNumber(close[i]),
              open: this.convertToNumber(open[i]),
              high: this.convertToNumber(high[i]),
              low: this.convertToNumber(low[i]),
              volume: this.convertToNumber(volume[i]),
              spread: 0,
              dividend: 0})
          ]
        });
        historicalQuotes.push(instantQuotes);
      }
    });
    return new HistoricalQuotes(historicalQuotes);
  }

  private convertToNumber(a: any): number {
    let s: string = a;
    let n: number = parseFloat(s);
    if (Number.isNaN(n)) {
      return 0;
    }
    return n;
  }

  private convertToDate(yearMonthDay: number): Date {
    let year: number = Math.floor(yearMonthDay / 10000);
    let monthDay = yearMonthDay % 10000;
    let month:number = Math.floor(monthDay / 100);
    let day = monthDay % 100;

    return new Date(year, month - 1, day);
  }
}

@Injectable({
  providedIn: 'root'
})
export class QuotesFromSixService implements IQuotesService {

  constructor(private http: HttpClient) {
  }

  getHistoricalQuotes(source: string, name: string): Observable<HistoricalQuotes> {
    return this.http.get(source).pipe(map(sixData => {
        let sixConverter: SixConverter = new SixConverter(name, sixData);
        return sixConverter.asHistoricalQuotes();
      }));
  }
}
