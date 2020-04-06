import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuotesFromSixService } from './quotes-from-six.service';
import { QuotesFromYahooService } from './quotes-from-yahoo.service';
import { HistoricalQuotes } from 'src/app/model/core/quotes';
import { QuotesConfigurationService, NamedQuoteSource, QuoteProvider,
  QuoteSource, DividendSource, DataSource } from './quotes-configuration.service';
import { PlainDataService } from './plain-data.service';
import { EnrichWithDividends, EnrichWithTotalReturn } from 'src/app/model/utils/quotes-enrich';

/**
 * Retrieves instantQuotes data from a provider, and then broadcasts the
 * instantQuotes updates to all subscribers.
 * @class{QuotesService}
 */
 @Injectable({
   providedIn: 'root'
 })
export class QuotesService {
  constructor(private quotesFromSixService: QuotesFromSixService,
              private quotesFromYahooService: QuotesFromYahooService,
              private plainDataService: PlainDataService,
              private quotesConfigurationService: QuotesConfigurationService) {
  }

  public getQuotes(names: string[]): Observable<HistoricalQuotes> {
    let quoteRetrievers: Observable<HistoricalQuotes>[] = [];

    names.forEach(name => {
      let namedQuoteSource: NamedQuoteSource =
        this.quotesConfigurationService.obtainNamedQuoteSource(name);

      let quoteRetriever: Observable<HistoricalQuotes> = new Observable<HistoricalQuotes>(observer => {
        this.retrieveQuote(
          namedQuoteSource.name,
          namedQuoteSource.quote).subscribe(h1 => {
            this.obtainDividends(h1, namedQuoteSource).subscribe(h2 => {
              observer.next(h2);
              observer.complete();
            });
          });
      });
      quoteRetrievers.push(quoteRetriever);
    });

    return forkJoin(quoteRetrievers)
      .pipe(map((separatedHistoricalQuotes: HistoricalQuotes[]) => {
        let mergedHistoricalQuotes: HistoricalQuotes;
        separatedHistoricalQuotes.forEach((singleHistoricalQuotes: HistoricalQuotes) => {
          if (mergedHistoricalQuotes) {
            mergedHistoricalQuotes.merge(singleHistoricalQuotes);
          } else {
            mergedHistoricalQuotes = singleHistoricalQuotes;
          }
        });
        return mergedHistoricalQuotes;
      }));
  }

  private retrieveQuote(name: string, quoteSource: QuoteSource): Observable<HistoricalQuotes> {
    let uri = this.makeRelativePath(quoteSource.uri);

    switch(quoteSource.provider) {
      case QuoteProvider.SIX:
        return this.quotesFromSixService.getHistoricalQuotes(uri, name);
      case QuoteProvider.YAHOO:
        return this.quotesFromYahooService.getHistoricalQuotes(uri, name);
      case QuoteProvider.INVESTING:
      default:
        console.warn(quoteSource.provider + " - Unsupported provider");
        return null;
    }
  }

  private obtainDividends(historicalQuotes: HistoricalQuotes, namedQuoteSource: NamedQuoteSource): Observable<HistoricalQuotes> {
    let dividendsSource: DividendSource = namedQuoteSource.dividends;
    if (dividendsSource) {
      let directDividendsSource: DataSource = dividendsSource.directDividends;
      if (directDividendsSource) {
        let uri = this.makeRelativePath(directDividendsSource.uri);
        return new Observable<HistoricalQuotes>(observer => {
          this.plainDataService.getHistoricalValues(uri).subscribe(directDividends => {
            let enrichWithDividends: EnrichWithDividends =
              new EnrichWithDividends(directDividends);
            enrichWithDividends.enrich(namedQuoteSource.name, historicalQuotes);
            observer.next(historicalQuotes);
            observer.complete();
          });
        });
      } else {
        let totalReturnSource: QuoteSource = namedQuoteSource.dividends.totalReturn;
        if (totalReturnSource) {
          return new Observable<HistoricalQuotes>(observer => {
            this.retrieveQuote("TR", totalReturnSource).subscribe(totalReturnQuotes => {
              let enrichWithTotalReturn: EnrichWithTotalReturn =
                new EnrichWithTotalReturn("TR", totalReturnQuotes);
              enrichWithTotalReturn.enrich(namedQuoteSource.name, historicalQuotes);
              observer.next(historicalQuotes);
              observer.complete();
            });
          });
        }
      }
    } else {
      return of(historicalQuotes);
    }
  }

  public makeRelativePath(uri: string): string {
    if (uri.startsWith('/')) {
      return uri;
    } else {
      return "../../../assets/quotes/" + uri;
    }
  }
}
