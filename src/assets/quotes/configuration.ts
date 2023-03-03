import { NamedQuoteSource } from '../../app/services/quotes/quote-configuration';
import { FOREX_SOURCES } from './configuration-forex';
import { INDEX_SOURCES } from './configuration-indexes';
import { INSTRUMENT_SOURCES } from './configuration-instruments';
import { CHF_SOURCES } from './configuration-quotes-chf';
import { SP500_SOURCES } from './configuration-sp500';

export const BASIC_SOURCES = FOREX_SOURCES
  .concat(INDEX_SOURCES)
  .concat(INSTRUMENT_SOURCES)
  .concat(CHF_SOURCES);

export const ALL_SOURCES: NamedQuoteSource[] = BASIC_SOURCES.concat(SP500_SOURCES);
