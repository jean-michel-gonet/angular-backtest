import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuotesFromSixService } from './quotes-from-six.service';
import { QuotesFromYahooService } from './quotes-from-yahoo.service';
import { QuotesFromSimpleCsvService } from './quotes-from-simple-csv.service';
import { QuotesService } from './quotes.service';
import { IQuotesService } from './quotes.service.interface';
import { Observable } from 'rxjs';
import { HistoricalQuotes, Dividend, InstantQuotes } from 'src/app/model/core/quotes';
import { QuoteSourceAndProvider, QuotesConfigurationService } from './quotes-configuration.service';
import { Quote } from 'src/app/model/core/asset';

class ConnectionServiceMock implements IQuotesService {
  private historicalQuotes: Map<string, HistoricalQuotes> = new Map<string, HistoricalQuotes>();
  private dividends: Map<string, Dividend[]> = new Map<string, Dividend[]>();

  whenQuotes(name: string, answer: HistoricalQuotes): void {
    this.historicalQuotes.set(name, answer);
  }
  whenDividends(name: string, answer: Dividend[]): void {
    this.dividends.set(name, answer);
  }

  getHistoricalQuotes(source: string, name: string): Observable<HistoricalQuotes> {
    let historicalQuotes: HistoricalQuotes = this.historicalQuotes.get(name);
    return new Observable<HistoricalQuotes>(observer => {
      observer.next(historicalQuotes);
      observer.complete();
    });
  }
  getDividends(source: string, name: string): Observable<Dividend[]> {
    return new Observable<Dividend[]>(observer => {
      observer.next(this.dividends.get(name));
      observer.complete();
    });
  }
}

class SecuritiesConfigurationServiceMock {
  map: Map<string, QuoteSourceAndProvider> = new Map();

  when(name: string, answer: QuoteSourceAndProvider): void {
    this.map.set(name, answer);
  }
  obtainQuoteSourceAndProvider(name: string): QuoteSourceAndProvider {
    return this.map.get(name);
  }
}

describe('QuotesService', () => {
  let six: ConnectionServiceMock;
  let yahoo: ConnectionServiceMock;
  let dateYield: ConnectionServiceMock;
  let configurationService: SecuritiesConfigurationServiceMock;
  let quotesService: QuotesService;

  let now: Date = new Date();
  let today: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let yesterday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  let beforeYesterday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
  let threeDaysAgo: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        {provide: QuotesFromSixService, useClass: ConnectionServiceMock},
        {provide: QuotesFromYahooService, useClass: ConnectionServiceMock},
        {provide: QuotesFromSimpleCsvService, useClass: ConnectionServiceMock},
        {provide: QuotesConfigurationService, useClass: SecuritiesConfigurationServiceMock }
      ]
    });
    six = TestBed.get(QuotesFromSixService);
    yahoo = TestBed.get(QuotesFromYahooService);
    dateYield = TestBed.get(QuotesFromSimpleCsvService);
    configurationService = TestBed.get(QuotesConfigurationService);

    quotesService = TestBed.get(QuotesService);
  });

  it('Can create a new instance', () => {
    expect(quotesService).toBeTruthy();
  });

  it('Can retrieve from Yahoo data', (done: DoneFn) => {
    configurationService.when("ISIN3", {
      name: "ISIN3",
      provider: "finance.yahoo.com",
      source: "xx",
      dividends: {
        provider: "date.yield.csv",
        source: "yy",
      }
    });

    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN3", close: 1.3})
      ]})]);
    yahoo.whenQuotes("ISIN3", historicalQuotes);

    let dividends: Dividend[] = [new Dividend(
      {name: "ISIN3", dividend: 1.5, instant: beforeYesterday}
    )];

    dateYield.whenDividends("ISIN3", dividends);

    quotesService.getHistoricalQuotes(["ISIN3"]).subscribe(data => {
      expect(data.get(beforeYesterday).quote("ISIN3").close).toBe(1.3);
      expect(data.get(beforeYesterday).quote("ISIN3").dividend).toBe(1.5);
      done();
    });
  });
});
