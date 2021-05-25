import { readFile, writeFile} from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs';

import { SP500_SOURCES } from '../assets/quotes/configuration-sp500';

import { NamedQuoteSource, QuoteProvider } from '../app/services/quotes/quote-configuration';
import { HistoricalQuotes } from '../app/model/core/quotes';
import { YahooReader, YahooWriter } from '../app/services/quotes/quotes-from-yahoo.service';
import { InvestingReader, InvestingWriter } from '../app/services/quotes/quotes-from-investing.service';
import { DownloadFromYahoo } from './download-from-yahoo';
import { DownloadFromMarketStack } from './download-from-marketstack';
import { DownloadFromAlphaVantage } from './download-from-alpha-vantage';

export class RefreshQuotes {
  private downloadFromYahoo = new DownloadFromYahoo();
  private downloadFromMarketStack = new DownloadFromMarketStack();
  private downloadFromAlphaVantage = new DownloadFromAlphaVantage();

  public refreshAll():void {
    // Make the list of all elligible files to refresh:
    let quotesToRefresh = this.quotesToRefresh();

    // Refresh each file.
    quotesToRefresh.forEach(namedQuoteSource => {
      let fileName = this.makeRelativePath(namedQuoteSource.quote.local.fileName);
      readFile(fileName, {encoding: 'utf-8'}, (err, localData) => {
        if (err != null && err.code !== 'ENOENT') {
          console.info(`Dropping ${namedQuoteSource.name} - ${fileName}: ${err}`);
        } else {
          if (localData) {
            console.info(`Local data found for ${namedQuoteSource.name} - ${fileName}: ${localData.length} bytes long - Appending from remote.`);
          } else {
            console.info(`No local data found for ${namedQuoteSource.name} - ${fileName}: ${err} - Loading full from remote.`);
          }
          this.refresh(namedQuoteSource, localData).subscribe(
            updatedData => {
              writeFile(fileName + "1", updatedData, {encoding: 'utf-8'}, () => {
                console.info(`Finished processing ${namedQuoteSource.name} - ${fileName}`);
              }),
              (error: any) => {
                console.error(`Error processing ${namedQuoteSource.name} - ${fileName}: ${error}`);
              }
          },
          (error: any) => {
            console.error("Error " + error.message);
          });
        }
      });
    });
  }

  private refresh(namedQuoteSource: NamedQuoteSource, localData: string): Observable<string> {
    let format = namedQuoteSource.quote.local.format;
    switch(format) {
      case QuoteProvider.YAHOO:
        return this.refreshYahoo(namedQuoteSource, localData);
      case QuoteProvider.INVESTING:
        return this.refreshInvesting(namedQuoteSource, localData);
      default:
        return new Observable<string>(observer => {
          observer.error(new Error("Local format not supported - " + format));
        });
    }
  }

  private refreshYahoo(namedQuoteSource: NamedQuoteSource, localData: string): Observable<string> {
    return new Observable<string>(observer => {
      let dateFrom: Date;
      let localHistoricalQuotes: HistoricalQuotes;
      if (localData) {
        let reader = new YahooReader(namedQuoteSource.name, localData);
        localHistoricalQuotes = reader.asHistoricalQuotes();
        dateFrom = localHistoricalQuotes.maxDate(namedQuoteSource.name);
        console.info(`Local quotes ${namedQuoteSource.name} available in Yahoo format up to ${dateFrom}`);
      } else {
        dateFrom = undefined;
        localHistoricalQuotes = new HistoricalQuotes([]);
        console.info(`No local quotes ${namedQuoteSource.name} available.`);
      }
      this.downloadMoreFrom(namedQuoteSource, dateFrom).subscribe(
        historicalQuotes => {
          localHistoricalQuotes.append(namedQuoteSource.name, historicalQuotes);
          let writer = new YahooWriter(namedQuoteSource.name, localHistoricalQuotes);
          let csvFile = writer.asYahooCsvFile()
          observer.next(csvFile);
          observer.complete();
        },
        (error: any) => {
          observer.error(new Error(
            "retrieving " + namedQuoteSource.name +
            " from YAHOO: " +error.message));
        });
    });
  }

  private refreshInvesting(namedQuoteSource: NamedQuoteSource, localData: string): Observable<string> {
    return new Observable<string>(observer => {

      let dateFrom: Date;
      let localHistoricalQuotes: HistoricalQuotes;
      if (localData) {
        let reader = new InvestingReader(namedQuoteSource.name, localData);
        localHistoricalQuotes = reader.asHistoricalQuotes();
        dateFrom = localHistoricalQuotes.maxDate(namedQuoteSource.name);
        console.info(`Local quotes ${namedQuoteSource.name} available in Investing format up to ${dateFrom}`);
      } else {
        dateFrom = undefined;
        localHistoricalQuotes = new HistoricalQuotes([]);
        console.info(`No local quotes ${namedQuoteSource.name} available.`);
      }
      this.downloadMoreFrom(namedQuoteSource, dateFrom).subscribe(
        historicalQuotes => {
          localHistoricalQuotes.append(namedQuoteSource.name, historicalQuotes);
          let writer = new InvestingWriter(namedQuoteSource.name, localHistoricalQuotes);
          let csvFile = writer.asInvestingCsvFile()
          observer.next(csvFile);
          observer.complete();
        },
        (error: any) => {
          observer.error(new Error(
            "retrieving " + namedQuoteSource.name +
            " from MARKETSTACK: " +error.message));
        });
    });
  }

  private downloadMoreFrom(namedQuoteSource: NamedQuoteSource, dateFrom: Date): Observable<HistoricalQuotes> {
    let provider = namedQuoteSource.quote.remote.provider;
    switch(provider) {
      case QuoteProvider.YAHOO:
        return this.downloadFromYahoo.downloadMoreFromYahoo(namedQuoteSource, dateFrom);
      case QuoteProvider.MARKETSTACK:
        return this.downloadFromMarketStack.downloadMoreFromMarketStack(namedQuoteSource, dateFrom);
      case QuoteProvider.ALPHA_VANTAGE:
        return this.downloadFromAlphaVantage.downloadMoreFromAlphaVantage(namedQuoteSource, dateFrom);
      default:
        return new Observable<HistoricalQuotes>(observer => {
          observer.error(new Error("Remote provider not supported - " + provider));
        });
    }
  }

  private makeRelativePath(uri: string): string {
    if (uri.startsWith('/')) {
      return uri;
    } else {
      return join(__dirname, "../assets/quotes/", uri);
    }
  }

  /**
   * Establishes the list of all files to refresh.
   */
  private quotesToRefresh(): NamedQuoteSource[] {
    let fileNames: Map<string, NamedQuoteSource> = new Map();

    SP500_SOURCES.forEach(namedQuoteSource => {
      let skipIt: boolean = false;

      let remote = namedQuoteSource.quote.remote;
      let local = namedQuoteSource.quote.local;
      let format = local.format;
      let fileName = local.fileName;

      // If the local file is already in the list, then avoid repetition:
      if (fileNames.has(fileName)) {
        skipIt = true;
      } else {
        // If the remote location is not defined, then skip it.
        if (remote) {

          // If remote provider is not supported, then skip it.
          let provider = remote.provider;
          switch(provider) {
            case QuoteProvider.YAHOO:
            case QuoteProvider.MARKETSTACK:
            case QuoteProvider.ALPHA_VANTAGE:
              break;
            default:
              console.info(`Skipping ${fileName} - Remote provider ${provider} is not supported`);
              skipIt = true;
          }
        } else {
          console.info(`Skipping ${fileName} - Remote provider not specified`);
          skipIt = true;
        }

        // If the local format is not supported, then skip it:
        switch(format) {
          case QuoteProvider.YAHOO:
          case QuoteProvider.INVESTING:
            break;
          default:
            console.info(`Skipping ${fileName} - Local format ${format} is not supported`);
            skipIt = true;
        }
      }

      // Add it to the list:
      if (!skipIt) {
        fileNames.set(fileName, namedQuoteSource);
        console.info(`Adding ${fileName} for refresh data`);
      }
    });

    return Array.from(fileNames.values());
  }
}

let refreshQuots: RefreshQuotes = new RefreshQuotes();
refreshQuots.refreshAll();
