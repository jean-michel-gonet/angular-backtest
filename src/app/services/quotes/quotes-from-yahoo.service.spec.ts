import { TestBed } from '@angular/core/testing';
import { QuotesFromYahooService, YahooReader, YahooWriter } from './quotes-from-yahoo.service';
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
    service = TestBed.inject(QuotesFromYahooService);
    httpMock = TestBed.inject(HttpTestingController);
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
describe('YahooWriter', () => {
  let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
    new IInstantQuotes({
      instant: new Date(2001, 12 - 1, 25),
      quotes: [
        new Quote({name: "SP500",   open: 100, close: 90, high: 110, low: 80, adjustedClose:89,   volume: 100000}),
        new Quote({name: "FTSE100", open:  10, close:  9, high:  11, low:  8, adjustedClose: 8.9, volume:    600})
      ]
    }),
    new IInstantQuotes({
      instant: new Date(2001, 12 - 1, 26),
      quotes: [
        new Quote({name: "SP500",   open: 105, close: 95, high: 115, low: 85, adjustedClose: 94, volume: 150000}),
        new Quote({name: "FTSE100", open:  20, close: 19, high:  21, low: 18, adjustedClose: 18, volume:    300})
      ]
    }),
  ]);

  it('Can convert historical quotes into Yahoo CSV file', () => {
    let yahooWriter1: YahooWriter = new YahooWriter("SP500", historicalQuotes);
    let yahooWriter2: YahooWriter = new YahooWriter("FTSE100", historicalQuotes);

    let csv1: string = yahooWriter1.asYahooCsvFile();
    expect(csv1).toBe("Date,Open,High,Low,Close,Adj Close,Volume\r\n" +
	     "2001-12-25,100.000000,110.000000,80.000000,90.000000,89.000000,100000.000000\r\n" +
	     "2001-12-26,105.000000,115.000000,85.000000,95.000000,94.000000,150000.000000\r\n");

    let csv2: string = yahooWriter2.asYahooCsvFile();
    expect(csv2).toBe("Date,Open,High,Low,Close,Adj Close,Volume\r\n" +
	     "2001-12-25,10.000000,11.000000,8.000000,9.000000,8.900000,600.000000\r\n" +
	     "2001-12-26,20.000000,21.000000,18.000000,19.000000,18.000000,300.000000\r\n");
  });

  it('Can cycle convert historical Yahoo CSV file', () =>{
    let yahooWriter: YahooWriter = new YahooWriter("SP500", historicalQuotes);
    let csv: string = yahooWriter.asYahooCsvFile();
    let yahooReader: YahooReader = new YahooReader("SP500", csv);
    let cycledHistoricalQuotes: HistoricalQuotes = yahooReader.asHistoricalQuotes();

    expect(cycledHistoricalQuotes.asIStock()).toEqual(
      jasmine.arrayWithExactContents([
        new IInstantQuotes({
          instant: new Date(2001, 12 - 1, 25),
          quotes: [
            new Quote({name: "SP500",  open: 100, close: 90, high: 110, low: 80, adjustedClose: 89, volume: 100000}),
          ]
        }),
        new IInstantQuotes({
          instant: new Date(2001, 12 - 1, 26),
          quotes: [
            new Quote({name: "SP500",  open: 105, close: 95, high: 115, low: 85, adjustedClose: 94, volume: 150000}),
          ]
        })
      ]));
  });

  it('Can convert historical quotes with missing data into Yahoo CSV file', () => {
    let incompleteQuotes: HistoricalQuotes = new HistoricalQuotes([
      new IInstantQuotes({
        instant: new Date(2001, 12 - 1, 25),
        quotes: [
          new Quote({name: "SP500",  close: 90})
        ]
      }),
      new IInstantQuotes({
        instant: new Date(2001, 12 - 1, 26),
        quotes: [
          new Quote({name: "SP500",  close: 95})
        ]
      }),
    ]);

    let yahooWriter: YahooWriter = new YahooWriter("SP500", incompleteQuotes);

    let csv1: string = yahooWriter.asYahooCsvFile();
    expect(csv1).toBe("Date,Open,High,Low,Close,Adj Close,Volume\r\n" +
       "2001-12-25,90.000000,90.000000,90.000000,90.000000,90.000000,0.000000\r\n" +
       "2001-12-26,95.000000,95.000000,95.000000,95.000000,95.000000,0.000000\r\n");
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
              adjustedClose: 9865.290039,
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
              adjustedClose: 9251.290039,
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
              adjustedClose: 2603.197266,
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
              adjustedClose: 9547.490234,
              volume: 9644600,
              spread: 0,
              dividend: 0
            })]})
      ]));
  });
});
