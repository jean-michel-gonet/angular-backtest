import { TestBed } from '@angular/core/testing';

import { YahooConnectionService, YahooConverter } from './yahoo-connection.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { StockData, IStock } from 'src/app/model/core/stock';
import { HttpRequest } from '@angular/common/http';
import { AssetOfInterest } from 'src/app/model/core/asset';


var yahooResponse = "Date,Open,High,Low,Close,Adj Close,Volume\r\n" +
"1993-02-15,9834.599609,9913.400391,9764.099609,9865.299805,9865.290039,10256100\r\n" +
"1993-02-16,null,null,null,null,null,null\r\n" +
"1993-03-19,9393.299805,9393.299805,9243.000000,9251.299805,9251.290039,6878000\r\n" +
"1993-03-22,null,null,null,null,null,null\r\n" +
"1993-04-06,2612.300049,2612.300049,2599.300049,2603.199951,2603.197266,0\r\n" +
"1993-04-20,9798.000000,9856.099609,9535.299805,9547.500000,9547.490234,9644600\r\n" +

describe('YahooConnectionService', () => {
  let service: YahooConnectionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.get(YahooConnectionService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('Can return Stock Data from Yahoo', () => {
      service.get("XX").subscribe((data: StockData) => {
        expect(data).toBeTruthy();
      });

      const req = httpMock.expectOne((request:HttpRequest<any>) => {
        expect(request.method).toBe('GET');
        expect(request.url).toContain("XX");
        return true
      });

      req.flush(yahooResponse);

      httpMock.verify();
  });
});

describe('YahooConverter', () => {
  it('Can convert responses from Yahoo into StockData', () => {
    let yahooConverter: YahooConverter = new YahooConverter(yahooResponse);
    let xx: StockData = yahooConverter.asStockData();
    let iStock: IStock[] = xx.asIStock();
    expect(iStock).toEqual(
      jasmine.arrayWithExactContents([
        new IStock({
          time: new Date(2016, 7, 21),
          assetsOfInterest: [
            new AssetOfInterest({
              isin: "LU1290894820",
              name: "LU1290894820",
              partValue: 109.39,
              spread: 0,
              dividend: 0
            })
          ]
        })
      ]));
  });
});
