const MILLISECONDS_IN_A_YEAR: number = 1000 * 24 * 60 * 60 * 365;

/**
 * Utility class to trasform successive dates into
 * a number of years.
 * Useful when calculating year performance in linear regressions.
 * @class{DayToYearConversion}
 */
export class DayToYearConversion {

  private year0: Date;

  /**
   * Converts the specified value into a float number of years (if using
   * a date), or returns it directly.
   * If the provided value is a date, then the return value will be a
   * number of years, counting from the date specified in the first call.
   * If the value is a number, then the method returns directly the value,
   * without any conversion.
   * @param {number | Date} The value to convert.
   * @return {number} Either the number of years, relative to the first
   * provided date, or the provided numberical value.
   */
  public convert(value: number | Date): number {
    let x: number;
    if (value instanceof Date) {
      if (this.year0 == undefined) {
        this.year0 = new Date(value);
      }
      x = value.valueOf() - this.year0.valueOf();
      x /= MILLISECONDS_IN_A_YEAR;
    } else {
      x = value;
    }
    return x;
  }
}
