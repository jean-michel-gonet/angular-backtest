import { TestBed } from '@angular/core/testing';
import { QuotesFromYahooService, YahooReader } from './quotes-from-yahoo.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HistoricalQuotes, IInstantQuotes, Quote } from 'src/app/model/core/quotes';
import { HttpRequest } from '@angular/common/http';

var yahooResponse = "Date,Open,High,Low,Close,Adj Close,Volume\r\n" +
"1993-02-15,9834.599609,9913.400391,9764.099609,9865.299805,9865.290039,10256100\r\n" +
"1993-02-16,null,null,null,null,null,null\r\n" +
"1993-03-19,9393.299805,9393.299805,9243.000000,9251.299805,9251.290039,6878000\r\n" +
"1993-03-22,null,null,null,null,null,null\r\n" +
"1993-04-06,2612.300049,2612.300049,2599.300049,2603.199951,2603.197266,0\r\n" +
"1993-04-20,9798.000000,9856.099609,9535.299805,9547.500000,9547.490234,9644600\r\n";

describe('QuotesFromYahooService', () => {
  let service: QuotesFromYahooService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.get(QuotesFromYahooService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('Can return InstantQuotes Data from Yahoo', () => {
      service.getHistoricalQuotes("SOURCE", "NAME").subscribe((data: HistoricalQuotes) => {
        expect(data).toBeTruthy();
      });

      const req = httpMock.expectOne((request:HttpRequest<any>) => {
        expect(request.method).toBe('GET');
        expect(request.url).toContain("SOURCE");
        return true
      });

      req.flush(yahooResponse);

      httpMock.verify();
  });
});

describe('YahooReader', () => {
  it('Can convert responses from Yahoo into HistoricalQuotes', () => {
    let yahooReader: YahooReader = new YahooReader("ISIN1", yahooResponse);
    let xx: HistoricalQuotes = yahooReader.asHistoricalQuotes();
    let iStock: IInstantQuotes[] = xx.asIStock();
    expect(iStock).toEqual(
      jasmine.arrayWithExactContents([
        new IInstantQuotes({
          instant: new Date(1993, 1, 15),
          quotes: [
            new Quote({
              name: "ISIN1",
              open: 9834.599609,
              high: 9913.400391,
              low: 9764.099609,
              close: 9865.299805,
              volume: 10256100,
              spread: 0,
              dividend: 0
            })]}),
        new IInstantQuotes({
          instant: new Date(1993, 2, 19),
          quotes: [
            new Quote({
              name: "ISIN1",
              open: 9393.299805,
              high: 9393.299805,
              low: 9243.000000,
              close: 9251.299805,
              volume: 6878000,
              spread: 0,
              dividend: 0
            })]}),
        new IInstantQuotes({
          instant: new Date(1993, 3, 6),
          quotes: [
            new Quote({
              name: "ISIN1",
              open: 2612.300049,
              high: 2612.300049,
              low: 2599.300049,
              close: 2603.199951,
              volume: 0,
              spread: 0,
              dividend: 0
            })]}),
        new IInstantQuotes({
          instant: new Date(1993, 3, 20),
          quotes: [
            new Quote({
              name: "ISIN1",
              open: 9798.000000,
              high: 9856.099609,
              low: 9535.299805,
              close: 9547.500000,
              volume: 9644600,
              spread: 0,
              dividend: 0
            })]})
      ]));
  });
});
