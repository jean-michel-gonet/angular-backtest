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
  INVESTING = 'www.investing.com',
  MARKETSTACK = 'www.marketstack.com'
};

export enum ExchangeRateOperation {
  DIVIDE = 'divide',
  MULTIPLY = 'multiply'
}

/**
 * Describes a local quote source.
 * Local quote sources are stored in local file sytem,
 * and are described by their file name location and
 * their format.
 * @class{LocalQuoteSource}
 */
export class LocalQuoteSource {
  /**
   * The format.
   */
  format: QuoteProvider;

  /**
   * The file name to access the source.
   * Path and filename to access the data. If the path is relative,
   * then it is relative from this ``quote-configuration.ts`` file.
   */
  fileName: string;
}

/**
 * Describes a remote quote source.
 * Remote quote sources are accessible through a provider. Also, the ticker
 * in the provider's system may not be the same as the name of the quote
 * used in the simulation.
 * @class{RemoteQuoteSource}
 */
export class RemoteQuoteSource {
  /**
   * The download scripts use the provider to deduce the URL and the format
   * to use.
   */
  provider: QuoteProvider;
  /**
   * The ticker is the name of the quote in the provider's system.
   */
  ticker: String;
}

/**
 * Describes a quote source.
 */
export class QuoteSource {
  /**
   * Local quote source.
   * Used for simulations.
   */
  local: LocalQuoteSource;
  /**
   * Remote quote source.
   * Used by scripts to download additional data
   */
  remote?: RemoteQuoteSource;
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
   * The title of the instrument.
   * Like: "SPDR Gold Shares (GLD)".
   * This is only used to make the configuration files easier to read.
   */
  longName?: string;

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
