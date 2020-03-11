import { Period, PeriodLength } from "./period";

describe('Period', () => {
  it('Can detect a week', () => {
    let period: Period = new Period(PeriodLength.WEEKLY);
    expect(period.changeOfPeriod(new Date(2020, 1,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2020, 1,  2))).toBe(false);
    expect(period.changeOfPeriod(new Date(2020, 1,  3))).toBe(true);
    expect(period.changeOfPeriod(new Date(2020, 1,  4))).toBe(false);
    expect(period.changeOfPeriod(new Date(2020, 1, 10))).toBe(true);
    expect(period.changeOfPeriod(new Date(2020, 1, 17))).toBe(true);
    expect(period.changeOfPeriod(new Date(2020, 1, 24))).toBe(true);
  });

  it('Can detect a sumer week', () => {
    let period: Period = new Period(PeriodLength.WEEKLY);
    expect(period.changeOfPeriod(new Date(2019, 5,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 5,  2))).toBe(false);
    expect(period.changeOfPeriod(new Date(2019, 5,  3))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 5,  4))).toBe(false);
    expect(period.changeOfPeriod(new Date(2019, 5, 10))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 5, 17))).toBe(true);
    expect(period.changeOfPeriod(new Date(2019, 5, 24))).toBe(true);
  });

  it('Can detect a semi-month', () => {
    let period: Period = new Period(PeriodLength.SEMIMONTHLY);
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
    let period: Period = new Period(PeriodLength.MONTHLY);
    expect(period.changeOfPeriod(new Date(2001, 0,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2001, 0, 15))).toBe(false);
    expect(period.changeOfPeriod(new Date(2001, 0, 31))).toBe(false);
    expect(period.changeOfPeriod(new Date(2001, 1,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2001, 2,  1))).toBe(true);
  });

  it('Can detect a year', () => {
    let period: Period = new Period(PeriodLength.YEARLY);
    expect(period.changeOfPeriod(new Date(2001,  0,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2001,  0, 15))).toBe(false);
    expect(period.changeOfPeriod(new Date(2001, 11, 31))).toBe(false);
    expect(period.changeOfPeriod(new Date(2002,  0,  1))).toBe(true);
    expect(period.changeOfPeriod(new Date(2002,  1,  1))).toBe(false);
  });

});
