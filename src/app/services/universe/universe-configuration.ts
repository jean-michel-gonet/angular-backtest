
/**
 * Describes from when to when a particular security belongs to a Universe.
 */
export class NamedUniverseEntryPeriod {
  /**
   * The security belongs to a universe from this day, including it.
   * When left undefined, then the security started belonging to the universe
   * in the distant past.
   */
  from?: Date;
  /**
   * The security belongs to a universe unitl this day, including it.
   * When left undefined, then the security belongs to the universe forever.
   */
  to?: Date;
}

/**
 * Describes one security belonging to a Universe.
 */
export class NamedUniverseEntry {

  /** The security ticker, or symbol.*/
  name: string;

  /** The GICS sector.*/
  gicsSector?: string;

  /** The GICS sub-industry name.*/
  gicsSubIndustry?:string;

  /** The unabreviated name of the sercurity.*/
  longName?: string;

  /** Foundation year.*/
  founded?: number;

  /** The list of date intervals the security belongs to the universe.*/
  periods: NamedUniverseEntryPeriod[];
}

/**
 * Describes one universe.
 */
export class NamedUniverse {
  /** The name of the universe.*/
  name: string;

  /** The list of securities that belong to this universe.*/
  entries: NamedUniverseEntry[];
}
