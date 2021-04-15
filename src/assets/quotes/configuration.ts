import { NamedQuoteSource } from '../../app/services/quotes/quote-configuration';
import { BASIC_SOURCES } from './configuration-basic';
import { SP500_SOURCES } from './configuration-sp500';

export const QUOTE_SOURCES: NamedQuoteSource[] = BASIC_SOURCES.concat(SP500_SOURCES);
