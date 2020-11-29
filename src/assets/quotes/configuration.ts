import {
  NamedQuoteSource,
  QuoteProvider,
  ExchangeRateOperation } from '../../app/services/quotes/quote-configuration';

export const QUOTE_SOURCES: NamedQuoteSource[] = [
  {
    name: "SMI",
    quote: {
      provider: QuoteProvider.SIX,
      uri: "indexes/smi-six.json"
    }
  },
  {
    name: "IBEX35",
    quote: {
      provider: QuoteProvider.INVESTING,
      uri: "indexes/ibex35-investing.csv"
    }
  },
  {
    name: "SP500",
    quote: {
      provider: QuoteProvider.YAHOO,
      uri: "indexes/sp500-yahoo.csv"
    }
  },
  {
    name: "USDCHF",
    quote: {
      provider: QuoteProvider.INVESTING,
      uri: "forex/usd-chf-investing.csv"
    }
  },
  {
    name: "ACWX",
    quote: {
      provider: QuoteProvider.YAHOO,
      uri: "instruments/acwx-yahoo.csv"
    }
  },
  {
    name: "ACWXCHFTR",
    quote: {
      provider: QuoteProvider.YAHOO,
      uri: "instruments/acwx-yahoo.csv"
    },
    exchangeRate: {
      quote: {
        provider: QuoteProvider.INVESTING,
        uri: "forex/usd-chf-investing.csv"
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
      provider: QuoteProvider.INVESTING,
      uri: "instruments/spy-investing.csv"
    }
  },
  {
    name: "SPYCHF",
    quote: {
      provider: QuoteProvider.INVESTING,
      uri: "instruments/spy-investing.csv"
    },
    exchangeRate: {
      quote: {
        provider: QuoteProvider.INVESTING,
        uri: "forex/usd-chf-investing.csv"
      },
      operation: ExchangeRateOperation.MULTIPLY
    }
  },
  {
    name: "AGG",
    quote: {
      provider: QuoteProvider.YAHOO,
      uri: "instruments/agg-yahoo.csv"
    },
    dividends: {
      level1TaxWitholding: 0,
      directDividends: {
        format: "date.value.csv",
        uri: "instruments/agg-dividends.csv"
      }
    }
  }
];
