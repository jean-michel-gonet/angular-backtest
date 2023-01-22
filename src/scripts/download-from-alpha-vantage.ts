import { Observable } from 'rxjs';
import { ALPHA_VANTAGE_ACCESS_KEY, ALPHA_VANTAGE_CALLS_PER_MINUTE } from './market-stack.access-key';
import { NamedQuoteSource } from '../app/services/quotes/quote-configuration';
import { HistoricalQuotes } from '../app/model/core/quotes';
import { ThrottleLimit } from '../app/model/utils/throttle-limit';
import { AlphaVantageReader } from '../app/services/quotes/quotes-from-alphavantage.service';

import { DownloadFrom } from './download-from';

export class DownloadFromAlphaVantage extends DownloadFrom {
  private throttle: ThrottleLimit = new ThrottleLimit(60000 / ALPHA_VANTAGE_CALLS_PER_MINUTE);

  public downloadMoreFromAlphaVantage(namedQuoteSource: NamedQuoteSource, dateFrom: Date): Observable<HistoricalQuotes> {
    let ticker = namedQuoteSource.quote.remote.ticker;
    let outputSize = this.computeOutputSize(dateFrom);
    let url: string = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&apikey=" + ALPHA_VANTAGE_ACCESS_KEY
        + "&symbol=" + ticker
        + "&outputsize=" + outputSize;

    return new Observable<HistoricalQuotes>(observer => {
      this.throttle.executeInDueTime(() => {
        this.downloadFromUrl(url).subscribe(
          remoteData => {
            console.info(`Retrieved ${namedQuoteSource.name} as ${ticker} from AlphaVantage - ${remoteData.length} bytes of data`);
            if (remoteData.length < 250) {
              // When missing data, alpha vantage responds with 200-OK and then an error message in the body:
              observer.error(new Error(`downloading from ${url}: ${remoteData}`));
            } else {
              let json = JSON.parse(remoteData);
              let reader = new AlphaVantageReader(namedQuoteSource.name, json);
              let remoteHistoricalQuotes = reader.asHistoricalQuotes();
              observer.next(remoteHistoricalQuotes);
              observer.complete();
            }
          },
          (error: any) => {
            observer.error(new Error(`downloading from ${url}: ${error.message}`));
          });
      });
    });
  }

  private computeOutputSize(dateFrom: Date): string {
    if (dateFrom) {
      let now = new Date();
      let milliseconds = now.getTime() - dateFrom.getTime()
      let days = milliseconds / 1000 / 60 / 60 / 24;
      if (days <= 100) {
        return "compact";
      }
    }
    return "full";
  }
}
