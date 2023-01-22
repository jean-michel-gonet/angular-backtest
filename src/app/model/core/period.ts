export enum Periodicity {
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
  private firstPeriodNumber: number;
  private lastPeriodNumber: number;

  /**
   * Class constructor.
   * @param periodicity The length of the period.
   * @param day What day in the specified period. Default value is 1.
   * @param skip Skip periods.
   */
  public constructor(public periodicity: Periodicity, public day: number = 1, public skip: number = 1) {}

  /**
   * Indicates whether the specified number of periods has passed since the
   * first call to this method.
   * @param {Date} instant Current instant.
   * @param {number} numberOfPeriods The number of periods to wait.
   * @return {boolean} <pre>true</pre> If the specified number of periods has
   * passed.
   */
  public timeIsUp(instant: Date, numberOfPeriods: number): boolean {
    // Obtain the period number:
    let periodNumber: number = this.periodNumber(instant);
    this.lastPeriodNumber = periodNumber;

    if (this.firstPeriodNumber) {
      if (periodNumber - this.firstPeriodNumber >= numberOfPeriods) {
        return true;
      }
    } else {
      this.firstPeriodNumber = periodNumber;
    }
    return false;
  }

  /**
   * Detects when the provided instant in in a different period,
   * considering the period length and the previously provided instant.
   * When the period length is DAILY,
   * @param {Date} instant The current instant. The method compares it
   * with the previous instant.
   * @return {boolean} If this instant belongs to a different period than
   * the previous. The first call to the method always returns <pre>false</pre>
   * because it is not possible to establish if there is a change of period.
   */
  public changeOfPeriod(instant: Date): boolean {

    // Obtain the period number:
    let periodNumber: number = this.periodNumber(instant);

    // Compare to last period number:
    let periodChanged: boolean;
    if (this.lastPeriodNumber) {
      periodChanged = periodNumber != this.lastPeriodNumber;
    } else {
      periodChanged = true;
      this.firstPeriodNumber = periodNumber;
    }

    // Remember this period number:
    this.lastPeriodNumber = periodNumber;

    // Is this a change of period:
    return periodChanged;
  }

  /**
   * For a given date, return the period number.
   */
  private periodNumber(instant: Date): number {
    switch(this.periodicity) {
      case Periodicity.DAILY:
        return Math.floor(instant.valueOf() / 86400000);

      case Periodicity.WEEKLY:
        return Math.floor(this.weekNumber(instant) / this.skip);

      case Periodicity.SEMIMONTHLY:
        return this.semiMonthNumber(instant);

      case Periodicity.MONTHLY:
        return this.monthNumber(instant);

      case Periodicity.YEARLY:
        return instant.getFullYear();
    }
  }

  /*
   * For a given date, return the ISO week number.
   * The week number can be described by counting the Thursdays: week 12
   * contains the 12th Thursday of the year.
   * https://en.wikipedia.org/wiki/ISO_8601#Week_dates
   * https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
   */
  private weekNumber(instant: Date): number {
    let x = Date.UTC(instant.getFullYear(), instant.getMonth(), instant.getDate());
    let numberOfDays: number = (x - Period.MONDAY_1970) / 86400000;
    let numberOfDaysShifted = numberOfDays - this.day + 1;
    let numberOfWeeks = numberOfDaysShifted / 7;
    return Math.floor(numberOfWeeks);
  }

  /*
   * For a given date, return the number of semi-month since year 0.
   */
  private semiMonthNumber(instant: Date): number {
    let semiMonthNumber = instant.getMonth() * 2;
    if (instant.getDate() >= 15) {
      semiMonthNumber ++;
    }
    semiMonthNumber += instant.getFullYear() * 24;
    return semiMonthNumber;
  }

  /*
   * For a given date, return the number of months since year 0.
   */
  private monthNumber(instant: Date): number {
    let monthNumber = instant.getMonth();
    monthNumber += instant.getFullYear() * 12;
    return monthNumber;
  }
}
