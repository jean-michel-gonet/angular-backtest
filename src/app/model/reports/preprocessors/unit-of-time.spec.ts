import { UnitsOfTime, UnitOfTime } from "./unit-of-time";

describe('UnitsOfTime', () => {
  it('Can calculate 2 years from now', () => {
    let unitsOfTime: UnitsOfTime = new UnitsOfTime(2, UnitOfTime.YEAR);
    let end: Date = unitsOfTime.startingFrom(new Date(1999, 10, 10));
    expect(end).toEqual(new Date(2001, 10, 10));
  });

  it('Can calculate 3 months from now', () => {
    let unitsOfTime: UnitsOfTime = new UnitsOfTime(3, UnitOfTime.MONTH);
    let end: Date = unitsOfTime.startingFrom(new Date(1999, 1, 28));
    expect(end).toEqual(new Date(1999, 4, 28));
  });

  it('Can calculate 16 days from now', () => {
    let unitsOfTime: UnitsOfTime = new UnitsOfTime(16, UnitOfTime.DAY);
    let end: Date = unitsOfTime.startingFrom(new Date(1999, 1, 28));
    expect(end).toEqual(new Date(1999, 2, 16));
  });

});
