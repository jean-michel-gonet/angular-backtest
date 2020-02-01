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

  private lastProcessedTime: Date;

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
    switch(this.every) {
      case RegularPeriod.MONTH:
        if (time.getDate() == 1) {
          return this.transfer;
        }
        break;
      case RegularPeriod.YEAR:
        if (time.getMonth() == 1 && time.getDate() == 1) {
          return this.transfer;
        }
        break;
    }
    return 0;
  }
}
