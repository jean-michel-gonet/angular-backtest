import {
  NamedQuoteSource,
  QuoteProvider } from '../../app/services/quotes/quote-configuration';

export const FOREX_SOURCES: NamedQuoteSource[] = [
  {
    name: "XAUUSD",
    longName: "XAU-USD",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "forex/xau-usd-alva.csv"
      },
      remote: {
        provider: QuoteProvider.ALPHA_VANTAGE,
        ticker: "XAUUSD"
      }
    }
  },
  {
    name: "USDCHF",
    longName: "USD-CHF",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "forex/usd-chf-alva.csv"
      },
      remote: {
        provider: QuoteProvider.ALPHA_VANTAGE,
        ticker: "USDCHF"
      }
    }
  },
  {
    name: "EURCHF",
    longName: "EUR-CHF",
    quote: {
      local: {
        format: QuoteProvider.YAHOO,
        fileName: "forex/eur-chf-alva.csv"
      },
      remote: {
        provider: QuoteProvider.ALPHA_VANTAGE,
        ticker: "EURCHF"
      }
    }
  }
];
