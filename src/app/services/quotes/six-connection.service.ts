import { Injectable } from '@angular/core';
import { HistoricalQuotes, InstantQuotes, Dividend } from 'src/app/model/core/quotes';
import { Quote } from 'src/app/model/core/asset';
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
  constructor(private sixData: any) {
  }

  /**
   * Transforms the provided SIX data into HistoricalQuotes.
   * @return {HistoricalQuotes} The transformed data.
   */
  asHistoricalQuotes(): HistoricalQuotes {
    let valors:any[] = this.sixData.valors;

    let historicalQuotes: InstantQuotes[] = [];
    valors.forEach(valor => {
      let name = valor.ISIN;
      let data:any = valor.data;
      let dates:number[] = data.Date;
      let close:number[] = data.Close;

      for(let i = 0; i<dates.length; i++) {
        let date:Date = this.convertToDate(dates[i]);
        let partValue = close[i];

        let stock: InstantQuotes = new InstantQuotes({
          instant: date,
          quotes: [
            new Quote({
              name: name,
              partValue: this.convertToNumber(partValue),
              spread: 0,
              dividend: 0})
          ]
        });
        historicalQuotes.push(stock);
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

    return new Date(year, month, day);
  }
}

@Injectable({
  providedIn: 'root'
})
export class QuotesFromSixService implements IQuotesService {

  constructor(private http: HttpClient) {
  }

  getHistoricalQuotes(source: string, name: string): Observable<HistoricalQuotes> {
    return this.http.get(source).pipe(map(s => {
        let sixConverter: SixConverter = new SixConverter(s);
        return sixConverter.asHistoricalQuotes();
      }));
  }

  getDividends(source: string): Observable<Dividend[]> {
    throw new Error("Method not implemented.");
  }
}
