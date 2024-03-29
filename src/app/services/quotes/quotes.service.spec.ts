import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuotesFromSixService } from './quotes-from-six.service';
import { QuotesFromYahooService } from './quotes-from-yahoo.service';
import { QuotesFromAlphaVantageService } from './quotes-from-alphavantage.service';
import { makePathRelativeToQuotes, QuotesService, QuotesServiceImpl } from './quotes.service';
import { IQuotesService } from './quotes.service.interface';
import { Observable } from 'rxjs';
import { HistoricalQuotes, InstantQuotes, Quote, HistoricalValue } from 'src/app/model/core/quotes';
import { QuotesConfigurationService, IQuotesConfigurationService } from './quotes-configuration.service';
import { PlainDataService, IPlainDataService } from './plain-data.service';
import { QuotesFromInvestingService } from './quotes-from-investing.service';
import { NamedQuoteSource, QuoteProvider, DataFormat } from './quote-configuration';

class PlainDataServiceMock implements IPlainDataService {
  private dividends: Map<string, HistoricalValue[]> = new Map<string, HistoricalValue[]>();

  getHistoricalValues(uri: string): Observable<HistoricalValue[]> {
    let historicalValue: HistoricalValue[] = this.dividends.get(uri);
    if (!historicalValue) {
      throw new Error("No historical values for " + uri);
    }
    return new Observable<HistoricalValue[]>(observer => {
      observer.next(historicalValue);
      observer.complete();
    });
  }

  whenDividends(uri: string, answer: HistoricalValue[]): void {
    this.dividends.set(uri, answer);
  }
}

class ConnectionServiceMock implements IQuotesService {
  private historicalQuotes: Map<string, HistoricalQuotes> = new Map<string, HistoricalQuotes>();

  whenQuotes(uri: string, answer: HistoricalQuotes): void {
    this.historicalQuotes.set(uri, answer);
  }

  getHistoricalQuotes(uri: string, name: string): Observable<HistoricalQuotes> {
    let historicalQuotes: HistoricalQuotes = this.historicalQuotes.get(uri);
    if (!historicalQuotes) {
      throw new Error("No historical quotes for " + uri);
    }
    return new Observable<HistoricalQuotes>(observer => {
      observer.next(historicalQuotes);
      observer.complete();
    });
  }
}

class QuotesConfigurationServiceMock implements IQuotesConfigurationService {
  map: Map<string, NamedQuoteSource> = new Map();

  obtainNamedQuoteSource(name: string): NamedQuoteSource {
    return this.map.get(name);
  }

  when(name: string, answer: NamedQuoteSource): void {
    this.map.set(name, answer);
  }
}

describe('QuotesService', () => {
  let six: ConnectionServiceMock;
  let yahoo: ConnectionServiceMock;
  let investing: ConnectionServiceMock;
  let alphaVantage: ConnectionServiceMock;
  let plainData: PlainDataServiceMock;
  let configurationService: QuotesConfigurationServiceMock;
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
        {provide: QuotesFromInvestingService, useClass: ConnectionServiceMock},
        {provide: QuotesFromAlphaVantageService, useClass: ConnectionServiceMock},
        {provide: PlainDataService, useClass: PlainDataServiceMock},
        {provide: QuotesConfigurationService, useClass: QuotesConfigurationServiceMock }
      ]
    });
    six = TestBed.inject(QuotesFromSixService) as unknown as ConnectionServiceMock;
    yahoo = TestBed.inject(QuotesFromYahooService) as unknown as ConnectionServiceMock;
    investing = TestBed.inject(QuotesFromInvestingService) as unknown as ConnectionServiceMock;
    alphaVantage = TestBed.inject(QuotesFromAlphaVantageService) as unknown as ConnectionServiceMock;
    plainData = TestBed.inject(PlainDataService) as unknown as PlainDataServiceMock;
    configurationService = TestBed.inject(QuotesConfigurationService) as unknown as QuotesConfigurationServiceMock;

    quotesService = TestBed.get(QuotesServiceImpl);
  });

  it('Can create a new instance', () => {
    expect(quotesService).toBeTruthy();
  });

  it('Can retrieve from Investing data', (done: DoneFn) => {
    configurationService.when("ISIN3", {
      name: "ISIN3",
      quote: {
        local: {
          format: QuoteProvider.INVESTING,
          fileName: "xx",
        }
      }
    });
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN3", close: 1.3})
      ]})]);

    investing.whenQuotes(makePathRelativeToQuotes("xx"), historicalQuotes);

    quotesService.getQuotes(["ISIN3"]).subscribe(data => {
      expect(data.get(beforeYesterday).quote("ISIN3").close).toBe(1.3);
      done();
    });
  });

  it('Can retrieve from Yahoo data', (done: DoneFn) => {
    configurationService.when("ISIN3", {
      name: "ISIN3",
      quote: {
        local: {
          format: QuoteProvider.YAHOO,
          fileName: "xx",
        }
      },
      dividends: {
        level1TaxWitholding: 0.34,
        directDividends: {
          format: DataFormat.DATE_VALUE_CSV,
          uri: "yy"
        }
      }
    });

    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN3", close: 1.3})
      ]})]);
    let dividends: HistoricalValue[] = [{value: 1.5, instant: beforeYesterday}];

    yahoo.whenQuotes(makePathRelativeToQuotes("xx"), historicalQuotes);
    plainData.whenDividends(makePathRelativeToQuotes("yy"), dividends);

    quotesService.getQuotes(["ISIN3"]).subscribe(data => {
      expect(data.get(beforeYesterday).quote("ISIN3").close).toBe(1.3);
      expect(data.get(beforeYesterday).quote("ISIN3").dividend).toBe(1.5);
      done();
    });
  });
  it('Can retrieve from Alpha Vantage data', (done: DoneFn) => {
    configurationService.when("ISIN3", {
      name: "ISIN3",
      quote: {
        local: {
          format: QuoteProvider.ALPHA_VANTAGE,
          fileName: "xx",
        }
      }
    });
    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN3", close: 1.3})
      ]})]);

    alphaVantage.whenQuotes(makePathRelativeToQuotes("xx"), historicalQuotes);

    quotesService.getQuotes(["ISIN3"]).subscribe(data => {
      expect(data.get(beforeYesterday).quote("ISIN3").close).toBe(1.3);
      done();
    });
  });

  it('Can retrieve quotes from Six data and total return from Yahoo', (done: DoneFn) => {
    configurationService.when("ISIN3", {
      name: "ISIN3",
      quote: {
        local: {
          format: QuoteProvider.SIX,
          fileName: "xx",
        }
      },
      dividends: {
        level1TaxWitholding: 0.34,
        totalReturn: {
          local: {
            format: QuoteProvider.YAHOO,
            fileName: "yy"
          }
        }
      }
    });

    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: threeDaysAgo, quotes: [
        new Quote({name: "ISIN3", close: 1.3})
      ]}),
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN3", close: 1.4})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN3", close: 1.5})
      ]}),
    ]);

    let totalReturnQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: threeDaysAgo, quotes: [
        new Quote({name: "TR", close: 13})
      ]}),
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "TR", close: 15})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "TR", close: 16})
      ]}),
    ]);

    six.whenQuotes(makePathRelativeToQuotes("xx"), historicalQuotes);
    yahoo.whenQuotes(makePathRelativeToQuotes("yy"), totalReturnQuotes);

    quotesService.getQuotes(["ISIN3"]).subscribe(data => {
      expect(data.get(threeDaysAgo).quote("ISIN3").close).toBe(1.3);
      expect(data.get(threeDaysAgo).quote("ISIN3").dividend).toBe(0);
      done();
    });
  });

  it('Can retrieve quotes from Yahoo and enrich based on adjusted close', (done: DoneFn) => {
    configurationService.when("ISIN3", {
      name: "ISIN3",
      quote: {
        local: {
          format: QuoteProvider.SIX,
          fileName: "xx",
        }
      }
    });

    let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
      new InstantQuotes({instant: threeDaysAgo, quotes: [
        new Quote({name: "ISIN3", close: 1.3, adjustedClose: 1.0})
      ]}),
      new InstantQuotes({instant: beforeYesterday, quotes: [
        new Quote({name: "ISIN3", close: 1.4, adjustedClose: 1.3})
      ]}),
      new InstantQuotes({instant: yesterday, quotes: [
        new Quote({name: "ISIN3", close: 1.5, adjustedClose: 1.5})
      ]}),
    ]);

    six.whenQuotes(makePathRelativeToQuotes("xx"), historicalQuotes);

    quotesService.getQuotes(["ISIN3"]).subscribe(data => {
      expect(data.get(threeDaysAgo).quote("ISIN3").close).toBe(1.3);
      expect(data.get(threeDaysAgo).quote("ISIN3").dividend).toBe(0);

      expect(data.get(beforeYesterday).quote("ISIN3").close).toBe(1.4);
      expect(data.get(beforeYesterday).quote("ISIN3").dividend).toBeCloseTo(0.290, 3);

      expect(data.get(yesterday).quote("ISIN3").close).toBe(1.5);
      expect(data.get(yesterday).quote("ISIN3").dividend).toBeCloseTo(0.115, 3);

      done();
    });
  });

});
