import { Injectable } from '@angular/core';
import { UNIVERSE_DEFINITIONS } from 'src/assets/universe/configuration';
import { NamedUniverse } from './universe-configuration';

export interface IUniverseConfigurationService {
  /**
   * To obtain the description of the specified investment universe.
   * @param {string} name The name of the universe.
   * @return The description of the requested universe.
   */
  obtainNamedUniverse(name: string): NamedUniverse;
}

/**
 * Service to access the content of the universe configuration file.
 */
 @Injectable({
   providedIn: 'root'
 })
export class UniverseConfigurationService implements IUniverseConfigurationService {

  private namedUniverses: NamedUniverse[];

  constructor() {
    this.namedUniverses = UNIVERSE_DEFINITIONS;
  }

  /**
   * To obtain the description of the specified investment universe.
   * @param {string} name The name of the universe.
   * @return The description of the requested universe.
   */
  obtainNamedUniverse(name: string): NamedUniverse {
    return this.namedUniverses.find(namedUniverse => {
      return namedUniverse.name == name;
    });
  }
}
