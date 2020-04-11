import { QuotesFromInvestingService, InvestingConverter } from "./quotes-from-investing.service";
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HistoricalQuotes, IInstantQuotes, Quote } from 'src/app/model/core/quotes';
import { HttpRequest } from '@angular/common/http';

var investingResponse =
`"Date","Price","Open","High","Low","Vol.","Change %"
"Apr 09, 2020","278.20","277.58","281.20","275.47","190.28M","1.52%"
"Apr 06, 2020","264.86","257.84","267.00","248.17","184.52M","6.72%"
"Mar 28, 2020","253.42","253.42","253.42","253.42","-","0.00%"
"Mar 27, 2020","253.42","253.27","260.81","251.05","220.44M","-2.98%"
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

describe('InvestingConverter', () => {
  it('Can convert files downloaded from Investing.com', () => {
    let investingConverter: InvestingConverter = new InvestingConverter("ISIN1", investingResponse);
    let xx: HistoricalQuotes = investingConverter.asHistoricalQuotes();
    let iStock: IInstantQuotes[] = xx.asIStock();
    expect(iStock).toEqual(
      jasmine.arrayWithExactContents([
        new IInstantQuotes({
          instant: new Date(2020, 3 - 1, 27),
          quotes: [
            new Quote({
              name: "ISIN1",
              close: 253.42,
              open: 253.27,
              high: 260.81,
              low: 251.05,
              volume: 220440000,
              spread: 0,
              dividend: 0
            })]}),
        new IInstantQuotes({
          instant: new Date(2020, 4 - 1, 6),
          quotes: [
            new Quote({
              name: "ISIN1",
              close: 264.86,
              open: 257.84,
              high: 267.00,
              low: 248.17,
              volume: 184520000,
              spread: 0,
              dividend: 0
            })]}),
        new IInstantQuotes({
          instant: new Date(2020, 4 - 1, 9),
          quotes: [
            new Quote({
              name: "ISIN1",
              close: 278.20,
              open: 277.58,
              high: 281.20,
              low: 275.47,
              volume: 190280000,
              spread: 0,
              dividend: 0
            })]})
      ]));
  });
});
