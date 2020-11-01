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

export enum ExchangeRateOperation {
  DIVIDE = 'divide',
  MULTIPLY = 'multiply'
}

/**
 * Describes a quote source.
 */
export class QuoteSource {
  /**
   * The provider.
   */
  provider: QuoteProvider;

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
 * Describes a source of exchange rate.
 */
export class ExchangeRateSource {
  /**
   * A quote source to retrieve the exchange rate.
   */
  quote: QuoteSource;
  /**
   * Operation to apply.
   * For example: if you have the SPY (which is in USD) and the USD/CHF exchange rate,
   * and you want to obtain a quotation for SPY in CHF, then you have to specify 'divide'.
   * Why: Because USD/CHF means 'buy (or sell) USD using CHF as money'.
   */
  operation: ExchangeRateOperation;
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

  /**
   * The exchange rate to apply.
   */
  exchangeRate?: ExchangeRateSource;
};
