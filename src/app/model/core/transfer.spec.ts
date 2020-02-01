import { Account } from './account';
import { RegularTransfer, RegularPeriod } from './transfer';

describe('RegularTransfer', () => {
  it('Can create a new instance', () => {
    let regularTransfer = new RegularTransfer({
      transfer: 1000,
      every: RegularPeriod.MONTH,
      to: new Account()
    });
    expect(regularTransfer).toBeTruthy();
  });
  let middleOfDecember: Date = new Date(1999, 11, 15);
  let firstOfJanuary: Date   = new Date(2000,  0,  1);
  let middleOfJanuary: Date  = new Date(2000,  0, 15);
  let firstOfFebruary: Date  = new Date(2000,  1,  1);

  it('Can detect the day to do the monthly regularTransfer', () => {
    let regularTransfer = new RegularTransfer({
      transfer: 1000,
      every: RegularPeriod.MONTH,
      to: new Account()
    });
    expect(regularTransfer.amount(middleOfDecember)).toBe(   0);
    expect(regularTransfer.amount(firstOfJanuary))  .toBe(1000);
    expect(regularTransfer.amount(middleOfJanuary)) .toBe(   0);
    expect(regularTransfer.amount(firstOfFebruary)) .toBe(1000);
  });

  it('Can detect the day to do the yearly regularTransfer', () => {
    let regularTransfer = new RegularTransfer({
      transfer: 1000,
      every: RegularPeriod.YEAR,
      to: new Account()
    });
    expect(regularTransfer.amount(middleOfDecember)).toBe(   0);
    expect(regularTransfer.amount(firstOfJanuary))  .toBe(1000);
    expect(regularTransfer.amount(middleOfJanuary)) .toBe(   0);
    expect(regularTransfer.amount(firstOfFebruary)) .toBe(   0);
  });

  it('Can detect that it missed the due day of transfer', () => {
    let regularTransfer = new RegularTransfer({
      transfer: 1000,
      every: RegularPeriod.MONTH,
      to: new Account()
    });
    expect(regularTransfer.amount(middleOfDecember)).toBe(   0);
    expect(regularTransfer.amount(middleOfJanuary)) .toBe(1000);
  });
});
