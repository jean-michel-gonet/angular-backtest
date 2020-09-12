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
 * @class Account
 */
export class Account extends IAccount implements Reporter {
  private accumulatedCosts: number;
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
    // Updates current time.
    this.instant = instantQuotes.instant;

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
    this.strategy.applyStrategy(this, instantQuotes);
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
   *                       negative, the number of parts to sell.
   * @return {number} The cost, always positive.
   **/
  orderCost(quote: Quote, parts: number): number {
    return Math.abs(parts * quote.close * quote.spread / 2);
  }

  /**
   * Sells or buys the specified quote, updating the concerned position
   * and the cash.
   * @param {Quote} quote The quote to buy.
   * @param {number} parts When positive, the number of parts to buy. When
   *                       negative, the number of parts to sell.
   **/
  order(quote: Quote, parts: number): void {
    parts = Math.floor(parts);
    if (parts == 0) {
      return;
    }

    // Looks for the corresponding position:
    let position: Position = this.positions.find(p => {
      return p.name == quote.name;
    });

    // Either update or create the position:
    if (position) {
      position.partValue = quote.close;
    } else {
      position = new Position({
        name: quote.name,
        partValue: quote.close,
      });
      this.positions.push(position);
    }

    // If possible, updates the number of parts accordingly:
    if (position.parts + parts < 0) {
      parts =  -position.parts;
    }
    position.parts += parts;

    // Updates the cash based on the number of parts,
    // the part value and the costs:
    let costs: number = this.orderCost(quote, parts);
    this.accumulatedCosts += costs;
    this.cash = this.cash -
                parts * quote.close -
                costs;

    // A little log:
    console.info(StringUtils.formatAsDate(this.instant) +
      " - Account " + this.id +
      " ordered " + parts + " parts of " + quote.name + " at " + quote.close);
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
