import { Period, Periodicity } from "./period";

describe('Period', () => {
  it('Can detect a week', () => {
    let period: Period = new Period(Periodicity.WEEKLY);
    expect(period.changeOfPeriod(new Date(2020, 1,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2020, 1,  2))).toBe(false);
    expect(period.changeOfPeriod(new Date(2020, 1,  3))).toBe(true);
    expect(period.changeOfPeriod(new Date(2020, 1,  4))).toBe(false);
    expect(period.changeOfPeriod(new Date(2020, 1, 10))).toBe(true);
    expect(period.changeOfPeriod(new Date(2020, 1, 17))).toBe(true);
    expect(period.changeOfPeriod(new Date(2020, 1, 24))).toBe(true);
  });

  it('Can detect a sumer week', () => {
    let period: Period = new Period(Periodicity.WEEKLY);
    expect(period.changeOfPeriod(new Date(2019, 5,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 5,  2))).toBe(false);
    expect(period.changeOfPeriod(new Date(2019, 5,  3))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 5,  4))).toBe(false);
    expect(period.changeOfPeriod(new Date(2019, 5, 10))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 5, 17))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 5, 24))).toBe(true);
  });

  it('Can detect a semi-month', () => {
    let period: Period = new Period(Periodicity.SEMIMONTHLY);
    expect(period.changeOfPeriod(new Date(2019, 5,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 5,  2))).toBe(false);
    expect(period.changeOfPeriod(new Date(2019, 5,  3))).toBe(false);
    expect(period.changeOfPeriod(new Date(2019, 5, 14))).toBe(false);
    expect(period.changeOfPeriod(new Date(2019, 5, 15))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 5, 16))).toBe(false);
    expect(period.changeOfPeriod(new Date(2019, 6,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 7,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 8,  1))).toBe(true);
  });

  it('Can detect a month', () => {
    let period: Period = new Period(Periodicity.MONTHLY);
    expect(period.changeOfPeriod(new Date(2001, 0,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2001, 0, 15))).toBe(false);
    expect(period.changeOfPeriod(new Date(2001, 0, 31))).toBe(false);
    expect(period.changeOfPeriod(new Date(2001, 1,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2001, 2,  1))).toBe(true);
  });

  it('Can detect a year', () => {
    let period: Period = new Period(Periodicity.YEARLY);
    expect(period.changeOfPeriod(new Date(2001,  0,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2001,  0, 15))).toBe(false);
    expect(period.changeOfPeriod(new Date(2001, 11, 31))).toBe(false);
    expect(period.changeOfPeriod(new Date(2002,  0,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2002,  1,  1))).toBe(false);
  });

  it('Can detect every Wednesday of the week', () => {
    let period: Period = new Period(Periodicity.WEEKLY, 3);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  2))).withContext(" 2 August (first)").toBe(true);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  3))).withContext(" 3 August (Tue.)").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  4))).withContext(" 4 August (Wed.)").toBe(true);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  5))).withContext(" 5 August (Thu.)").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  6))).withContext(" 6 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  7))).withContext(" 7 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  8))).withContext(" 8 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  9))).withContext(" 9 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 10))).withContext("10 August (Tue.)").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 11))).withContext("11 August (Wed.)").toBe(true);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 12))).withContext("12 August").toBe(false);
  });

  it('Can detect every other Wednesday of the week', () => {
    let period: Period = new Period(Periodicity.WEEKLY, 3, 2);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  2))).withContext(" 2 August (first)").toBe(true);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  3))).withContext(" 3 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  4))).withContext(" 4 August (Wed.)").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  5))).withContext(" 5 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  6))).withContext(" 6 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  7))).withContext(" 7 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  8))).withContext(" 8 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1,  9))).withContext(" 9 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 10))).withContext("10 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 11))).withContext("11 August (Wed.)").toBe(true);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 12))).withContext("12 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 13))).withContext("13 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 14))).withContext("14 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 15))).withContext("15 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 16))).withContext("16 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 17))).withContext("17 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 18))).withContext("18 August (Wed.)").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 19))).withContext("19 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 20))).withContext("20 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 21))).withContext("21 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 23))).withContext("23 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 24))).withContext("24 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 25))).withContext("25 August (Wed.)").toBe(true);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 26))).withContext("26 August").toBe(false);
    expect(period.changeOfPeriod(new Date(2021, 8 - 1, 27))).withContext("27 August").toBe(false);
  });

  it('Can wait for 25 days', () => {
    let period: Period = new Period(Periodicity.DAILY);
    expect(period.timeIsUp(new Date(2020, 10 - 1,  1), 25)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 10 - 1, 12), 25)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 10 - 1, 18), 25)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 11 - 1, 25), 25)).toBe(true);
  });

  it('Can wait for 3 weeks', () => {
    let period: Period = new Period(Periodicity.WEEKLY);
    expect(period.timeIsUp(new Date(2020, 10 - 1,  1), 3)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 10 - 1, 18), 3)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 11 - 1, 19), 3)).toBe(true);
  });

  it('Can wait for 4 semi-months', () => {
    let period: Period = new Period(Periodicity.SEMIMONTHLY);
    expect(period.timeIsUp(new Date(2020, 1 - 1,  1), 4)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 1 - 1, 15), 4)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 2 - 1,  1), 4)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 2 - 1, 15), 4)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 3 - 1,  1), 4)).toBe(true);
  });

  it('Can wait for 3 months', () => {
    let period: Period = new Period(Periodicity.MONTHLY);
    expect(period.timeIsUp(new Date(2020, 1 - 1, 15), 3)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 2 - 1,  1), 3)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 3 - 1,  1), 3)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 4 - 1,  1), 3)).toBe(true);
  });

  it('Can wait for 2 years', () => {
    let period: Period = new Period(Periodicity.YEARLY);
    expect(period.timeIsUp(new Date(2020, 1 - 1, 15), 2)).toBe(false);
    expect(period.timeIsUp(new Date(2020, 2 - 1,  1), 2)).toBe(false);
    expect(period.timeIsUp(new Date(2021, 3 - 1,  1), 2)).toBe(false);
    expect(period.timeIsUp(new Date(2022, 1 - 1,  1), 2)).toBe(true);
  });
});
