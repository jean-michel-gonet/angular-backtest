import { TestBed } from '@angular/core/testing';

import { QuotesFromSixService, SixConverter } from './six-connection.service';
import { HistoricalQuotes, IInstantQuotes } from 'src/app/model/core/quotes';
import { Quote } from 'src/app/model/core/asset';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';

// Example of response downloaded from
// https://www.six-group.com/exchanges/funds/security_info_en.html?id=LU1290894820CHF4
var sixResponse = {
  "protocolVersion":"fqs.json#17x",
  "nettingMinutes":1440,
  "delayMinutes":15,
  "delayedMillis":1575097265002,
  "delayedDateTime":"20191130T08:01:05.002",
  "requestURL":"/itf/fqs/delayed/charts.json?netting=1440&columns=Date,Time,Close,Open,Low,High,TotalVolume&fromdate=19880630&where=ValorId=LU1290894820CHF4&select=ISIN,ClosingPrice,ClosingPerformance,PreviousClosingPrice",
  "copyRight":"(c) Copyright by SIX Group Ltd 2019. All rights reserved.",
  "valors":[
    {
      "ISIN":"LU1290894820",
      "ClosingPrice":141.5,
      "ClosingPerformance":0,
      "PreviousClosingPrice":141.5,
      "data":{
        "Date":        [20160721, 20160722, 20160723, 20160726],
        "Time":        [120000,   120000,   120000,   120000  ],
        "Close":       [109.39,   108.19,       "",   109.97  ],
        "Open":        [109.39,   108.19,   108.82,   109.97  ],
        "High":        [109.39,   108.19,   108.82,   109.97  ],
        "TotalVolume": [0,        70,       12,       0       ]
      }
    }
  ],
  "elapsed":21
};

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


describe('SixConverter', () => {

  it('Can convert responses from SIX into HistoricalQuotes', () => {
    let sixConverter: SixConverter = new SixConverter(sixResponse);
    let xx: HistoricalQuotes = sixConverter.asHistoricalQuotes();
    let iStock: IInstantQuotes[] = xx.asIStock();
    expect(iStock).toEqual(
      jasmine.arrayWithExactContents([
        new IInstantQuotes({
          instant: new Date(2016, 7, 21),
          quotes: [
            new Quote({
              name: "LU1290894820",
              partValue: 109.39,
              spread: 0,
              dividend: 0
            })
          ]
        }),
        new IInstantQuotes({
          instant: new Date(2016, 7, 22),
          quotes: [
            new Quote({
              name: "LU1290894820",
              partValue: 108.19,
              spread: 0,
              dividend: 0
            })
          ]
        }),
        new IInstantQuotes({
          instant: new Date(2016, 7, 23),
          quotes: [
            new Quote({
              name: "LU1290894820",
              partValue: 0,
              spread: 0,
              dividend: 0
            })
          ]
        }),
        new IInstantQuotes({
          instant: new Date(2016, 7, 26),
          quotes: [
            new Quote({
              name: "LU1290894820",
              partValue: 109.97,
              spread: 0,
              dividend: 0
            })
          ]
        })
      ]));
  });
});