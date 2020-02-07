import { StockData, Dividend } from 'src/app/model/core/stock';
import { Observable } from 'rxjs';

/**
 * A common interface for data converters.
 * @class {ConnectionService}
 */
export interface ConnectionService {
  /**
   * To retrieve the stock data of the specified instrument.
   * @param {string} name The name of the instrument. This is necessary
   * as often the files do not contain the name of the instrument.
   * @param {string} source Where to find the file with data.
   */
  getQuotes(source: string, name: string): Observable<StockData>;

  /**
   * To retrieve the dividends of the specified instrument.
   * @param {string} source Where to find the file with data.
   */
  getDividends(source: string, name:string): Observable<Dividend[]>;
}
