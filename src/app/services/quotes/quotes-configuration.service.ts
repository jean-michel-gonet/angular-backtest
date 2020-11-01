import { Injectable } from '@angular/core';
import { NamedQuoteSource } from './quote-configuration';
import { QUOTE_SOURCES } from 'src/assets/quotes/configuration';

/**
* Imports the configuration file where all securities data are registered.
*/

export interface IQuotesConfigurationService {
  obtainNamedQuoteSource(name: string): NamedQuoteSource;
}

/**
 * Service to access the content of the quotes configuration file.
 */
 @Injectable({
   providedIn: 'root'
 })
export class QuotesConfigurationService {

  private namedQuoteSources: NamedQuoteSource[];

  constructor() {
    this.namedQuoteSources = QUOTE_SOURCES;
  }

  /**
   * To obtain the configuration for the specified instrument name.
   * @param {string} name The name of the instrument.
   * @return The configuration of the instrument's source of data.
   */
  obtainNamedQuoteSource(name: string): NamedQuoteSource {
    return this.namedQuoteSources.find(namedQuoteSource => {
      return namedQuoteSource.name == name;
    });
  }
}
