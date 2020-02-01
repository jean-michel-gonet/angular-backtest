import { Account } from './account';

export enum RegularPeriod {
  MONTH,
  YEAR
}

interface IRegularTransfer {
  transfer: number;
  every: RegularPeriod;
  to: Account;
}

/**
 * Describes a regular transfer to a destination account.
 * @class {RegularTransfer}
 */
export class RegularTransfer {
  public transfer: number;
  public every: RegularPeriod;
  public to: Account;

  private lastDay: Date;

  constructor(obj = {} as IRegularTransfer) {
    let {
      transfer = 0,
      every = RegularPeriod.MONTH,
      to = new Account()
    } = obj;
    this.transfer = transfer;
    this.every = every;
    this.to = to;
  }

  public amount(time: Date): number {
    // Remove hours, minutes and seconds from the specified time:
    let today = new Date(time.getFullYear(), time.getMonth(), time.getDate());

    // Is it the first call?
    if (!this.lastDay) {
      this.lastDay = today;
    }

    // Check each day between the last time we checked untin today.
    let totalAmount: number = 0;
    do {
      totalAmount += this.dueAmount(this.lastDay);
      this.lastDay = new Date(this.lastDay.getFullYear(), this.lastDay.getMonth(), this.lastDay.getDate() + 1);
    } while (this.lastDay.valueOf() <= today.valueOf());

    // Return the total amount to transfer:
    return totalAmount;
  }

  private dueAmount(time: Date): number {
    switch(this.every) {
      case RegularPeriod.MONTH:
        if (time.getDate() == 1) {
          return this.transfer;
        }
        break;
      case RegularPeriod.YEAR:
        if (time.getMonth() == 0 && time.getDate() == 1) {
          return this.transfer;
        }
        break;
    }
    return 0;
  }
}
