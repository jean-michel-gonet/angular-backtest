import { QuotesFromInvestingService, InvestingReader, InvestingWriter } from "./quotes-from-investing.service";
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HistoricalQuotes, IInstantQuotes, Quote } from 'src/app/model/core/quotes';
import { HttpRequest } from '@angular/common/http';

var investingResponse =
`"Date","Price","Open","High","Low","Vol.","Change %"
"Apr 09, 2020","7,278.20","7,277.58","7,281.20","7,275.47","190.28M","1.52%"
"Apr 06, 2020","7,264.86","7,257.84","7,267.00","7,248.17","184.52M","6.72%"
"Mar 28, 2020","7,253.42","7,253.42","7,253.42","7,253.42","-","0.00%"
"Mar 27, 2020","7,253.42","7,253.27","7,260.81","7,251.05","220.44M","-2.98%"
`;

describe('QuotesFromInvestingService', () => {
  let service: QuotesFromInvestingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(QuotesFromInvestingService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('Can return InstantQuotes Data from Investing', () => {
    service.getHistoricalQuotes("SOURCE", "NAME").subscribe((data: HistoricalQuotes) => {
      expect(data).toBeTruthy();
    });

    const req = httpMock.expectOne((request: HttpRequest<any>) => {
      expect(request.method).toBe('GET');
      expect(request.url).toContain('SOURCE');
      return true;
    });

    req.flush(investingResponse)

    httpMock.verify();
  });
});

describe('InvestingWriter', () => {
  let historicalQuotes: HistoricalQuotes = new HistoricalQuotes([
    new IInstantQuotes({
      instant: new Date(2001, 12 - 1, 25),
      quotes: [
        new Quote({name: "SP500",  open: 10000.23, close: 9000.25, high: 11000.26, low: 8000.27, volume: 100000.28}),
        new Quote({name: "FTSE100", open:  10.24, close:  9.25, high:  11.26, low:  8.27, volume: 600.28})
      ]
    }),
    new IInstantQuotes({
      instant: new Date(2001, 12 - 1, 26),
      quotes: [
        new Quote({name: "SP500",  open: 10500, close: 9500, high: 11500, low: 8500, volume: 150000}),
        new Quote({name: "FTSE100", open:  20, close: 19, high:  21, low: 18, volume:    300})
      ]
    }),
  ]);

  it('Can convert historical quotes into Investing CSV file', () => {
    let investingWriter1: InvestingWriter = new InvestingWriter("SP500", historicalQuotes);
    let investingWriter2: InvestingWriter = new InvestingWriter("FTSE100", historicalQuotes);

    let csv1: string = investingWriter1.asInvestingCsvFile();
    expect(csv1).toBe(`"Date","Price","Open","High","Low","Vol.","Change %"\r\n` +
	     `"Dec 25, 2001","9,000.25","10,000.23","11,000.26","8,000.27","100,000.28","-10%"\r\n` +
	     `"Dec 26, 2001","9,500","10,500","11,500","8,500","150,000","-9.52%"\r\n`);

    let csv2: string = investingWriter2.asInvestingCsvFile();
    expect(csv2).toBe(`"Date","Price","Open","High","Low","Vol.","Change %"\r\n` +
	     `"Dec 25, 2001","9.25","10.24","11.26","8.27","600.28","-9.67%"\r\n` +
	     `"Dec 26, 2001","19","20","21","18","300","-5%"\r\n`);
  });

  it('Can cycle convert historical Investing CSV file', () =>{
    let investingWriter: InvestingWriter = new InvestingWriter("SP500", historicalQuotes);
    let csv: string = investingWriter.asInvestingCsvFile();
    let yahooReader: InvestingReader = new InvestingReader("SP500", csv);
    let cycledHistoricalQuotes: HistoricalQuotes = yahooReader.asHistoricalQuotes();

    expect(cycledHistoricalQuotes.asIStock()).toEqual(
      jasmine.arrayWithExactContents([
        new IInstantQuotes({
          instant: new Date(2001, 12 - 1, 25),
          quotes: [
            new Quote({name: "SP500",  open: 10000.23, close: 9000.25, high: 11000.26, low: 8000.27, volume: 100000.28}),

          ]
        }),
        new IInstantQuotes({
          instant: new Date(2001, 12 - 1, 26),
          quotes: [
            new Quote({name: "SP500",  open: 10500, close: 9500, high: 11500, low: 8500, volume: 150000}),
          ]
        })
      ]));
  });

  it('Can convert historical quotes with missing data into Investing CSV file', () => {
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

    let investingWriter: InvestingWriter = new InvestingWriter("SP500", incompleteQuotes);

    let csv1: string = investingWriter.asInvestingCsvFile();
    expect(csv1).toBe(`"Date","Price","Open","High","Low","Vol.","Change %"\r\n` +
	     `"Dec 25, 2001","90","90","90","90","0","0%"\r\n` +
	     `"Dec 26, 2001","95","95","95","95","0","0%"\r\n`);
  });
});


describe('InvestingReader', () => {
  it('Can convert files downloaded from Investing.com', () => {
    let investingReader: InvestingReader = new InvestingReader("ISIN1", investingResponse);
    let xx: HistoricalQuotes = investingReader.asHistoricalQuotes();
    let iStock: IInstantQuotes[] = xx.asIStock();
    expect(iStock).toEqual(
      jasmine.arrayWithExactContents([
        new IInstantQuotes({
          instant: new Date(2020, 3 - 1, 27),
          quotes: [
            new Quote({
              name: "ISIN1",
              close: 7253.42,
              open: 7253.27,
              high: 7260.81,
              low: 7251.05,
              volume: 220440000,
              spread: 0,
              dividend: 0
            })]}),
        new IInstantQuotes({
          instant: new Date(2020, 3 - 1, 28),
          quotes: [
            new Quote({
              name: "ISIN1",
              close: 7253.42,
              open: 7253.42,
              high: 7253.42,
              low: 7253.42,
              volume: undefined,
              alert: "Circuit Breaker",
              spread: 0,
              dividend: 0
            })]}),
        new IInstantQuotes({
          instant: new Date(2020, 4 - 1, 6),
          quotes: [
            new Quote({
              name: "ISIN1",
              close: 7264.86,
              open: 7257.84,
              high: 7267.00,
              low: 7248.17,
              volume: 184520000,
              spread: 0,
              dividend: 0
            })]}),
        new IInstantQuotes({
          instant: new Date(2020, 4 - 1, 9),
          quotes: [
            new Quote({
              name: "ISIN1",
              close: 7278.20,
              open: 7277.58,
              high: 7281.20,
              low: 7275.47,
              volume: 190280000,
              spread: 0,
              dividend: 0
            })]})
      ]));
  });
});
