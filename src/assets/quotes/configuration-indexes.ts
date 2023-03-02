import {
  NamedQuoteSource,
  QuoteProvider } from '../../app/services/quotes/quote-configuration';

/**
 * Describes where to find information for indexes and benchmarks.
 */
export const INDEX_SOURCES: NamedQuoteSource[] = [
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
    name: "IBEX35",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "indexes/ibex35-eur-yahoo.csv"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "^IBEX"
      }
    }
  },
  {
    name: "SMI",
    longName: "Swiss Market Index",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "indexes/smi-yahoo.json"
      },
      remote: {
        provider: QuoteProvider.YAHOO,
        ticker: "^SSMI"
      }
    }
  },
  {
    name: "BCOM",
    longName: "Bloomberg Commodity Index",
    quote: {
      local: {
        format: QuoteProvider.INVESTING,
        fileName: "indexes/bcom-usd-investing.csv"
      },
      remote: {
        provider: QuoteProvider.MARKETSTACK,
        ticker: "BCOM.INDX"
      }
    }
  }
];
