import { Account } from './account';

export enum ExtractionPeriod {
  MONTH,
  YEAR
}

interface IExtraction {
  extract: number;
  every: ExtractionPeriod;
  to: Account;
}

/**
 * Describes an extraction.
 * @class {Extraction}
 */
export class Extraction {
  private extract: number;
  private every: ExtractionPeriod;
  private to: Account;

  constructor(obj = {} as IExtraction) {
    let {
      extract = 0,
      every = ExtractionPeriod.MONTH,
      to = new Account()
    } = obj;
    this.extract = extract;
    this.every = every;
    this.to = to;
  }

  public account(): Account {
    return this.to;
  }

  public amount(time: Date): number {
    switch(this.every) {
      case ExtractionPeriod.MONTH:
        if (time.getDate() == 1) {
          return this.extract;
        }
        break;
      case ExtractionPeriod.YEAR:
        if (time.getMonth() == 1 && time.getDate() == 1) {
          return this.extract;
        }
        break;
    }
    return 0;
  }
}
