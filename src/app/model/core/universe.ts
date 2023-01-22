/**
 * Defines an investment universe.
 * An investment universe is a collection of investment instruments that some
 * strategy can choose from. The collection of instruments may change with time.
 * Criteria to decide whether an instrument belongs to the universe or not, depends
 * on the specific implementation.
 */
export interface Universe {
  /**
   * Checks if the specified quote will ever belong to this universe.
   * @param name The name of the instrument.
   * @rturn {@code true} if the instrument belongs to the universe at some point in time.
   */
  isRelatedToUniverse(name: string): boolean;

  /**
   * Checks if the specified quote belongs to the universe at the specified
   * instant.
   * @param instant The current date.
   * @param name The name of the instrument.
   * @rturn {@code true} if the instrument belongs to the universe.
   */
  belongsToUniverse(name: string, instant: Date):boolean;

  /**
   * Checks if the specified instrument is worth assessing because it will
   * soon belong to the universe, or it already belongs.
   * Use this method to start assessing moving averages, momentum, etc, before
   * the instrument enters in the universe.
   * @param instant The current date.
   * @param name The name of the instrument.
   * @param assessmentDays The minimal number of days needed to fully assess a quote.
   * @return {boolean} true, if the instrument is worth assessing.
  */
  worthAssessing(name: string, instant: Date, assessmentDays: number):boolean;

  /**
   * Lists all quotes belonging to this universe at the specified date.
   * @param instant The date to check. If not provided, then lists all instruments
   * that will ever belong to this universe.
   * @return The list of instrument names.
   */
  allQuotes(instant?: Date): string[];
}
