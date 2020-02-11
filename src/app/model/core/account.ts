import {Position, Quote} from './asset';
import { InstantQuotes } from './quotes';
import { Strategy, NullStrategy } from './strategy';
import { Reporter, Report, ReportedData } from './reporting';

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
        this.cash += position.nav() * quote.dividend / 100;
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
    return Math.abs(parts * quote.partValue * quote.spread / 2);
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

    // Looks for the corresponding position:
    let position: Position = this.positions.find(p => {
      return p.name == quote.name;
    });

    // Either update or create the position:
    if (position) {
      position.partValue = quote.partValue;
    } else {
      position = new Position(quote);
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
                parts * quote.partValue -
                costs;

    // A little log:
    console.info("Account " + this.id + " ordered " + parts + " parts of " + quote.name + " on " + this.instant);
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
