import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SixConnectionService } from './six-connection.service';
import { YahooConnectionService } from './yahoo-connection.service';
import { DateYieldConnectionService } from './date-yield-connection.service';
import { StockService } from './stock.service';
import { ConnectionService } from './connection.service';
import { Observable } from 'rxjs';
import { HistoricalQuotes, Dividend, InstantQuotes } from 'src/app/model/core/quotes';
import { QuoteSourceAndProvider, SecuritiesConfigurationService } from './securities-configuration.service';
import { Quote } from 'src/app/model/core/asset';

class ConnectionServiceMock implements ConnectionService {
  private stockData: Map<string, HistoricalQuotes> = new Map<string, HistoricalQuotes>();
  private dividends: Map<string, Dividend[]> = new Map<string, Dividend[]>();

  whenQuotes(name: string, answer: HistoricalQuotes): void {
    this.stockData.set(name, answer);
  }
  whenDividends(name: string, answer: Dividend[]): void {
    this.dividends.set(name, answer);
  }

  getQuotes(source: string, name: string): Observable<HistoricalQuotes> {
    let stockData: HistoricalQuotes = this.stockData.get(name);
    return new Observable<HistoricalQuotes>(observer => {
      observer.next(stockData);
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

describe('StockService', () => {
  let six: ConnectionServiceMock;
  let yahoo: ConnectionServiceMock;
  let dateYield: ConnectionServiceMock;
  let configurationService: SecuritiesConfigurationServiceMock;
  let stockService: StockService;

  let now: Date = new Date();
  let today: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let yesterday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  let beforeYesterday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
  let threeDaysAgo: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        {provide: SixConnectionService, useClass: ConnectionServiceMock},
        {provide: YahooConnectionService, useClass: ConnectionServiceMock},
        {provide: DateYieldConnectionService, useClass: ConnectionServiceMock},
        {provide: SecuritiesConfigurationService, useClass: SecuritiesConfigurationServiceMock }
      ]
    });
    six = TestBed.get(SixConnectionService);
    yahoo = TestBed.get(YahooConnectionService);
    dateYield = TestBed.get(DateYieldConnectionService);
    configurationService = TestBed.get(SecuritiesConfigurationService);

    stockService = TestBed.get(StockService);
  });

  it('Can create a new instance', () => {
    expect(stockService).toBeTruthy();
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

    let stockData: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN3", partValue: 1.3})
      ]})]);
    yahoo.whenQuotes("ISIN3", stockData);

    let dividends: Dividend[] = [new Dividend(
      {name: "ISIN3", dividend: 1.5, instant: beforeYesterday}
    )];

    dateYield.whenDividends("ISIN3", dividends);

    stockService.getHistoricalQuotes(["ISIN3"]).subscribe(data => {
      expect(data.get(beforeYesterday).quote("ISIN3").partValue).toBe(1.3);
      expect(data.get(beforeYesterday).quote("ISIN3").dividend).toBe(1.5);
      done();
    });
  });
});
