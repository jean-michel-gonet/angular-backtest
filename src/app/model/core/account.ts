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
 * Describes a settlement.
 * In the securities industry, the trade settlement period refers to the time
 * between the trade date—month, day, and year that an order is executed in
 * the market—and the settlement date—when a trade is considered final.
 * When shares of stock, or other securities, are bought or sold, both buyer
 * and seller must fulfill their obligations to complete the transaction.
 * During the settlement period, the buyer must pay for the shares, and the
 * seller must deliver the shares. On the last day of the settlement period,
 * the buyer becomes the holder of record of the security.
 * @class{Settlement}
 */
class Settlement {
  /** Number of parts, or amount of cash. */
  amount: number;
  /** The date when the trade is made effective.*/
  settlementDate: Date;
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

  /** A list of settlements */
  settlements: Settlement[];

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
    this.settlements = [];
  }

  /**
   * Returns the net quote value based on the closing price of part value and
   * the number of parts.
   * The nav includes the parts that are still in settlement.
   */
  nav():number {
    let parts = this.parts;
    this.settlements.forEach(settlement => {
      parts += settlement.amount;
    });
    return this.partValue * parts;
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
  settlementDays?: number;
  cash?: number;
  positions?: Position[];
  strategy?: Strategy;

  constructor(obj = {} as IAccount) {
    let {
      id = "ACCOUNT",
      settlementDays = 0,
      cash = 0,
      positions = [],
      strategy = new NullStrategy()
    } = obj;
    this.id = id;
    this.settlementDays = settlementDays;
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
  private cashSettlements: Settlement[] = [];
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
    this.cashSettlements.forEach(settlement => {
      nav += settlement.amount;
    });
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

    // Perform settlement:
    this.performSettlement();

    // Execute the standing orders:
    this.executeStandingOrders(instantQuotes);

    // Update the positions:
    this.updatePositions(instantQuotes);

    // Call the strategy:
    // The strategy may create additional standing orders, that will
    // be executed next day.
    this.strategy.applyStrategy(this, instantQuotes);
  }

  private performSettlement(): void {
    // Cash settlements:
    let remainingCashSettlements =
      this.cashSettlements.filter(settlement => {
        if (settlement.settlementDate.valueOf() <= this.instant.valueOf()) {
          this.cash += settlement.amount;
          return false;
        }
        return true;
      });
    this.cashSettlements = remainingCashSettlements;

    // Part settlements:
    this.positions.forEach(position => {
      let remainingSettlements = position.settlements.filter(settlement => {
        if (settlement.settlementDate.valueOf() <= this.instant.valueOf()) {
          position.parts += settlement.amount;
          return false;
        }
        return true;
      });
      position.settlements = remainingSettlements;
    });
  }

  /**
   * Updates the positions with the provided instant quotes.
   * Also applies dividends.
   * @param{InstantQuotes} instantQuotes The instant quotes.
   */
  private updatePositions(instantQuotes: InstantQuotes): void {
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
   * Exectues all standing orders if the instrument name is found
   * in the quotes of the day.
   * @param {InstantQuotes} instantQuotes The quotes of the day.
   */
  private executeStandingOrders(instantQuotes: InstantQuotes): void {
    let remainingOrders: Order[] = this.standingOrders.filter(standingOrder => {
      let quote: Quote = instantQuotes.quote(standingOrder.name);
      if (this.isOrderExecutable(quote, standingOrder.parts)) {
        this.executeImmediately(quote, standingOrder.parts);
        return false;
      } else {
        return true;
      }
    });
    this.standingOrders = remainingOrders;
  }

  /**
   * Establishes if it is possible to sell or buy the specified qupote, using
   * the open quotation.
   * @param {Quote} quote The quote to buy.
   * @param {number} parts When positive, the number of parts to buy. When
   * negative, the number of parts to sell.
   * @return {boolean} true if it is possible to execute the order.
   */
  private isOrderExecutable(quote: Quote, parts: number): boolean {
    // The empty order is always executable.
    if (parts == 0) {
      return true;
    }

    // A selling order is executable if there are enough parts in the position.
    if (parts < 0) {
      let position: Position = this.positions.find(p => {
        return p.name == quote.name;
      });
      if (position) {
        return position.parts >= -parts;
      }
    }

    // A buying order is executable if there enough cash to buy parts.
    if (parts > 0) {
      let availableCash: number = this.cash;
      let partValue: number = quote.partValue();
      let maximumParts = Math.floor(availableCash / partValue);
      return parts <= maximumParts;
    }

    // This is not an executable order:
    return false;
  }

  /**
   * Immediately sell or buys the specified quote, using the open quotation,
   * updating the concerned position and the cash.
   * Assumes that the order is executable, so there are no further verifications.
   * @param {Quote} quote The quote to buy.
   * @param {number} parts When positive, the number of parts to buy. When
   * negative, the number of parts to sell.
   **/
  private executeImmediately(quote: Quote, parts: number): boolean {
    parts = Math.floor(parts);
    if (parts == 0) {
      return;
    }

    // Looks for the corresponding position:
    let position: Position = this.positions.find(p => {
      return p.name == quote.name;
    });

    // If necessary, opens a new position:
    if (!position) {
      position = new Position({
        name: quote.name,
        parts: 0
      });
      this.positions.push(position);
    }

    // Exchanges the number of parts:
    let settlementDate = new Date(
      this.instant.getFullYear(),
      this.instant.getMonth(),
      this.instant.getDate() + this.settlementDays);

    if (parts > 0 && this.settlementDays > 0) {
      position.settlements.push({
        settlementDate: settlementDate,
        amount: parts});
    } else {
      position.parts += parts;
    }

    // Exchanges the cash:
    let costs: number = this.orderCost(quote, parts);
    this.accumulatedCosts += costs;
    let cash = - parts * quote.open - costs;
    if (cash > 0 && this.settlementDays > 0) {
      this.cashSettlements.push({
        settlementDate: settlementDate,
        amount: cash
      });
    } else {
      this.cash += cash;
    }

    // A little log:
    console.info(StringUtils.formatAsDate(this.instant) +
      " - Account " + this.id +
      " aquired " + parts + " parts of " + quote.name + " at " + quote.open);
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
