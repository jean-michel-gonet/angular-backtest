import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { SixConnectionService } from './six-connection.service';
import { YahooConnectionService } from './yahoo-connection.service';
import { StockData } from 'src/app/model/core/stock';

 export class SourceAndProvider {
   source: string;
   provider: string;
 }

export class QuoteSourceAndProvider extends SourceAndProvider {
  name: string;
  dividends?: SourceAndProvider;
};

/**
 * Imports the configuration file where all securities data are registered.
 */
import securityDescriptors from '../../../assets/securities/securities-configuration.json';

/**
 * Retrieves stock data from a provider, and then broadcasts the
 * stock updates to all subscribers.
 * @class{StockService}
 */
 @Injectable({
   providedIn: 'root'
 })
export class StockService {
  constructor(private sixConnectionService: SixConnectionService,
              private yahooConnectionService: YahooConnectionService) {
  }

  private obtainQuoteSourceAndProvider(name: String): QuoteSourceAndProvider {
    let quoteSourceAndProvider: QuoteSourceAndProvider =
      securityDescriptors.find((securityDescriptor: QuoteSourceAndProvider) => {
        return securityDescriptor.name == name;
      });
    return quoteSourceAndProvider;
  }

  private makeItGood(source: string): string {
    return "../../../assets/securities/" + source;
  }

  /*
  xx(): void {
    this.sixConnectionService.getQuotes("xx").subscribe(s => {
      this.yahooConnectionService.getQuotes("yy", "zz").subscribe(d => {
        s.enrichWithDividends(d);
        return s;
      });
    })
  }
  */
  getStockData(names: string[]): Observable<StockData> {
    let o: Observable<StockData>[] = [];

    names.forEach(name => {
      let quoteSourceAndProvider: QuoteSourceAndProvider = this.obtainQuoteSourceAndProvider(name);
      let source = this.makeItGood(quoteSourceAndProvider.source);

      switch(quoteSourceAndProvider.provider) {
        case "www.six-group.com":
          o.push(this.sixConnectionService.getQuotes(source, quoteSourceAndProvider.name));
          break;
        case "finance.yahoo.com":
          o.push(this.yahooConnectionService.getQuotes(source, quoteSourceAndProvider.name));
        break;
      }
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
