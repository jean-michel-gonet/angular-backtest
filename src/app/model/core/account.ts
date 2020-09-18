import { InstantQuotes, Quote } from './quotes';
import { Strategy, NullStrategy } from './strategy';
import { Reporter, Report, ReportedData } from './reporting';
import { StringUtils } from '../utils/string-utils';

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

/**
 * Describes the order to buy (parts > 0) or sell (parts < 0) parts of the
 * specified quote.
 * Orders are always Good Till Done, executed at Market Value (open) at the
 * beginning of the next opening day.
 * @class{Order}
 */
export class Order {
  /** The name of the instrument to sell.*/
  name: String;
  /** The number of parts to buy or sell.*/
  parts: number
}

class IAccount {
  id?: string;
  cash?: number;
  positions?: Position[];
  strategy?: Strategy;

  constructor(obj = {} as IAccount) {
    let {
      id = "ACCOUNT",
      cash = 0,
      positions = [],
      strategy = new NullStrategy()
    } = obj;
    this.id = id;
    this.cash = cash;
    this.positions = positions;
    this.strategy = strategy;
  }
}

/**
 * The account holds the cash and a list of quote positions.
 * It also handles the buy and sell operations.
 * @class{Account}
 */
export class Account extends IAccount implements Reporter {
  private standingOrders: Order[] = [];
  public accumulatedCosts: number = 0;
  private instant: Date;

  constructor(obj = {} as IAccount) {
    super(obj);
  }

  /**
   * Returns the position designated by the provided ISIN.
   * @param {string} name The required name.
   * @return {Position} The corresponding position, or null.
   */
  position(name: string): Position {
    return this.positions.find(position => {
      return position.name == name;
    });
  }

  /**
   * Computes the net quote value of this portfolio, including
   * cash and assets positions.
   * @return The net quote value.
   */
  nav(): number {
    let nav = this.cash;
    this.positions.forEach(position => {
      nav += position.nav();
    });
    return nav;
  }

  /**
   * Receives the instantQuotes updates and propagates them to the positions
   * and to the strategy.
   * @param{InstantQuotes} instantQuotes The instantQuotes update.
   */
  process(instantQuotes: InstantQuotes): void {
    // Update current time.
    this.instant = instantQuotes.instant;

    // Execute the standing orders:
    this.executeStandingOrders(instantQuotes);

    // Update the positions:
    instantQuotes.quotes.forEach(quote => {
      let position: Position = this.positions.find(p => {
        return p.name == quote.name;
      });
      if (position) {
        position.update(quote);
        if (quote.dividend) {
          let dividends = position.parts * quote.dividend;
          this.cash += dividends;
          console.info(StringUtils.formatAsDate(this.instant) +
            " - Account " + this.id +
            " received " + quote.dividend + " per part of " + quote.name + ". A total of " + dividends  + " for " + position.parts + " parts.");
        }
      }
    });

    // Call the strategy:
    // The strategy may create additional standing orders, that will
    // be executed next day.
    this.strategy.applyStrategy(this, instantQuotes);
  }

  /**
   * Exectues all standing orders if the instrument name is found
   * in the quotes of the day.
   * @param {InstantQuotes} instantQuotes The quotes of the day.
   */
  private executeStandingOrders(instantQuotes: InstantQuotes): void {
    let remainingOrders: Order[] = this.standingOrders.filter(standingOrder => {
      let quote: Quote = instantQuotes.quote(standingOrder.name);
      if (quote) {
        this.executeImmediately(quote, standingOrder.parts);
        return false;
      }
      return true;
    });
    this.standingOrders = remainingOrders;
  }

  /**
   * Immediately sell or buys the specified quote, using the open quotation,
   * updating the concerned position and the cash.
   * @param {Quote} quote The quote to buy.
   * @param {number} parts When positive, the number of parts to buy. When
   * negative, the number of parts to sell.
   **/
  private executeImmediately(quote: Quote, parts: number): void {
    parts = Math.floor(parts);
    if (parts == 0) {
      return;
    }

    // Looks for the corresponding position:
    let position: Position = this.positions.find(p => {
      return p.name == quote.name;
    });
    if (!position) {
      position = new Position({
        name: quote.name,
        parts: 0
      });
      this.positions.push(position);
    }

    // Checks for available cash:
    parts = this.maximumPartsGivenAvailableCash(quote, parts);

    // Checks for available parts:
    if (parts <  -position.parts) {
      parts = -position.parts;
    }

    // Performs the transaction:
    position.parts += parts;
    let costs: number = this.orderCost(quote, parts);
    this.accumulatedCosts += costs;
    this.cash = this.cash -
                parts * quote.open -
                costs;

    // A little log:
    console.info(StringUtils.formatAsDate(this.instant) +
      " - Account " + this.id +
      " ordered " + parts + " parts of " + quote.name + " at " + quote.open);
  }

  /**
   * Verifies the there is enough available cash to buy the indended number of parts.
   * When there is not enough cash, returns the maximum number of parts
   * that can be bought.
   * @param {Quote} quote The quote to buy.
   * @param {number} intendedParts The intended number of parts to buy.
   * @return {number} The maximum number of parts.
   */
  private maximumPartsGivenAvailableCash(quote: Quote, intendedParts: number): number {
    let availableCash: number = this.cash;
    let partValue: number = quote.partValue();

    let maximumParts = Math.floor(availableCash / partValue);
    if (intendedParts > maximumParts) {
      intendedParts = maximumParts;
    }

    let requiredCash = intendedParts * partValue + this.orderCost(quote, intendedParts);
    while (requiredCash > availableCash) {
      intendedParts--;
      requiredCash = intendedParts * partValue + this.orderCost(quote, intendedParts);
    }
    return intendedParts;
  }

  /**
   * Adds a standing order.
   * Standing orders will be executed at market value (open), next day.
   * @param {String} name The name of the instrument.
   * @param {number} parts The number of parts to buy (if positive) or sell (if negative).
   */
  order(name: String, parts: number) {
    this.standingOrders.push({name: name, parts: parts});
  }

  /**
   * Calculates the absolute cost of buying or selling the specified number
   * of parts of the specified quote. The cost is the difference between the
   * exchanged amount of cash and the variation of net quote value.
   * The basic behavior is to consider only the cost of the spread.
   * Extend this method to reflect specific behavior of each
   * trending partner.
   * @param {Quote} quote The quote to buy.
   * @param {number} parts When positive, the number of parts to buy. When
   * negative, the number of parts to sell.
   * @return {number} The cost, always positive.
   **/
  orderCost(quote: Quote, parts: number): number {
    return Math.abs(parts * quote.open * quote.spread / 2);
  }

  /**
   * Transfer the specified amount to the specified account.
   * If cash is available. Involved costs are removed from
   * the transferred account.
   */
  transfer(account: Account, amount: number): void {
    if (this.cash >= amount) {
      let costs = this.transferCost(account, amount);
      account.receive(amount - costs);
      this.cash -= amount;
    }
  }

  /**
   * Receive the specified amount of cash.
   */
  receive(amount: number): void {
    this.cash += amount;
  }

  /**
   * Calculates the absolute cost of transferring the specified amount
   * to the specified account.
   * Extend this method to reflect specific behavior of each
   * trading partner.
   * @param {Account} account The destination account.
   * @param {number} amount The amount to transfer.
   * @return {number} The cost, never negative.
   **/
  transferCost(account: Account, amount: number): number {
    return 0;
  }

  /**
   * Registers all available data providers to the specified data processor.
   */
  doRegister(report: Report): void {
    report.register(this);
    if (this.strategy) {
      this.strategy.doRegister(report);
    }
  }

  /**
   * Receives notification that a new reporting cycle starts,
   * at the specified instant.
   */
  startReportingCycle(instant: Date): void {
    this.accumulatedCosts = 0;
  }

  /**
   * Reports to a data processor.
   * Reports contains:
   * - The current cash.
   * - The current nav.
   * - The costs of the day.
   * - The valuation of each position.
   */
  reportTo(report: Report): void {
    report.receiveData(new ReportedData({
      sourceName: this.id + ".CASH",
      y: this.cash
    }));

    report.receiveData(new ReportedData({
      sourceName: this.id + ".NAV",
      y: this.nav()
    }));

    report.receiveData(new ReportedData({
      sourceName: this.id + ".COST",
      y: this.accumulatedCosts
    }));

    this.positions.forEach(p => {
      report.receiveData(new ReportedData({
        sourceName: this.id + "." + p.name + ".POS",
        y: p.nav()
      }));
    });
  }
}
