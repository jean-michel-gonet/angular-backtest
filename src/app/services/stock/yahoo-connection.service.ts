import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockData } from 'src/app/model/core/stock';
import { map } from 'rxjs/operators';



/**
 * Converts Yahoo data into StockData.
 * @class{YahooConverter}
 */
export class YahooConverter {
  /**
   * Class constructor.
   * @param{string} yahooData The raw data returned by SIX.
   */
  constructor(private yahooData: string) {
  }

  /**
   * Transforms the provided SIX data into StockData.
   * @return {StockData} The transformed data.
   */
  asStockData(): StockData {
    return new StockData([]);
  }
}


@Injectable({
  providedIn: 'root'
})
export class YahooConnectionService {

  constructor(private http: HttpClient) {
  }

  get(file: string): Observable<StockData> {
    return this.http.get(file).pipe(map(s => {
        let yahooConverter: YahooConverter = new YahooConverter(s as string);
        return yahooConverter.asStockData();
      }));
  }
}
