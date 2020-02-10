import { Injectable } from '@angular/core';

export class SourceAndProvider {
  source: string;
  provider: string;
}

export class QuoteSourceAndProvider extends SourceAndProvider {
 name: string;
 dividends?: SourceAndProvider;
};

/**
* Imports the configuration file where all securities data are registered.
*/
import securityDescriptors from '../../../assets/quotes/configuration.json';



@Injectable({
  providedIn: 'root'
})
export class SecuritiesConfigurationService {

  constructor() { }

  obtainQuoteSourceAndProvider(name: String): QuoteSourceAndProvider {
    let quoteSourceAndProvider: QuoteSourceAndProvider =
      securityDescriptors.find((securityDescriptor: QuoteSourceAndProvider) => {
        return securityDescriptor.name == name;
      });
    return quoteSourceAndProvider;
  }
}
