import { readFile, writeFile} from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs';

import { QUOTE_SOURCES } from '../assets/quotes/configuration';

import { NamedQuoteSource, QuoteProvider } from '../app/services/quotes/quote-configuration';
import { HistoricalQuotes } from '../app/model/core/quotes';
import { YahooReader, YahooWriter } from '../app/services/quotes/quotes-from-yahoo.service';
import { InvestingReader, InvestingWriter } from '../app/services/quotes/quotes-from-investing.service';
import { DownloadFromYahoo } from './download-from-yahoo';
import { DownloadFromMarketStack } from './download-from-marketstack';
import { DownloadFromAlphaVantage } from './download-from-alpha-vantage';

/**
 * Refreshes all configured quotes from the remote locations.
 * To execupte this script:
 */
export class RefreshQuotes {
  private downloadFromYahoo = new DownloadFromYahoo();
  private downloadFromMarketStack = new DownloadFromMarketStack();
  private downloadFromAlphaVantage = new DownloadFromAlphaVantage();

  /**
   * Refresh all specified quotes, or all available quotes.
   * @param names If not empty, then refresh only those. When left empty,
   * then refreshes all configured quotes.
   */
  public refreshQuotes(names: string[]):void {
    // Make the list of all elligible files to refresh:
    let quotesToRefresh = this.quotesToRefresh(names);

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
              writeFile(fileName, updatedData, {encoding: 'utf-8'}, () => {
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
            " in YAHOO format: " +error.message));
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
            " in INVESTING format: " +error.message));
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
   * @param restrictTo If not empty, then refresh only sources corresponding to
   * those names.
   * @return All sources to refresh.
   */
  private quotesToRefresh(restrictTo: string[]): NamedQuoteSource[] {
    let fileNames: Map<string, NamedQuoteSource> = new Map();

    QUOTE_SOURCES.forEach(namedQuoteSource => {
      let skipIt: boolean = false;

      let remote = namedQuoteSource.quote.remote;
      let local = namedQuoteSource.quote.local;
      let fileName = local.fileName;

      // If the local file is already in the list, then avoid repetition:
      if (fileNames.has(fileName)) {
        skipIt = true;
      }

      // If restriction list is set, but quote name is not in it, then skip it:
      else if (restrictTo && restrictTo.length && !restrictTo.includes(namedQuoteSource.name)) {
        skipIt = true;
      }

      // If the remote location is not defined, then skip it.
      else if (!remote) {
        console.info(`Skipping ${fileName} - Remote provider not specified`);
        skipIt = true;
      }

      // Add the quote to the list, if possible:
      else {
        let provider = remote.provider;
        switch(provider) {
          case QuoteProvider.YAHOO:
          case QuoteProvider.MARKETSTACK:
          case QuoteProvider.ALPHA_VANTAGE:
            break;
          default:
            // If remote provider is not supported, then skip it.
            console.info(`Skipping ${fileName} - Remote provider ${provider} is not supported`);
            skipIt = true;
        }
        let format = local.format;
        switch(format) {
          case QuoteProvider.YAHOO:
          case QuoteProvider.INVESTING:
            break;
          default:
            // If the local format is not supported, then skip it:
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

// To specify a list of named quotes:
// npm run refresh-quotes SPY AGG AUG
let namedQuotes: string[];
let numberOfArguments = process.argv.length;
if (numberOfArguments > 2) {
  namedQuotes = [];
  for(var n = 2; n < numberOfArguments; n++) {
    namedQuotes.push(process.argv[n]);
  }
  console.log("Refreshing the following quotes: " + namedQuotes);
} else {
  console.log("Refreshing all configured quotes");
}

let refreshQuotes: RefreshQuotes = new RefreshQuotes();
refreshQuotes.refreshQuotes(namedQuotes);
