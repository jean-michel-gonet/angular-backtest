import { Injectable } from '@angular/core';
import { Universe } from 'src/app/model/core/universe';
import { BackTestingError } from 'src/app/model/utils/back-testing-error';
import { NamedUniverse, NamedUniverseEntry, NamedUniverseEntryPeriod } from './universe-configuration';
import { UniverseConfigurationService } from './universe-configuration.service';

const MILISECONDS_IN_A_DAY = 86400000;

export class ConfigurableUniverseEntryPeriod {
  public from: number;
  public to: number;

  constructor(period: NamedUniverseEntryPeriod) {
    if (period.from) {
      this.from = MILISECONDS_IN_A_DAY * Math.floor(period.from.getTime() / MILISECONDS_IN_A_DAY);
    }
    if(period.to) {
      this.to = MILISECONDS_IN_A_DAY * (1 + Math.floor(period.to.getTime() / MILISECONDS_IN_A_DAY));
    }
  }

  public contains(instant: number): boolean {
    if (this.from && this.from > instant) {
      return false;
    }
    if (this.to && this.to < instant) {
      return false;
    }
    return true;
  }

  public intersects(from: number, to: number): boolean {
    if (this.from && to < this.from) {
      return false;
    }
    if (this.to && from > this.to) {
      return false;
    }
    return true;
  }
}

/**
 * Implenentation of a universe based on a named universe configuration.
 * @class{ConfigurableUniverseEntry}
 */
export class ConfigurableUniverseEntry {
  public name: string;

  public periods: ConfigurableUniverseEntryPeriod[] = [];

  /**
   * Class constructor.
   * @param universeEntry A universe entry as found in configuration.
   */
  constructor(universeEntry: NamedUniverseEntry) {
    this.name = universeEntry.name;
    universeEntry.periods.forEach(period => {
      this.periods.push(new ConfigurableUniverseEntryPeriod(period));
    });
  }

  belongsToUniverse(instant: number): boolean {
    for(var n = 0; n < this.periods.length; n++) {
      if (this.periods[n].contains(instant)) {
        return true;
      }
    }
    return false;
  }

  worthAssessing(instant: number, assessmentDays: number): boolean {
    let to = instant + assessmentDays * MILISECONDS_IN_A_DAY;
    for(var n = 0; n < this.periods.length; n++) {
      if (this.periods[n].intersects(instant, to)) {
        return true;
      }
    }
    return false;
  }
}

/**
 * Implenentation of a universe based on a named universe configuration.
 * @class{ConfigurableUniverse}
 */
export class ConfigurableUniverse implements Universe {
  public name: string;
  private entries = new Map<string, ConfigurableUniverseEntry>();

  constructor(namedUniverse: NamedUniverse) {
    this.name = namedUniverse.name;
    namedUniverse.entries.forEach(entry => {
      this.entries.set(entry.name, new ConfigurableUniverseEntry(entry));
    });
  }

  belongsToUniverse(name: string, instant: Date): boolean {
    let universeEntry = this.entries.get(name);
    if (universeEntry) {
      return universeEntry.belongsToUniverse(instant.getTime());
    } else {
      return false;
    }
  }

  isRelatedToUniverse(name: string): boolean {
    let universeEntry = this.entries.get(name);
    if (universeEntry) {
      return true;
    }
    return false;
  }

  worthAssessing(name: string, instant: Date, assessmentDays: number): boolean {
    let universeEntry = this.entries.get(name);
    if (universeEntry) {
      return universeEntry.worthAssessing(instant.getTime(), assessmentDays);
    } else {
      return false;
    }
  }

  allQuotes(instant?: Date): string[] {
    let q: string[] = [];
    if (instant) {
      let time = instant.getTime();
      this.entries.forEach(entry => {
        if (entry.belongsToUniverse(time)) {
          q.push(entry.name)
        }
      });
    } else {
      this.entries.forEach(entry => {
        q.push(entry.name)
      });
    }
    return q;
  }
}


export class UniverseServiceError extends BackTestingError  {
  constructor(message: string) {
    super(message);
  }
}

export class UniverseServiceErrorNoUniverseFound extends UniverseServiceError {
  constructor(name: string) {
    super("No universe configured with name " + name);
  }
}

/**
 * Retrieves the requested universe.
 * @class{UniverseService}
 */
 @Injectable({
   providedIn: 'root'
 })
export class UniverseService {
  constructor(private universeConfigurationService: UniverseConfigurationService) {
  }

  public getUniverse(name: string): Universe {
    let namedUniverse = this.universeConfigurationService.obtainNamedUniverse(name);
    if (namedUniverse) {
      return new ConfigurableUniverse(namedUniverse);
    } else {
      throw new UniverseServiceErrorNoUniverseFound(name);
    }
  }
}
