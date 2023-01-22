import { TestBed } from '@angular/core/testing';

import { HistoricalQuotes, IInstantQuotes, Quote } from 'src/app/model/core/quotes';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { AlphaVantageReader, QuotesFromAlphaVantageService } from './quotes-from-alphavantage.service';

// Example of response downloaded from
// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=demo
var alphaVantageResponse = {
  "Meta Data": {
    "1. Information": "Daily Time Series with Splits and Dividend Events",
    "2. Symbol": "IBM",
    "3. Last Refreshed": "2021-04-30",
    "4. Output Size": "Compact",
    "5. Time Zone": "US/Eastern"
  },
  "Time Series (Daily)": {
    "2021-04-30": {
      "1. open": "143.7",
      "2. high": "143.83",
      "3. low": "140.55",
      "4. close": "141.88",
      "5. adjusted close": "141.88",
      "6. volume": "8872181",
      "7. dividend amount": "0.0000",
      "8. split coefficient": "1.0"
    },
    "2021-04-29": {
      "1. open": "144.13",
      "2. high": "148.74",
      "3. low": "142.98",
      "4. close": "144.24",
      "5. adjusted close": "144.24",
      "6. volume": "4353880",
      "7. dividend amount": "0.0000",
      "8. split coefficient": "1.0"
    },
    "2021-04-28": {
      "1. open": "142.92",
      "2. high": "143.4",
      "3. low": "142.1",
      "4. close": "143.0",
      "5. adjusted close": "143.0",
      "6. volume": "3768129",
      "7. dividend amount": "0.0000",
      "8. split coefficient": "1.0"
    }
  }
};

describe('QuotesFromAlphaVantageService', () => {
  let service: QuotesFromAlphaVantageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(QuotesFromAlphaVantageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('Can return InstantQuotes Data from Alpha Vantage', () => {
      service.getHistoricalQuotes("SOURCE", "NAME").subscribe((data: HistoricalQuotes) => {
        expect(data).toBeTruthy();
      });

      const req = httpMock.expectOne((request:HttpRequest<any>) => {
        expect(request.method).toBe('GET');
        expect(request.url).toContain("SOURCE");
        return true
      });

      req.flush(alphaVantageResponse);

      httpMock.verify();
  });
});


describe('AlphaVantageReader', () => {

  it('Can convert responses from Market Stack into HistoricalQuotes', () => {
    let alphaVantageReader: AlphaVantageReader = new AlphaVantageReader("ISIN", alphaVantageResponse);
    let xx: HistoricalQuotes = alphaVantageReader.asHistoricalQuotes();
    let iStock: IInstantQuotes[] = xx.asIStock();
    expect(iStock).toEqual(
      jasmine.arrayWithExactContents([
        new IInstantQuotes({
          instant: new Date(2021, 4 - 1, 30),
          quotes: [
            new Quote({
              name: "ISIN",
              open: 143.7,
              high: 143.83,
              low: 140.55,
              close: 141.88,
              adjustedClose: 141.88,
              volume: 8872181,
              spread: 0,
              dividend: 0
            })
          ]
        }),
        new IInstantQuotes({
          instant: new Date(2021, 4 - 1, 29),
          quotes: [
            new Quote({
              name: "ISIN",
              open: 144.13,
              high: 148.74,
              low: 142.98,
              close: 144.24,
              adjustedClose: 144.24,
              volume: 4353880,
              spread: 0,
              dividend: 0
            })
          ]
        }),
        new IInstantQuotes({
          instant: new Date(2021, 4 - 1, 28),
          quotes: [
            new Quote({
              name: "ISIN",
              open: 142.92,
              high: 143.4,
              low: 142.1,
              close: 143.0,
              adjustedClose: 143.0,
              volume: 3768129,
              spread: 0,
              dividend: 0
            })
          ]
        })
      ]));
  });
});
