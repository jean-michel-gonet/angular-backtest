export enum PeriodLength {
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  SEMIMONTHLY = 'SEMIMONTHLY',
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY'
}

/**
 * Utility class to detect changes of periods.
 * @class{Period}
 */
export class Period {
  private static readonly MONDAY_1970: number = Date.UTC(1970, 0, 5);

  private lastPeriodNumber: number;

  public constructor(private periodLength: PeriodLength) {}

  public changeOfPeriod(instant: Date): boolean {

    // Obtain the period number:
    let periodNumber: number = this.periodNumber(instant);

    // Compare to last period number:
    let periodChanged: boolean;
    if (this.lastPeriodNumber) {
      periodChanged = periodNumber != this.lastPeriodNumber;
    } else {
      periodChanged = true;
    }

    // Remember this period number:
    this.lastPeriodNumber = periodNumber;

    // Is this a change of period:
    return periodChanged;
  }

  private periodNumber(instant: Date): number {
    switch(this.periodLength) {
      case PeriodLength.DAILY:
        return Math.floor(instant.valueOf() / 86400000);

      case PeriodLength.WEEKLY:
        return this.weekNumber(instant);

      case PeriodLength.SEMIMONTHLY:
        return this.semiMonthNumber(instant);

      case PeriodLength.MONTHLY:
        return this.monthNumber(instant);

      case PeriodLength.YEARLY:
        return instant.getFullYear();
    }
  }

  /* For a given date, get the ISO week number.
   * The week number can be described by counting the Thursdays: week 12
   * contains the 12th Thursday of the year.
   * https://en.wikipedia.org/wiki/ISO_8601#Week_dates
   * https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
   */
  private weekNumber(instant: Date): number {
    let x = Date.UTC(instant.getFullYear(), instant.getMonth(), instant.getDate());
    let numberOfDays: number = (x - Period.MONDAY_1970) / 86400000;
    let numberOfWeeks = numberOfDays / 7;
    return Math.floor(numberOfWeeks);
  }

  private semiMonthNumber(instant: Date): number {
    let semiMonthNumber = instant.getMonth() * 2;
    if (instant.getDate() >= 15) {
      semiMonthNumber ++;
    }
    semiMonthNumber += instant.getFullYear() * 24;
    return semiMonthNumber;
  }

  private monthNumber(instant: Date): number {
    let monthNumber = instant.getMonth();
    monthNumber += instant.getFullYear() * 12;
    return monthNumber;
  }
}
