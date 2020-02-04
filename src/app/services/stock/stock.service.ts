import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { SixConnectionService } from './six-connection.service';
import { YahooConnectionService } from './yahoo-connection.service';
import { StockData } from 'src/app/model/core/stock';

/**
 * Describes the element found in securities-configuration.json.
 * @class{SecurityDescriptor}
 */
export class SecurityDescriptor {
  name: string;
  file: string;
  format: string;
  provider: string;
};

/**
 * Imports the configuration file where all securities data are registered.
 */
import securityDescriptors from '../../../assets/securities/securities-configuration.json';

/**
 * Retrieves stock data from a provider, and then broadcasts the
 * stock updates to all subscribers.
 * @class{StockService}
 */
 @Injectable({
   providedIn: 'root'
 })
export class StockService {
  constructor(private sixConnectionService: SixConnectionService,
              private yahooConnectionService: YahooConnectionService) {
  }

  private obtainDescriptor(name: String): SecurityDescriptor {
    let securityDescriptor: SecurityDescriptor = securityDescriptors.find((securityDescriptor: SecurityDescriptor) => {
      return securityDescriptor.name == name;
    });
    return securityDescriptor;
  }

  private makeItGood(file: string): string {
    return "../../../assets/securities/" + file;
  }

  getStockData(names: string[]): Observable<StockData> {
    let o: Observable<StockData>[] = [];

    names.forEach(name => {
      let descriptor: SecurityDescriptor = this.obtainDescriptor(name);
      let relativePath = this.makeItGood(descriptor.file);

      switch(descriptor.provider) {
        case "www.six-group.com":
          o.push(this.sixConnectionService.getQuotes(relativePath));
          break;
        case "finance.yahoo.com":
        o.push(this.yahooConnectionService.getQuotes(descriptor.name, relativePath));
        break;
      }
    });

    return forkJoin(o)
      .pipe(map(s => {
        let stockData: StockData;
        s.forEach((d: StockData) => {
          if (stockData) {
            stockData.merge(d);
          } else {
            stockData = d;
          }
        });
        return stockData;
      }));
  }
}
