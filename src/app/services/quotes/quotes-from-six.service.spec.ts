import { TestBed } from '@angular/core/testing';

import { QuotesFromSixService, SixReader } from './quotes-from-six.service';
import { HistoricalQuotes, IInstantQuotes, Quote } from 'src/app/model/core/quotes';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';

// Example of response downloaded from
// https://www.six-group.com/exchanges/funds/security_info_en.html?id=LU1290894820CHF4
var sixResponse = {
  "protocolVersion":"fqs.json#17x",
  "nettingMinutes":1440,
  "delayMinutes":15,
  "delayedMillis":1599378208885,
  "delayedDateTime":"20200906T09:43:28.885",
  "requestURL":"/itf/fqs/delayed/charts.json?netting=1440&columns=Date,Time,Close,Open,High,Low,TotalVolume&todate=20200906&fromdate=19880630&where=ValorId=CH0009980894CHF9&select=ValorId,ValorSymbol",
  "copyRight":"(c) Copyright by SIX Group Ltd 2020. All rights reserved.",
  "valors":[
    {
      "ValorId":"CH0009980894CHF9",
      "ValorSymbol":"SMI",
      "data":{
            "Date":       [20010315,20010316,20010319,20010320],
            "Time":       [  120000,  120000,  120000,  120000],
            "Close":      [      73,    71.7,   70.25,   71.15],
            "Open":       [   72.85,    73.3,   71.05,   70.35],
            "Low":        [    71.2,    70.9,   70.25,    70.3],
            "High":       [      73,    73.3,   71.95,   71.35],
            "TotalVolume":[   41965,   30255,    9144,   15863]
      }
    }
  ],
  "elapsed":26
}

describe('QuotesFromSixService', () => {
  let service: QuotesFromSixService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.get(QuotesFromSixService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('Can return InstantQuotes Data from SIX', () => {
      service.getHistoricalQuotes("SOURCE", "NAME").subscribe((data: HistoricalQuotes) => {
        expect(data).toBeTruthy();
      });

      const req = httpMock.expectOne((request:HttpRequest<any>) => {
        expect(request.method).toBe('GET');
        expect(request.url).toContain("SOURCE");
        return true
      });

      req.flush(sixResponse);

      httpMock.verify();
  });
});


describe('SixReader', () => {

  it('Can convert responses from SIX into HistoricalQuotes', () => {
    let sixReader: SixReader = new SixReader("ISIN", sixResponse);
    let xx: HistoricalQuotes = sixReader.asHistoricalQuotes();
    let iStock: IInstantQuotes[] = xx.asIStock();
    expect(iStock).toEqual(
      jasmine.arrayWithExactContents([
        new IInstantQuotes({
          instant: new Date(2001, 2, 15),
          quotes: [
            new Quote({
              name: "ISIN",
              close: 73,
              open: 72.85,
              low: 71.2,
              high: 73,
              volume: 41965,
              spread: 0,
              dividend: 0
            })
          ]
        }),
        new IInstantQuotes({
          instant: new Date(2001, 2, 16),
          quotes: [
            new Quote({
              name: "ISIN",
              close: 71.7,
              open: 73.3,
              low: 70.9,
              high: 73.3,
              volume: 30255,
              spread: 0,
              dividend: 0
            })
          ]
        }),
        new IInstantQuotes({
          instant: new Date(2001, 2, 19),
          quotes: [
            new Quote({
              name: "ISIN",
              close: 70.25,
              open: 71.05,
              low: 70.25,
              high: 71.95,
              volume: 9144,
              spread: 0,
              dividend: 0
            })
          ]
        }),
        new IInstantQuotes({
          instant: new Date(2001, 2, 20),
          quotes: [
            new Quote({
              name: "ISIN",
              close: 71.15,
              open: 70.35,
              low: 70.3,
              high: 71.35,
              volume: 15863,
              spread: 0,
              dividend: 0
            })
          ]
        })
      ]));
  });
});
