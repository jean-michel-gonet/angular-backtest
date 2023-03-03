import {
  NamedQuoteSource,
  QuoteProvider,
  ExchangeRateOperation } from '../../app/services/quotes/quote-configuration';

/**
 * Translates indexes, instruments and forex into CHF when not directly available.
 */
export const CHF_SOURCES: NamedQuoteSource[] = [
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
          format: QuoteProvider.YAHOO,
          fileName: "forex/usd-chf-alva.csv"
        }
      },
      operation: ExchangeRateOperation.MULTIPLY
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
          format: QuoteProvider.YAHOO,
          fileName: "forex/usd-chf-alva.csv"
        }
      },
      operation: ExchangeRateOperation.MULTIPLY
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
          format: QuoteProvider.YAHOO,
          fileName: "forex/usd-chf-alva.csv"
        }
      },
      operation: ExchangeRateOperation.MULTIPLY
    }
  },
  {
    name: "XAUCHF",
    longName: "Gold Spot CHF",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "forex/xau-usd-alva.csv"
      }
    },
    exchangeRate: {
      quote: {
        local: {
          format: QuoteProvider.YAHOO,
          fileName: "forex/usd-chf-alva.csv"
        }
      },
      operation: ExchangeRateOperation.MULTIPLY
    },
  }
];
