class ICandle {
  open?: number;
  high?: number;
  low?: number;
  close: number;
}

/**
 * A candlestick describes the part value of an asset over a period of time.
 * It is composed of four components:
 * - The opening price.
 * - The closing price.
 * - The highest price.
 * - The lowest price.
 * see https://en.wikipedia.org/wiki/Candlestick_chart
 * @class{Candlestick}
 */
export class Candlestick {
  open: number;
  high: number;
  low: number;
  close: number;

  /**
   * Class constructor.
   */
  constructor(obj: ICandle = {} as ICandle) {
    let {
      open,
      high,
      low,
      close
    } = obj;
    this.close = close;
    if (open) {
      this.open = open;
    } else {
      this.open = close;
    }
    if (high) {
      this.high = high;
    } else {
      this.high = Math.max(this.open, this.close);
    }
    if (low) {
      this.low = low;
    } else {
      this.low = Math.min(this.open, this.close);
    }
  }

  /**
   * Returns a new candlestick instance representing the merge
   * of this candle and another one.
   * @param {Candlestick} other The other candlestick.
   * @return A new instance.
   */
  merge(other: Candlestick): Candlestick {
    return new Candlestick({
      open: this.open,
      close: other.close,
      high: Math.max(this.high, other.high),
      low: Math.min(this.low, other.low)
    })
  }
}

/**
 * An asset is a resource with economic value that an individual, corporation
 * or country owns or controls with the expectation that it will provide a
 * future benefit.
 * Assets are reported on a company's balance sheet and are bought or created
 * to increase a firm's value or benefit the firm's operations.
 * See https://www.investopedia.com/terms/a/quote.asp
 * @class{Asset}
 */
export class Asset {
  name: string;
  partValue?: Candlestick;

  constructor(obj: Asset = {} as Asset) {
    let {
      name = "",
      partValue = new Candlestick({
        open: 0,
        close: 0,
        high: 0,
        low: 0
      })
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
   * Returns the net quote value based on the closing price of part value and
   * the number of parts.
   */
  nav():number {
    return this.partValue.close * this.parts;
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
