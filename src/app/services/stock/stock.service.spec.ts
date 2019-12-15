import { TestBed } from '@angular/core/testing';
import { StockService } from './stock.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Example downloaded from https://www.six-group.com/exchanges/funds/security_info_en.html?id=LU1290894820CHF4
var sixGroupResponse = {
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

describe('StockService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule]
  }));

  it('should be created', () => {
  });
});
