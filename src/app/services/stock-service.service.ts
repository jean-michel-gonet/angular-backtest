import { Injectable } from '@angular/core';
import { Observer, Observable } from 'rxjs';
import { Stock } from '../model/stock';

/**
 * Retrieves stock data from a provider, and then broadcasts the
 * stock updates to all subscribers.
 * @class{StockServiceService}
 */
 @Injectable({
   providedIn: 'root'
 })
export class StockServiceService {

  constructor() {
  }

  get(listOfIsins: String[]): Observable<Stock[]> {
    return null;
  }
}
