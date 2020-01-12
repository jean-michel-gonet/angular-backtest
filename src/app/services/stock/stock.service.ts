import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { SixConnectionService } from './six-connection.service';
import { StockData } from 'src/app/model/core/stock';


/**
 * Retrieves stock data from a provider, and then broadcasts the
 * stock updates to all subscribers.
 * @class{StockService}
 */
 @Injectable({
   providedIn: 'root'
 })
export class StockService {
  constructor(private sixConnectionService: SixConnectionService) {
  }

  getStockData(isins: string[]): Observable<StockData> {
    let o: Observable<StockData>[] = [];
    isins.forEach(isin => {
      o.push(this.sixConnectionService.get(isin));
    });
    return forkJoin(o)
      .pipe(map(s => {
        let stockData: StockData;
        s.forEach((d: StockData) => {
          if (stockData) {
            stockData.merge(d);
          } else {
            stockData = d;
          }
        });
        return stockData;
      }));
  }
}
