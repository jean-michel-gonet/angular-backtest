import { TestBed } from '@angular/core/testing';

import { HistoricalQuotes, IInstantQuotes, Quote } from 'src/app/model/core/quotes';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { MarketStackReader, QuotesFromMarketStackService } from './quotes-from-marketstack.service';

// Example of response downloaded from
// http://api.marketstack.com/v1/eod?access_key=XXX&symbols=SPY&limit=3
var marketStackResponse = {
  "pagination":{
    "limit":124,
    "offset":0,
    "count":124,
    "total":124
  },
  "data":[
    {
      "open":363.84,
      "high":364.18,
      "low":362.58,
      "close":363.67,
      "volume":28514072.0,
      "adj_high":364.18,
      "adj_low":362.58,
      "adj_close":363.67,
      "adj_open":363.84,
      "adj_volume":28514072.0,
      "symbol":"SPY",
      "exchange":"ARCX",
      "date":"2020-11-27T00:00:00+0000"
    },
    {
      "open":363.13,
      "high":363.16,
      "low":361.48,
      "close":362.66,
      "volume":45330890.0,
      "adj_high":363.16,
      "adj_low":361.48,
      "adj_close":362.66,
      "adj_open":363.13,
      "adj_volume":45330890.0,
      "symbol":"SPY",
      "exchange":"ARCX",
      "date":"2020-11-25T00:00:00+0000"
    },
    {
      "open":360.21,
      "high":363.81,
      "low":359.29,
      "close":363.22,
      "volume":60985003.0,
      "adj_high":363.81,
      "adj_low":359.29,
      "adj_close":363.22,
      "adj_open":360.21,
      "adj_volume":60985003.0,
      "symbol":"SPY",
      "exchange":"ARCX",
      "date":"2020-11-24T00:00:00+0000"
    }
  ]
}

describe('QuotesFromMarketStackService', () => {
  let service: QuotesFromMarketStackService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(QuotesFromMarketStackService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('Can return InstantQuotes Data from Market Stack', () => {
      service.getHistoricalQuotes("SOURCE", "NAME").subscribe((data: HistoricalQuotes) => {
        expect(data).toBeTruthy();
      });

      const req = httpMock.expectOne((request:HttpRequest<any>) => {
        expect(request.method).toBe('GET');
        expect(request.url).toContain("SOURCE");
        return true
      });

      req.flush(marketStackResponse);

      httpMock.verify();
  });
});


describe('MarketStackReader', () => {

  it('Can convert responses from Market Stack into HistoricalQuotes', () => {
    let sixReader: MarketStackReader = new MarketStackReader("ISIN", marketStackResponse);
    let xx: HistoricalQuotes = sixReader.asHistoricalQuotes();
    let iStock: IInstantQuotes[] = xx.asIStock();
    expect(iStock).toEqual(
      jasmine.arrayWithExactContents([
        new IInstantQuotes({
          instant: new Date(2020, 11 - 1, 27),
          quotes: [
            new Quote({
              name: "ISIN",
              open: 363.84,
              high: 364.18,
              low: 362.58,
              close: 363.67,
              adjustedClose: 363.67,
              volume: 28514072.0,
              spread: 0,
              dividend: 0
            })
          ]
        }),
        new IInstantQuotes({
          instant: new Date(2020, 11-1, 25),
          quotes: [
            new Quote({
              name: "ISIN",
              open: 363.13,
              high: 363.16,
              low: 361.48,
              close: 362.66,
              adjustedClose: 362.66,
              volume: 45330890.0,
              spread: 0,
              dividend: 0
            })
          ]
        }),
        new IInstantQuotes({
          instant: new Date(2020, 11-1, 24),
          quotes: [
            new Quote({
              name: "ISIN",
              open: 360.21,
              high: 363.81,
              low: 359.29,
              close: 363.22,
              adjustedClose: 363.22,
              volume: 60985003.0,
              spread: 0,
              dividend: 0
            })
          ]
        })
      ]));
  });
});
