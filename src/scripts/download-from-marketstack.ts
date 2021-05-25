import { Observable } from 'rxjs';

import { MARKET_STACK_ACCESS_KEY } from './market-stack.access-key';

import { NamedQuoteSource } from '../app/services/quotes/quote-configuration';
import { HistoricalQuotes } from '../app/model/core/quotes';
import { MarketStackReader } from '../app/services/quotes/quotes-from-marketstack.service';
import { StringUtils } from '../app/model/utils/string-utils';

import { DownloadFrom } from './download-from';

export class DownloadFromMarketStack extends DownloadFrom {
  public downloadMoreFromMarketStack(namedQuoteSource: NamedQuoteSource, dateFrom: Date): Observable<HistoricalQuotes> {
    let ticker = namedQuoteSource.quote.remote.ticker;
    let url: string = "http://api.marketstack.com/v1/eod?access_key=" + MARKET_STACK_ACCESS_KEY
        + "&symbols=" + ticker
        + "&date_from=" + StringUtils.formatAsDate(dateFrom, "-");

    return new Observable<HistoricalQuotes>(observer => {
      this.downloadFromUrl(url).subscribe(
        remoteData => {
          console.info(`Retrieved ${namedQuoteSource.name} as ${ticker} from MarketStack - ${remoteData.length} bytes of data`);
          let json = JSON.parse(remoteData);
          let reader = new MarketStackReader(namedQuoteSource.name, json);
          let remoteHistoricalQuotes = reader.asHistoricalQuotes();
          observer.next(remoteHistoricalQuotes);
        },
        (error: any) => {
          observer.error(new Error(`downloading from ${url}: ${error.message}`));
        });
    });
  }

}
