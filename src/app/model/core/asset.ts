/**
 * An quote is a resource with economic value that an individual, corporation
 * or country owns or controls with the expectation that it will provide a
 * future benefit.
 * Assets are reported on a company's balance sheet and are bought or created
 * to increase a firm's value or benefit the firm's operations.
 * See https://www.investopedia.com/terms/a/quote.asp
 * @class{Asset}
 */
export class Asset {
  name: string;
  partValue?: number;

  constructor(obj: Asset = {} as Asset) {
    let {
      name = "",
      partValue = 0
    } = obj;

    this.name = name;
    this.partValue = partValue;
  }
}

/**
 * A quote is the last price at which a security or commodity traded, meaning
 * the most recent price to which a buyer and seller agreed and at which some
 * amount of the quote was transacted.
 * See https://www.investopedia.com/terms/q/quote.asp
 * @class{Quote}
 */
export class Quote extends Asset {
  spread?: number;
  dividend?: number;

  constructor(obj: Quote = {} as Quote) {
    super(obj);
    let {
      spread = 0,
      dividend = 0
    } = obj;

    this.spread = spread;
    this.dividend = dividend;
  }
}

class IPosition extends Asset {
  parts?: number;

  constructor(obj: IPosition = {} as IPosition) {
    super(obj);
    let {
      parts = 0
    } = obj;
    this.parts = parts;
  }
}

/**
 * A position is the amount of a security, commodity or currency which is
 * owned by an individual, dealer, institution, or other fiscal entity.
 * See https://www.investopedia.com/terms/p/position.asp
 * Contains the required information to calculate
 * the NAV.
 */
export class Position extends IPosition {
  constructor(obj: IPosition = {} as IPosition) {
    super(obj);
  }

  /**
   * Returns the net quote value based on the part value and
   * the number of parts.
   */
  nav():number {
    return this.partValue * this.parts;
  }

  /**
   * Updates the part value of this position based on the
   * provided quote.
   * @param {Asset} quote The update.
   */
  update(quote: Asset): void {
      this.partValue = quote.partValue;
  }
}
