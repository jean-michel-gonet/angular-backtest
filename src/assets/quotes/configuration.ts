import {
  NamedQuoteSource,
  QuoteProvider,
  ExchangeRateOperation } from '../../app/services/quotes/quote-configuration';

export const QUOTE_SOURCES: NamedQuoteSource[] = [
  {
    name: "SPITR",
    longName: "Swiss Performance Index (SPI)",
    quote: {
      local: {
        format: QuoteProvider.SIX,
        fileName: "indexes/spi-tr-chf-six.json"
      }
    }
  },
  {
    name: "XAUCHF",
    longName: "Gold Spot CHF",
    quote: {
      local: {
        format: QuoteProvider.INVESTING,
        fileName: "forex/xau-usd-investing.csv"
      }
    },
    exchangeRate: {
      quote: {
        local: {
          format: QuoteProvider.INVESTING,
          fileName: "forex/usd-chf-investing.csv"
        }
      },
      operation: ExchangeRateOperation.MULTIPLY
    },
  },
  {
    name: "BCOMCHF",
    longName: "Bloomberg Commodity (CHF)",
    quote: {
      local: {
        format: QuoteProvider.INVESTING,
        fileName: "indexes/bcom-usd-investing.csv"
      }
    },
    exchangeRate: {
      quote: {
        local: {
          format: QuoteProvider.INVESTING,
          fileName: "forex/usd-chf-investing.csv"
        }
      },
      operation: ExchangeRateOperation.MULTIPLY
    },
  },
  {
    name: "SPICHA",
    longName: "UBS ETF (CH) SPI (CHF) A-dis",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/spicha-yahoo.csv"
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
  },
  {
    name: "SMI",
    quote: {
      local: {
        format: QuoteProvider.SIX,
        fileName: "indexes/smi-six.json"
      }
    }
  },
  {
    name: "IBEX35",
    quote: {
      local: {
        format: QuoteProvider.INVESTING,
        fileName: "indexes/ibex35-investing.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "^IBEX"
      }
    }
  },
  {
    name: "SP500",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "indexes/sp500-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "^GSPC"
      }
    }
  },
  {
    name: "USDCHF",
    quote: {
      local: {
        format: QuoteProvider.INVESTING,
        fileName: "forex/usd-chf-investing.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "CHF=X"
      }
    }
  },
  {
    name: "ACWX",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/acwx-yahoo.csv"
      }
    }
  },
  {
    name: "ACWXCHFTR",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/acwx-yahoo.csv"
      }
    },
    exchangeRate: {
      quote: {
        local: {
          format: QuoteProvider.INVESTING,
          fileName: "forex/usd-chf-investing.csv"
        }
      },
      operation: ExchangeRateOperation.MULTIPLY
    },
    dividends: {
      level1TaxWitholding: 0,
      directDividends: {
        format: "date.value.csv",
        uri: "instruments/acwx-dividends.csv"
      }
    }
  },
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
    name: "SPYCHF",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/spy-yahoo.csv"
      },
    },
    exchangeRate: {
      quote: {
        local: {
          format: QuoteProvider.INVESTING,
          fileName: "forex/usd-chf-investing.csv"
        }
      },
      operation: ExchangeRateOperation.MULTIPLY
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
    name: "AGGCHF",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "instruments/agg-yahoo.csv"
      }
    },
    exchangeRate: {
      quote: {
        local: {
          format: QuoteProvider.INVESTING,
          fileName: "forex/usd-chf-investing.csv"
        }
      },
      operation: ExchangeRateOperation.MULTIPLY
    }
  }
];
