import { Observable } from 'rxjs';

import { NamedQuoteSource } from '../app/services/quotes/quote-configuration';
import { HistoricalQuotes } from '../app/model/core/quotes';
import { YahooReader } from '../app/services/quotes/quotes-from-yahoo.service';
import { YAHOO_CALLS_PER_MINUTE } from './market-stack.access-key';

import { DownloadFrom } from './download-from';
import { ThrottleLimit } from '../app/model/utils/throttle-limit';

export class DownloadFromYahoo extends DownloadFrom {
  private throttle: ThrottleLimit = new ThrottleLimit(60000 / YAHOO_CALLS_PER_MINUTE);

  public downloadMoreFromYahoo(namedQuoteSource: NamedQuoteSource, dateFrom: Date): Observable<HistoricalQuotes> {
    let ticker = namedQuoteSource.quote.remote.ticker;
    let period1 = this.computePeriod(dateFrom);
    let today = new Date();
    let period2 = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).valueOf() / 1000);
    let url: string = "https://query1.finance.yahoo.com/v7/finance/download/" + ticker + "?"
        + "period1=" + period1.toString()
        + "&period2=" + period2.toString()
        + "&interval=1d&events=history&includeAdjustedClose=true";

    return new Observable<HistoricalQuotes>(observer => {
      this.throttle.executeInDueTime(() => {
        this.downloadFromUrl(url).subscribe(
          remoteData => {
            console.info(`Retrieved ${namedQuoteSource.name} as ${ticker} from Yahoo - ${remoteData.length} bytes of data`);
            let reader = new YahooReader(namedQuoteSource.name, remoteData);
            let remoteHistoricalQuotes = reader.asHistoricalQuotes();
            observer.next(remoteHistoricalQuotes);
          },
          (error: any) => {
            observer.error(new Error(`downloading from ${url}: ${error.message}`));
          });
        });
    });
  }
  private computePeriod(dateFrom: Date): number {
    let date: Date;
    if (dateFrom) {
      date = dateFrom;
    } else {
      let now = new Date();
      date = new Date(now.getFullYear() - 20, 0, 1);
    }
    return Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf() / 1000)
  }
}
