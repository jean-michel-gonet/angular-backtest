import { NamedQuoteSource, QuoteProvider } from '../app/services/quotes/quote-configuration';
import { HistoricalQuotes } from '../app/model/core/quotes';
import { YahooReader, YahooWriter } from '../app/services/quotes/quotes-from-yahoo.service';
import { MarketStackReader } from '../app/services/quotes/quotes-from-marketstack.service';
import { QUOTE_SOURCES } from '../assets/quotes/configuration';
import { MARKET_STACK_ACCESS_KEY } from './market-stack.access-key';
import { readFile, writeFile} from 'fs';
import { join } from 'path';
import { get } from 'http';

export class RefreshQuotes {

  /**
   * Refreshes all elligible quotes in the QUOTE_SOURCES configuration.
   * For a quote to be elligible:
   * - It has to be in YAHOO format.
   * - It has to be in the local file system.
   */
  public doIt():void {
    QUOTE_SOURCES.forEach(namedQuoteSource => {
      if (namedQuoteSource.quote.provider == QuoteProvider.YAHOO) {
        let fileSystemPath = this.makeRelativePath(namedQuoteSource.quote.uri);
        readFile(fileSystemPath, {encoding: 'utf-8'}, (err, data) => {
          if (err != null) {
            console.log(`Ignoring: ${fileSystemPath} - ${err}`);
          } else {
            console.log(`Processing ${fileSystemPath}: ${data.length} bytes long.`);
            this.update(namedQuoteSource, data, updatedData => {
              writeFile(fileSystemPath + "1", updatedData, {encoding: 'utf-8'}, () => {
                console.log(`Finished processing ${fileSystemPath}`);
              });
            });
          }
        });
      } else {
        console.log(`Skipping: ${namedQuoteSource.name} - Only YAHOO format is supported`);
      }
    });
  }

  private update(namedQuoteSource: NamedQuoteSource, localData: string, callback: (updatedData: string) => void): void {
    let name: string = namedQuoteSource.name;

    // Loads local data:
    let yahooReader: YahooReader = new YahooReader(name, localData);
    let historicalQuotes: HistoricalQuotes = yahooReader.asHistoricalQuotes();

    // Find the most recent available date:
    let mostRecentDate: Date = this.mostRecentDateOf(historicalQuotes);

    // Download additional market data:
    this.downloadMarketStackData(name, mostRecentDate, data => {
      // Parse remote data:
      let marketStackReader: MarketStackReader = new MarketStackReader(name, data);
      let additionalHistoricalQuotes = marketStackReader.asHistoricalQuotes();

      // Merge local and remote data:
      historicalQuotes.merge(additionalHistoricalQuotes);

      // Make a CSV file with the result:
      let yahooWriter: YahooWriter = new YahooWriter(name, historicalQuotes);
      let updatedData: string = yahooWriter.asYahooCsvFile();

      // Pass on the result:
      callback(updatedData);
    });
  }

  /**
   * Handles the transport of data from Market Stack, and parses it as JSON.
   * @param{string} name The ticker to download.
   * @param{Date} dateFrom Downloads data from this date, including it.
   * @param{callback: (any: any) => void} callback Method called when the
   * download is complete.
   */
  private downloadMarketStackData(name: string, dateFrom: Date, callback: (any: any) => void): void {
    let url: string = "http://api.marketstack.com/v1/eod?access_key=" + MARKET_STACK_ACCESS_KEY
        + "&symbols=" + name
        + "&date_from=" + this.formatDateYYYYMMDD(dateFrom, "-");

    get(url, incomingMessage => {

      // Check that there are no errors in the incoming message:
      let statusCode: number = incomingMessage.statusCode;
      let contentType: string = incomingMessage.headers['content-type'];
      let error: Error;
      if (statusCode != 200) {
        error = new Error('Request to ' + url + ' failed. Status code: ' + statusCode);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content type. Expected "application/json" but got ' + contentType);
      }
      if (error) {
        console.error(error);
        incomingMessage.resume();
        return;
      }

      // Obtain the whole content of the message:
      incomingMessage.setEncoding('utf-8');
      let rawData = "";
      incomingMessage.on('data', chunk => {
        rawData += chunk;
      });
      incomingMessage.on('end', () => {
        try {

          // Parse as JSON:
          const parsedData = JSON.parse(rawData);

          // Pass it on:
          callback(parsedData);
        } catch (e) {
          console.error(e.message);
        }
      });
    })
    .on('error', e => {
      console.log(`Error while downloading data from ${url} for ${name}: ${e.message}`);
    });
  }

  private mostRecentDateOf(historicalQuotes: HistoricalQuotes): Date {
    let mostRecentDate: Date;
    historicalQuotes.forEachDate(instantQuotes => {
      if (mostRecentDate) {
        if (instantQuotes.instant.valueOf() > mostRecentDate.valueOf()) {
          mostRecentDate = instantQuotes.instant;
        }
      } else {
        mostRecentDate = instantQuotes.instant;
      }
    });
    return mostRecentDate;
  }

  private formatDateYYYYMMDD(date: Date, separator: string): string {
    let nMonth: number = date.getMonth() + 1;
    let sMonth: string;
    if (nMonth < 10) {
      sMonth = "0" + nMonth.toString();
    } else {
      sMonth = nMonth.toString();
    }

    let nDay = date.getDate();
    let sDay: string;
    if (nDay < 10) {
      sDay = "0" + nDay.toString();
    } else {
      sDay = nDay.toString();
    }

    let sYear = date.getFullYear().toString();

    return sYear + separator + sMonth + separator + sDay;
  }

  private makeRelativePath(uri: string): string {
    if (uri.startsWith('/')) {
      return uri;
    } else {
      return join(__dirname, "../assets/quotes/", uri);
    }
  }
}

let hello: RefreshQuotes = new RefreshQuotes();
hello.doIt();
