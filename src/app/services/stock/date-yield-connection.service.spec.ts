import { TestBed } from '@angular/core/testing';

import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Dividend } from 'src/app/model/core/stock';
import { HttpRequest } from '@angular/common/http';
import { DateYieldConnectionService, DateYieldConverter } from './date-yield-connection.service';


var dateYieldResponse = "Date,Yield\r\n" +
  "2019-12-31,1.81\r\n" +
  "2018-12-31,2.09\r\n" +
  "2017-12-31,1.84\r\n" +
  "2016-12-31,2.03\r\n";

describe('DateYieldConnectionService', () => {
  let service: DateYieldConnectionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.get(DateYieldConnectionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('Can return Dividends Data from a date yield source', () => {
      service.getDividends("SOURCE", "NAME").subscribe((data: Dividend[]) => {
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
    let dateYieldConverter: DateYieldConverter = new DateYieldConverter("ISIN1", dateYieldResponse);
    let dividends: Dividend[] = dateYieldConverter.asHistoricalQuotes();
    expect(dividends).toEqual(
      jasmine.arrayWithExactContents([
        new Dividend({
          instant: new Date(2019, 11, 31),
          name: "ISIN1",
          dividend: 1.81}),
        new Dividend({
          instant: new Date(2018, 11, 31),
          name: "ISIN1",
          dividend: 2.09}),
        new Dividend({
          instant: new Date(2017, 11, 31),
          name: "ISIN1",
          dividend: 1.84}),
        new Dividend({
          instant: new Date(2016, 11, 31),
          name: "ISIN1",
          dividend: 2.03})
      ]));
  });
});
