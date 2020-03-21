import { HistoricalQuotes } from 'src/app/model/core/quotes';
import { Observable } from 'rxjs';

/**
 * A common interface for data converters.
 * @class {IQuotesService}
 */
export interface IQuotesService {
  /**
   * To retrieve the instantQuotes data of the specified instrument.
   * @param {string} name The name of the instrument. This is necessary
   * as often the files do not contain the name of the instrument.
   * @param {string} source Where to find the file with data.
   */
  getHistoricalQuotes(source: string, name: string): Observable<HistoricalQuotes>;
}
