import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap , concatMap} from 'rxjs/operators';
import { SixConnectionService } from './six-connection.service';
import { YahooConnectionService } from './yahoo-connection.service';
import { StockData, Dividend } from 'src/app/model/core/stock';
import { SecuritiesConfigurationService, QuoteSourceAndProvider, SourceAndProvider } from './securities-configuration.service';
import { DateYieldConnectionService } from './date-yield-connection.service';

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
              private yahooConnectionService: YahooConnectionService,
              private dateYieldConnectionService: DateYieldConnectionService,
              private securitiesConfigurationService: SecuritiesConfigurationService) {
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
    let oo: Observable<StockData>[] = [];

    names.forEach(name => {
      let quoteSourceAndProvider: QuoteSourceAndProvider =
        this.securitiesConfigurationService.obtainQuoteSourceAndProvider(name);

      let o: Observable<StockData> = this.obtainQuote(quoteSourceAndProvider);

      /*
      let o: Observable<StockData> = this.obtainQuote(quoteSourceAndProvider)
        .pipe(mergeMap(s => {
          return this.obtainDividends(quoteSourceAndProvider.dividends)
            .pipe(map(d =>{
              s.enrichWithDividends(d);
              return s;
            }));
        }));
      */
      oo.push(o);
    });

    return forkJoin(oo)
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

  private obtainDividends(sourceAndProvider: SourceAndProvider, name: string): Observable<Dividend[]> {
    let source = this.makeItGood(sourceAndProvider.source);

    switch(sourceAndProvider.provider) {
      case "date.yield.csv":
        return this.dateYieldConnectionService.getDividends(source, name);
      default:
        console.warn(sourceAndProvider.provider + " - Unknown provider for dividends");
        return null;
    }
  }

  private obtainQuote(quoteSourceAndProvider: QuoteSourceAndProvider): Observable<StockData> {
    let source = this.makeItGood(quoteSourceAndProvider.source);

    switch(quoteSourceAndProvider.provider) {
      case "www.six-group.com":
        return this.sixConnectionService.getQuotes(source, quoteSourceAndProvider.name);
      case "finance.yahoo.com":
        return this.yahooConnectionService.getQuotes(source, quoteSourceAndProvider.name);
      default:
        console.warn(quoteSourceAndProvider.provider + " - Unknown provider");
        return null;
    }
  }
}
