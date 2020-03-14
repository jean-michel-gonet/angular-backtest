
class ICandleStick {
  close: number;
  open?: number;
  high?: number;
  low?: number;
}

/**
 * The wide part of the candlestick is called the "real body" and tells
 * investors whether the closing price was higher or lower than the opening
 * price (black/red if the stock closed lower, white/green if the
 * stock closed higher).
 * see https://www.investopedia.com/terms/c/candlestick.asp
 * @class{CandlestickType}
 */
export enum CandlestickType {
  GREEN = +1,
  RED = -1
};

/**
 * A candlestick is a type of price chart used that displays the high,
 * low, open, and closing prices of a security for a specific period.
 * It originated from Japanese rice merchants and traders to track market
 * prices and daily momentum hundreds of years before becoming popularized
 * in the United States.
 * see https://www.investopedia.com/terms/c/candlestick.asp
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
  constructor(obj: ICandleStick = {} as ICandleStick) {
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

  /**
   * Returns the type of candle.
   * GREEN candles have a closing price higher or equal to opening price.
   * Otherwise, the candle is red.
   * @return {CandlestickType} The candle type.
   */
  type(): CandlestickType {
    if (this.close >= this.open) {
      return CandlestickType.GREEN;
    } else {
      return CandlestickType.RED;
    }
  }
}

class IQuote extends ICandleStick {
  name: string;
  volume?: number;
  spread?: number;
  dividend?: number;
}

/**
 * A quote is the last price at which a security or commodity traded, meaning
 * the most recent price to which a buyer and seller agreed and at which some
 * amount of the quote was transacted.
 * See https://www.investopedia.com/terms/q/quote.asp
 * @class{Quote}
 */
export class Quote extends Candlestick {
  /** The asset name. */
  name: string;

  /**
   * The number of shares or contracts traded in a security or an
   * entire market during a given period of time.
   * While volume is not directly used when performing operations,
   * it is important to estimate the dividends.
   * see https://www.investopedia.com/terms/v/volume.asp
   */
  volume?: number;

  /**
  * The spread is the gap between the bid and the ask prices of a security
  * or asset, like a stock, bond or commodity.
  * This is known as a bid-ask spread.
  * see https://www.investopedia.com/terms/s/spread.asp
  */
  spread?: number;

  /**
   * A dividend is the distribution of reward from a portion of the company's
   * earnings and is paid to a class of its shareholders.
   */
  dividend?: number;

  constructor(obj: IQuote = {} as IQuote) {
    super(obj);
    let {
      name = "",
      volume = 0,
      spread = 0,
      dividend = 0
    } = obj;
    this.name = name;
    this.volume = volume;
    this.spread = spread;
    this.dividend = dividend;
  }
}

class IPosition {
  name: string;
  parts?: number;
  partValue?: number;
  aquisitionCosts?: number;
  sellingCosts?: number;
}

/**
 * A position is the amount of a security, commodity or currency which is
 * owned by an individual, dealer, institution, or other fiscal entity.
 * See https://www.investopedia.com/terms/p/position.asp
 * Contains the required information to calculate
 * the NAV, and also profit and losses.
 */
export class Position {
  /** The asset name. */
  name: string;

  /** The number of parts. */
  parts?: number;

  /** The part value, according to the last quotation. */
  partValue?: number;

  /** The accumulated costs invested to aquire the position. */
  aquisitionCosts?: number;

  /** The costs that would be involved in selling this position.*/
  sellingCosts?: number;

  /** Class constructor.
   * @param {IPosition} obj The object properties.
   */
  constructor(obj: IPosition = {} as IPosition) {
    let {
      name,
      parts = 0,
      partValue = 0,
      aquisitionCosts = 0
    } = obj;
    this.name = name;
    this.parts = parts;
    this.partValue = partValue;
    this.aquisitionCosts = aquisitionCosts;
  }

  /**
   * Returns the net quote value based on the closing price of part value and
   * the number of parts.
   */
  nav():number {
    return this.partValue * this.parts;
  }

  /**
   * Returns the balance of this position.
   */
  profitAndLoss(): number {
    return this.nav() - this.aquisitionCosts - this.sellingCosts;
  }

  /**
   * Updates the part value of this position based on the
   * closing price in the provided quote.
   * @param {Asset} quote The update.
   */
  update(quote: Quote): void {
      this.partValue = quote.close;
  }
}
