import { Injectable } from '@angular/core';
import { StockData, Stock, Dividend } from 'src/app/model/core/stock';
import { AssetOfInterest } from 'src/app/model/core/asset';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConnectionService } from './connection.service';

/**
 * Converts SIX data into StockData.
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
   * Transforms the provided SIX data into StockData.
   * @return {StockData} The transformed data.
   */
  asStockData(): StockData {
    let valors:any[] = this.sixData.valors;

    let stockData: StockData = new StockData([]);
    valors.forEach(valor => {
      let isin = valor.ISIN;
      let data:any = valor.data;
      let dates:number[] = data.Date;
      let close:number[] = data.Close;

      for(let i = 0; i<dates.length; i++) {
        let date:Date = this.convertToDate(dates[i]);
        let partValue = close[i];

        let stock: Stock = new Stock({
          time: date,
          assetsOfInterest: [
            new AssetOfInterest({
              isin: isin,
              name: isin,
              partValue: this.convertToNumber(partValue),
              spread: 0,
              dividend: 0})
          ]
        });
        stockData.add(stock);
      }
    });
    return stockData;
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
export class SixConnectionService implements ConnectionService {

  constructor(private http: HttpClient) {
  }

  getQuotes(source: string, name: string): Observable<StockData> {
    return this.http.get(source).pipe(map(s => {
        let sixConverter: SixConverter = new SixConverter(s);
        return sixConverter.asStockData();
      }));
  }

  getDividends(source: string): Observable<Dividend[]> {
    throw new Error("Method not implemented.");
  }
}
