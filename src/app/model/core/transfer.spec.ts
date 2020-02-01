import { Account } from './account';
import { RegularTransfer, RegularPeriod } from './transfer';

describe('RegularTransfer', () => {
  it('Can create a new instance', () => {
    let extraction = new RegularTransfer({
      transfer: 1000,
      every: RegularPeriod.MONTH,
      to: new Account()
    });
    expect(extraction).toBeTruthy();
  });
  let firstOfFebruary: Date = new Date(1999, 2, 1);
  let firstOfJanuary: Date = new Date(2000, 1, 1);
  let anyDay: Date = new Date(2000, 23, 5);

  it('Can detect the day to do the monthly extraction', () => {
    let extraction = new RegularTransfer({
      transfer: 1000,
      every: RegularPeriod.MONTH,
      to: new Account()
    });
    expect(extraction.amount(anyDay)).toBe(0);
    expect(extraction.amount(firstOfFebruary)).toBe(1000);
    expect(extraction.amount(firstOfJanuary)).toBe(1000);
  });

  it('Can detect the day to do the yearly extraction', () => {
    let extraction = new RegularTransfer({
      transfer: 1000,
      every: RegularPeriod.YEAR,
      to: new Account()
    });
    expect(extraction.amount(anyDay)).toBe(0);
    expect(extraction.amount(firstOfFebruary)).toBe(0);
    expect(extraction.amount(firstOfJanuary)).toBe(1000);
  });
});
