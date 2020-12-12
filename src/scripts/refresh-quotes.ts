import { readFile, writeFile} from 'fs';
import { join } from 'path';
import * as https from 'https';
import * as http  from 'http';
import { Observable, Observer } from 'rxjs';

import { QUOTE_SOURCES } from '../assets/quotes/configuration';
import { MARKET_STACK_ACCESS_KEY } from './market-stack.access-key';

import { NamedQuoteSource, QuoteProvider } from '../app/services/quotes/quote-configuration';
import { HistoricalQuotes } from '../app/model/core/quotes';
import { YahooReader, YahooWriter } from '../app/services/quotes/quotes-from-yahoo.service';
import { MarketStackReader } from '../app/services/quotes/quotes-from-marketstack.service';
import { InvestingReader, InvestingWriter } from '../app/services/quotes/quotes-from-investing.service';
import { StringUtils } from '../app/model/utils/string-utils';

export class RefreshQuotes {

  public refreshAll():void {
    // Make the list of all elligible files to refresh:
    let quotesToRefresh = this.quotesToRefresh();

    // Refresh each file.
    quotesToRefresh.forEach(namedQuoteSource => {
      let fileName = this.makeRelativePath(namedQuoteSource.quote.local.fileName);
      readFile(fileName, {encoding: 'utf-8'}, (err, localData) => {
        if (err != null) {
          console.info(`Dropping ${namedQuoteSource.name} - ${fileName}: ${err}`);
        } else {
          console.info(`Processing ${namedQuoteSource.name} - ${fileName}: ${localData.length} bytes long.`);
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
      let reader = new YahooReader(namedQuoteSource.name, localData);
      let localHistoricalQuotes = reader.asHistoricalQuotes();
      let dateFrom = localHistoricalQuotes.maxDate(namedQuoteSource.name);
      console.info(`Local quotes ${namedQuoteSource.name} available in Yahoo format up to ${dateFrom}`);
      this.downloadMoreFrom(namedQuoteSource, dateFrom).subscribe(
        historicalQuotes => {
          localHistoricalQuotes.merge(historicalQuotes);
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
      let reader = new InvestingReader(namedQuoteSource.name, localData);
      let localHistoricalQuotes = reader.asHistoricalQuotes();
      let dateFrom = localHistoricalQuotes.maxDate(namedQuoteSource.name);
      console.info(`Local quotes ${namedQuoteSource.name} available in Investing format up to ${dateFrom}`);
      this.downloadMoreFrom(namedQuoteSource, dateFrom).subscribe(
        historicalQuotes => {
          localHistoricalQuotes.merge(historicalQuotes);
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
        return this.downloadMoreFromYahoo(namedQuoteSource, dateFrom);
      case QuoteProvider.MARKETSTACK:
        return this.downloadMoreFromMarketStack(namedQuoteSource, dateFrom);
      default:
        return new Observable<HistoricalQuotes>(observer => {
          observer.error(new Error("Remote provider not supported - " + provider));
        });
    }
  }
  // 1607367683677
  // 1607365153
  private downloadMoreFromYahoo(namedQuoteSource: NamedQuoteSource, dateFrom: Date): Observable<HistoricalQuotes> {
    let ticker = namedQuoteSource.quote.remote.ticker;
    let period1 = Math.floor(new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate()).valueOf() / 1000);
    let today = new Date();
    let period2 = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).valueOf() / 1000);
    let url: string = "https://query1.finance.yahoo.com/v7/finance/download/" + ticker + "?"
        + "period1=" + period1.toString()
        + "&period2=" + period2.toString()
        + "&interval=1d&events=history&includeAdjustedClose=true";

    return new Observable<HistoricalQuotes>(observer => {
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
  }

  private downloadMoreFromMarketStack(namedQuoteSource: NamedQuoteSource, dateFrom: Date): Observable<HistoricalQuotes> {
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

  private downloadFromUrl(url: string): Observable<string> {
    if (url.startsWith("https")) {
      console.info("Retrieving HTTPS from " + url);
      return new Observable<string>(observer => {
        https.get(url, incomingMessage => {
          this.incomingMessage(incomingMessage, observer);
        }).on("error", (e) => {
          observer.error(e);
        });
      });
    } else {
      console.info("Retrieving HTTP from " + url);
      return new Observable<string>(observer => {
        http.get(url, incomingMessage => {
          this.incomingMessage(incomingMessage, observer);
        }).on("error", (e) => {
          observer.error(e);
        });
      });
    }
  }

  private incomingMessage(incomingMessage: http.IncomingMessage, observer: Observer<string>): void {
    // Check that there are no errors in the incoming message:
    let statusCode: number = incomingMessage.statusCode;
    if (statusCode != 200) {
      observer.error(new Error("Status code: " + statusCode));
      incomingMessage.resume();
      return;
    }
    else {
      // Set the encoding
      incomingMessage.setEncoding('utf-8');

      // Donwload the message:
      let rawData = "";
      incomingMessage.on('data', chunk => {
        rawData += chunk;
      });

      // Send the message to the observer:
      incomingMessage.on('end', () => {
        observer.next(rawData);
        observer.complete();
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

    QUOTE_SOURCES.forEach(namedQuoteSource => {
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
