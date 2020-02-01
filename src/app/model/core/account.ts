import {Position, AssetOfInterest} from './asset';
import { Stock } from './stock';
import { Strategy, NullStrategy } from './strategy';
import { DataProvider, DataProcessor, ProvidedData } from './data-processor';

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
 * The account holds the cash and a list of asset positions.
 * It also handles the buy and sell operations.
 * @class Account
 */
export class Account extends IAccount implements DataProvider {
  private reportingTime: Date;
  private accumulatedCosts: number;

  constructor(obj = {} as IAccount) {
    super(obj);
  }

  /**
   * Returns the position designated by the provided ISIN.
   * @param {string} isin The required isin.
   * @return {Position} The corresponding position, or null.
   */
  position(isin: string): Position {
    return this.positions.find(position => {
      return position.isin == isin;
    });
  }

  /**
   * Computes the net asset value of this portfolio, including
   * cash and assets positions.
   * @return The net asset value.
   */
  nav(): number {
    let nav = this.cash;
    this.positions.forEach(position => {
      nav += position.nav();
    });
    return nav;
  }

  /**
   * Receives the stock updates and propagates them to the positions
   * and to the strategy.
   * @param{Stock} stock The stock update.
   */
  process(stock: Stock): void {
    this.accumulatedCosts = 0;

    // Update the positions:
    stock.assetsOfInterest.forEach(assetOfInterest => {
      let position: Position = this.positions.find(p => {
        return p.isin == assetOfInterest.isin;
      });
      if (position) {
        position.update(assetOfInterest);
      }
    });

    // Call the strategy:
    this.strategy.applyStrategy(this, stock);
  }

  /**
   * Calculates the absolute cost of buying or selling the specified number
   * of parts of the specified asset. The cost is the difference between the
   * exchanged amount of cash and the variation of net asset value.
   * The basic behavior is to consider only the cost of the spread.
   * Extend this method to reflect specific behavior of each
   * trending partner.
   * @param {AssetOfInterest} asset The asset to buy.
   * @param {number} parts When positive, the number of parts to buy. When
   *                       negative, the number of parts to sell.
   * @return {number} The cost, always positive.
   **/
  orderCost(asset: AssetOfInterest, parts: number): number {
    return Math.abs(parts * asset.partValue * asset.spread / 2);
  }

  /**
   * Sells or buys the specified asset, updating the concerned position
   * and the cash.
   * @param {AssetOfInterest} asset The asset to buy.
   * @param {number} parts When positive, the number of parts to buy. When
   *                       negative, the number of parts to sell.
   **/
  order(asset: AssetOfInterest, parts: number): void {

    // Looks for the corresponding position:
    let position: Position = this.positions.find(p => {
      return p.isin == asset.isin;
    });

    // Either update or create the position:
    if (position) {
      position.partValue = asset.partValue;
    } else {
      position = new Position(asset);
      this.positions.push(position);
    }

    // If possible, updates the number of parts accordingly:
    if (position.parts + parts < 0) {
      parts =  -position.parts;
    }
    position.parts += parts;

    // Updates the cash based on the number of parts,
    // the part value and the costs:
    let costs: number = this.orderCost(asset, parts);
    this.accumulatedCosts += costs;
    this.cash = this.cash -
                parts * asset.partValue -
                costs;
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
   * Accepts the visit of a data processor,
   * and guides it through the hierarchy.
   */
  accept(dataProcessor: DataProcessor): void {
    dataProcessor.visit(this);
    if (this.strategy) {
      this.strategy.accept(dataProcessor);
    }
  }

  /**
   * Receives notification that a new reporting cycle starts,
   * at the specified time.
   */
  startReportingCycle(time: Date): void {
    this.reportingTime = time;
  }

  /**
   * Reports to a data processor.
   * Reports contains:
   * - The current cash.
   * - The current nav.
   * - The costs of the day.
   * - The valuation of each position.
   */
  report(dataProcessor: DataProcessor): void {
    dataProcessor.receiveData(new ProvidedData({
      sourceName: this.id + ".CASH",
      time: this.reportingTime,
      y: this.cash
    }));

    dataProcessor.receiveData(new ProvidedData({
      sourceName: this.id + ".NAV",
      time: this.reportingTime,
      y: this.nav()
    }));

    dataProcessor.receiveData(new ProvidedData({
      sourceName: this.id + ".COST",
      time: this.reportingTime,
      y: this.accumulatedCosts
    }));

    this.positions.forEach(p => {
      dataProcessor.receiveData(new ProvidedData({
        sourceName: this.id + "." + p.isin + ".POS",
        time: this.reportingTime,
        y: p.nav()
      }));
    });
  }
}
