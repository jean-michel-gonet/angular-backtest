import { TestBed } from '@angular/core/testing';

import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { PlainDataService, DateYieldCsvConverter } from './plain-data.service';
import { HistoricalValue } from 'src/app/model/core/quotes';

var dateYieldResponse = "Date,Yield\r\n" +
  "2019-12-31,1.81\r\n" +
  "2018-12-31,2.09\r\n" +
  "2017-12-31,1.84\r\n" +
  "2016-12-31,2.03\r\n";

describe('QuotesFromSimpleCsvService', () => {
  let service: PlainDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.get(PlainDataService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('Can return Dividends Data from a date yield source', () => {
      service.getHistoricalValues("SOURCE").subscribe((data: HistoricalValue[]) => {
        expect(data).toBeTruthy();
      });

      const req = httpMock.expectOne((request:HttpRequest<any>) => {
        expect(request.method).toBe('GET');
        expect(request.url).toContain("SOURCE");
        return true
      });

      req.flush(dateYieldResponse);

      httpMock.verify();
  });
});

describe('DateYieldConverter', () => {
  it('Can convert responses from Date Yield pairs into Dividends', () => {
    let dateYieldConverter: DateYieldCsvConverter = new DateYieldCsvConverter(dateYieldResponse);
    let historicalValues: HistoricalValue[] = dateYieldConverter.asHistoricalValues();
    expect(historicalValues).toEqual(
      jasmine.arrayWithExactContents([
        {
          instant: new Date(2019, 11, 31),
          value: 1.81
        },
        {
          instant: new Date(2018, 11, 31),
          value: 2.09
        },
        {
          instant: new Date(2017, 11, 31),
          value: 1.84
        },
        {
          instant: new Date(2016, 11, 31),
          value: 2.03}
      ]));
  });
});
