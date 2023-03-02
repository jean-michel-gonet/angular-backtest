import {
  NamedQuoteSource,
  QuoteProvider} from '../../app/services/quotes/quote-configuration';

/**
 * Describes funds and available investing instruments in source currency.
 */
export const INSTRUMENT_SOURCES: NamedQuoteSource[] = [
  {
    name: "SPY",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/spy-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "SPY"
      }
    }
  },
  {
    name: "AGG",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/agg-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "AGG"
      }
    }
  },
  {
    name: "SPICHA",
    longName: "UBS ETF (CH) SPI (CHF) A-dis",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/spicha-chf-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "SPICHA.SW"
      }
    },
    dividends: {
      level1TaxWitholding: 0,
      directDividends: {
        format: "date.value.csv",
        uri: "instruments/spicha-dividends.csv"
      }
    }
  },
  {
    name: "DCCHAS",
    longName: "UBS ETF (IE) Bloomberg Commodity Index SF UCITS ETF (CHF) A-acc",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/dcchas-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "DCCHAS.SW"
      }
    }
  },
  {
    name: "ZGLD",
    longName: "ZKB Gold ETF A (CHF)",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/zgld-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "ZGLD.SW"
      }
    },
  },
  {
    name: "GLD",
    longName: "SPDR Gold Shares (GLD)",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/gld-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "GLD"
      }
    }
  },
  {
    name: "GSG",
    longName: "iShares S&P GSCI Commodity-Indexed Trust (GSG)",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/gsg-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "GSG"
      }
    }
  },
  {
    name: "IEI",
    longName: "iShares 3-7 Year Treasury Bond ETF (IEI)",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/iei-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "IEI"
      }
    }
  },
  {
    name: "TLT",
    longName: "iShares 20+ Year Treasury Bond ETF (TLT)",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/tlt-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "TLT"
      }
    }
  },
  {
    name: "VTI",
    longName: "Vanguard Total Stock Market Index Fund ETF Shares (VTI)",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/vti-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "VTI"
      }
    }
  }
];
