import { Injectable } from '@angular/core';

/**
 * Enumerates accepted formats for unspecific data sources.
 */
export enum DataFormat {
  DATE_VALUE_CSV = 'date.value.csv'
}

/**
 * Describes an unspecific data source.
 * For example a standard CSV file with Date and Yield columns.
 */
export class DataSource {
  format: string;
  uri: string;
}

/**
 * Enumerates supported quote providers.
 */
export enum QuoteProvider {
  YAHOO = 'finance.yahoo.com',
  SIX = 'www.six-group.com',
  INVESTING = 'www.investing.com'
};

/**
 * Describes a quote source.
 */
export class QuoteSource {
  /**
   * The provider.
   */
  provider: string;

  /**
   * The URI to access the source.
   */
  uri: string;
}

/**
 * Describes a source of dividends.
 */
export class DividendSource {
    /**
     * L1TW is the taxation that applies when companies distribute their
     * dividends to funds (or you, if you hold the shares directly).
     * see https://forum.mustachianpost.com/t/tax-optimisation-for-etf-investing/67
     */
    level1TaxWitholding: number;

    /**
     * If you have a direct source of dividends, specify it here.
     */
    directDividends?: DataSource;

    /**
     * When you don't have a direct source of dividends (often the case with
     * indexes), you can specify the Total Return version of the same index
     * and let the engine calculate the dividends.
     */
    totalReturn?: QuoteSource;
}

/**
 * A named quote source is the one that provides an instrument or an index
 * to invest.
 */
export class NamedQuoteSource {
  /**
   * The ticker or any string that uniquely identifies the instrument.
   */
  name: string;
  /**
   * The source of the data.
   */
  quote: QuoteSource;

  /**
   * The source of the dividends.
   */
  dividends?: DividendSource;
};

/**
* Imports the configuration file where all securities data are registered.
*/
import configuration from '../../../assets/quotes/configuration.json';

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
    this.namedQuoteSources = configuration;
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
