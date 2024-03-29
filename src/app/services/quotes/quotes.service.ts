import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuotesFromSixService } from './quotes-from-six.service';
import { QuotesFromYahooService } from './quotes-from-yahoo.service';
import { HistoricalQuotes } from 'src/app/model/core/quotes';
import { QuotesConfigurationService } from './quotes-configuration.service';
import { PlainDataService } from './plain-data.service';
import { QuotesFromInvestingService } from './quotes-from-investing.service';
import { ApplyExchangeRate } from './quotes-exchange-rate';
import { NamedQuoteSource, QuoteProvider, DividendSource, DataSource, QuoteSource, ExchangeRateSource } from './quote-configuration';
import { ComputeDividends } from './quotes-dividends';
import { QuotesFromAlphaVantageService } from './quotes-from-alphavantage.service';

export interface QuotesService {
  getQuotes(names: string[]): Observable<HistoricalQuotes>;
}

/**
 * Forces relative path to quotes.
 * @param uri A path or URI, absolute or relative.
 * @returns Same if uri was absolute, or quotes folder if it was relative.
 */
export function makePathRelativeToQuotes(uri: string): string {
  if (uri.startsWith('/')) {
    return uri;
  } else {
    return "assets/quotes/" + uri;
  }
}

/**
 * Retrieves instantQuotes data from a provider, and then broadcasts the
 * instantQuotes updates to all subscribers.
 * @class{QuotesService}
 */
 @Injectable({
   providedIn: 'root'
 })
export class QuotesServiceImpl implements QuotesService {
  constructor(private quotesFromSixService: QuotesFromSixService,
              private quotesFromYahooService: QuotesFromYahooService,
              private quotesFromInvestingService: QuotesFromInvestingService,
              private quotesFromAlphaVantageService: QuotesFromAlphaVantageService,
              private plainDataService: PlainDataService,
              private quotesConfigurationService: QuotesConfigurationService) {
  }

  public getQuotes(names: string[]): Observable<HistoricalQuotes> {
    let quoteRetrievers: Observable<HistoricalQuotes>[] = [];

    names.forEach(name => {
      let namedQuoteSource: NamedQuoteSource =
        this.quotesConfigurationService.obtainNamedQuoteSource(name);

      if (namedQuoteSource) {
        let quoteRetriever: Observable<HistoricalQuotes> = new Observable<HistoricalQuotes>(observer => {
          this.retrieveQuote(namedQuoteSource.name, namedQuoteSource.quote).subscribe(h1 => {
              this.applyDividends(h1, namedQuoteSource).subscribe(h2 => {
                this.applyExchangeRate(h2, namedQuoteSource).subscribe(h3 => {
                  console.info("Loaded " + namedQuoteSource.name, namedQuoteSource);
                  observer.next(h3);
                  observer.complete();
                })
              });
            });
        });
        quoteRetrievers.push(quoteRetriever);
      } else {
        console.warn("Skipping " + name  + " because is not defined among named quote sources");
      }
    });

    console.log("Retrieving " + quoteRetrievers.length  +" quote sources");

    return forkJoin(quoteRetrievers)
      .pipe(map((separatedHistoricalQuotes: HistoricalQuotes[]) => {
        let mergedHistoricalQuotes: HistoricalQuotes;
        console.log("Loaded " + separatedHistoricalQuotes.length + " separated historical quotes to merge");
        let n = 0;
        separatedHistoricalQuotes.forEach((singleHistoricalQuotes: HistoricalQuotes) => {
          if (mergedHistoricalQuotes) {
            mergedHistoricalQuotes.merge(singleHistoricalQuotes);
          } else {
            mergedHistoricalQuotes = singleHistoricalQuotes;
          }
          if (n++ % 20 == 0) {
            console.log("Merged " + n++ + " historical quotes so far...");
          }
        });
        console.log("Finished merging historical quotes: " + n + " in total");
        return mergedHistoricalQuotes;
      }));
  }

  private retrieveQuote(name: string, quoteSource: QuoteSource): Observable<HistoricalQuotes> {
    let fileName = makePathRelativeToQuotes(quoteSource.local.fileName);
    let format = quoteSource.local.format;

    switch(format) {
      case QuoteProvider.SIX:
        return this.quotesFromSixService.getHistoricalQuotes(fileName, name);
      case QuoteProvider.YAHOO:
        return this.quotesFromYahooService.getHistoricalQuotes(fileName, name);
      case QuoteProvider.INVESTING:
        return this.quotesFromInvestingService.getHistoricalQuotes(fileName, name);
      case QuoteProvider.ALPHA_VANTAGE:
        return this.quotesFromAlphaVantageService.getHistoricalQuotes(fileName, name);
      default:
        console.warn(format + " - Unsupported provider");
        return null;
    }
  }

  private applyDividends(historicalQuotes: HistoricalQuotes, namedQuoteSource: NamedQuoteSource): Observable<HistoricalQuotes> {
    let dividendsSource: DividendSource = namedQuoteSource.dividends;
    if (dividendsSource) {
      let directDividendsSource: DataSource = dividendsSource.directDividends;
      if (directDividendsSource) {
        let uri = makePathRelativeToQuotes(directDividendsSource.uri);
        return new Observable<HistoricalQuotes>(observer => {
          this.plainDataService.getHistoricalValues(uri).subscribe(directDividends => {
            ComputeDividends
              .withDirectDividends(directDividends)
              .of(namedQuoteSource.name, historicalQuotes);
            observer.next(historicalQuotes);
            observer.complete();
          });
        });
      } else {
        let totalReturnSource: QuoteSource = namedQuoteSource.dividends.totalReturn;
        if (totalReturnSource) {
          return new Observable<HistoricalQuotes>(observer => {
            this.retrieveQuote("TR", totalReturnSource).subscribe(totalReturnQuotes => {
              ComputeDividends
                .withTotalReturn("TR", totalReturnQuotes)
                .of(namedQuoteSource.name, historicalQuotes);
              observer.next(historicalQuotes);
              observer.complete();
            });
          });
        }
      }
    } else {
      ComputeDividends
        .withAdjustedClose()
        .of(namedQuoteSource.name, historicalQuotes);
      return of(historicalQuotes);
    }
  }

  private applyExchangeRate(historicalQuotes: HistoricalQuotes, namedQuoteSource: NamedQuoteSource): Observable<HistoricalQuotes> {
    let exchangeRateSource: ExchangeRateSource = namedQuoteSource.exchangeRate;
    if (exchangeRateSource) {
      return new Observable<HistoricalQuotes>(observer => {
        this.retrieveQuote("ER", exchangeRateSource.quote).subscribe(exchangeRate => {
          let applyExchangeRate: ApplyExchangeRate =
            new ApplyExchangeRate(exchangeRateSource.operation, "ER", exchangeRate);
          applyExchangeRate.applyTo(namedQuoteSource.name, historicalQuotes);
          observer.next(historicalQuotes);
          observer.complete();
        });
      });
    } else {
      return of(historicalQuotes);
    }
  }
}
