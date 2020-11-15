import { DayToYearConversion } from './day-to-year-conversion';

describe('DayToYearConversion', () => {
  it('Can work in years', () => {
    let c: DayToYearConversion = new DayToYearConversion();
    expect(c.convert(new Date(2001, 0, 1))).toBe(0);
    expect(c.convert(new Date(2001, 6, 3))).toBeCloseTo(0.5, 2);
    expect(c.convert(new Date(2002, 0, 1))).toBe(1);
  });

  it('Can work in numbers', () => {
    let c: DayToYearConversion = new DayToYearConversion();
    expect(c.convert(10)).toBe(10);
    expect(c.convert(20)).toBe(20);
  });
});
