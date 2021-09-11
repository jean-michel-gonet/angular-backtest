import { Injectable } from '@angular/core';
import { UNIVERSE_DEFINITIONS } from 'src/assets/universe/configuration';
import { NamedUniverse } from './universe-configuration';

/**
 * Service to access the content of the universe configuration file.
 */
 @Injectable({
   providedIn: 'root'
 })
export class UniverseConfigurationService {

  private namedUniverses: NamedUniverse[];

  constructor() {
    this.namedUniverses = UNIVERSE_DEFINITIONS;
  }

  /**
   * To obtain the configuration for the specified instrument name.
   * @param {string} name The name of the instrument.
   * @return The configuration of the instrument's source of data.
   */
  obtainNamedUniverse(name: string): NamedUniverse {
    return this.namedUniverses.find(namedUniverse => {
      return namedUniverse.name == name;
    });
  }
}
