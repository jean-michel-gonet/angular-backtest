import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SixConnectionService } from './six-connection.service';
import { YahooConnectionService } from './yahoo-connection.service';
import { DateYieldConnectionService } from './date-yield-connection.service';
import { StockService } from './stock.service';
import { ConnectionService } from './connection.service';
import { Observable } from 'rxjs';
import { StockData, Dividend, Stock } from 'src/app/model/core/stock';
import { QuoteSourceAndProvider, SecuritiesConfigurationService } from './securities-configuration.service';
import { AssetOfInterest } from 'src/app/model/core/asset';

class ConnectionServiceMock implements ConnectionService {
  private stockData: Map<string, StockData> = new Map<string, StockData>();
  private dividends: Map<string, Dividend[]> = new Map<string, Dividend[]>();

  whenQuotes(source: string, name: string, answer: StockData): void {
    this.stockData.set(source + ":" + name, answer);
  }
  whenDividends(source: string, name: string, answer: Dividend[]): void {
    this.dividends.set(source + ":" + name, answer);
  }

  getQuotes(source: string, name: string): Observable<StockData> {
    return new Observable<StockData>(observer =>{
      observer.next(this.stockData.get(source + ":" + name))
    });
  }
  getDividends(source: string, name: string): Observable<Dividend[]> {
    return new Observable<Dividend[]>(observer => {
      observer.next(this.dividends.get(source + ":" + name));
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

  it('Can retrieve from Yahoo data', () => {
    configurationService.when("NAME", {
      name: "NAME",
      provider: "finance.yahoo.com",
      source: "xx",
      dividends: {
        provider: "date.yield.csv",
        source: "yy",
      }
    });

    let stockData: StockData = new StockData([
      new Stock({time: beforeYesterday, assetsOfInterest: [
        new AssetOfInterest({isin: "ISIN3", partValue: 1.3})
      ]})]);
    six.whenQuotes("NAME", "xx", stockData);

    let dividends: Dividend[] = [new Dividend(
      {isin: "NAME", dividend: 1.5, time: beforeYesterday}
    )];

    dateYield.whenDividends("NAME", "yy", dividends);

    return stockService.getStockData(["NAME"]).subscribe(data => {
      expect(data.get(beforeYesterday).assetOfInterest("ISIN3").partValue).toBe(100);
    });
  });

/*
it('Can retrieve from Yahoo data (2)', async(inject( [StockService], ( stockService: StockService ) => {
  configurationService.when("NAME", {
    name: "NAME",
    provider: "finance.yahoo.com",
    source: "xx",
    dividends: {
      provider: "date.yield.csv",
      source: "yy",
    }
  });

  let stockData: StockData = new StockData([
    new Stock({time: beforeYesterday, assetsOfInterest: [
      new AssetOfInterest({isin: "ISIN3", partValue: 1.3})
    ]})]);
  six.whenQuotes("NAME", "xx", stockData);

  let dividends: Dividend[] = [new Dividend(
    {isin: "NAME", dividend: 1.5, time: beforeYesterday}
  )];

  dateYield.whenDividends("NAME", "yy", dividends);

  stockService.getStockData(["NAME"]).subscribe(data => {
    expect(data.get(beforeYesterday).assetOfInterest("ISIN3").partValue).toBe(1.3);
    expect(data.get(beforeYesterday).assetOfInterest("ISIN3").dividend).toBe(1.5);
  });
})));
*/

});
