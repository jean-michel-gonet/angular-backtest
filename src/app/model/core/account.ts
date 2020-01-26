import {Position, AssetOfInterest} from './asset';
import { Stock } from './stock';
import { Strategy } from './strategy';
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
      strategy = null
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
  private lastProcessedTime: Date;
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
    this.lastProcessedTime = stock.time;
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
  costs(asset: AssetOfInterest, parts: number): number {
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
    let costs: number = this.costs(asset, parts);
    this.accumulatedCosts += costs;
    this.cash = this.cash -
                parts * asset.partValue -
                costs;
  }

  /**
   * Reports to a data processor.
   * Reports contains:
   * - The current cash.
   * - The current nav.
   * - The costs of the day.
   * - The valuation of each position.
   */
  provideData(dataProcessor: DataProcessor): void {
    dataProcessor.receiveData(new ProvidedData({
      sourceName: this.id + ".CASH",
      time: this.lastProcessedTime,
      y: this.cash
    }));

    dataProcessor.receiveData(new ProvidedData({
      sourceName: this.id + ".NAV",
      time: this.lastProcessedTime,
      y: this.nav()
    }));

    dataProcessor.receiveData(new ProvidedData({
      sourceName: this.id + ".COST",
      time: this.lastProcessedTime,
      y: this.accumulatedCosts
    }));

    this.positions.forEach(p => {
      dataProcessor.receiveData(new ProvidedData({
        sourceName: this.id + "." + p.isin + ".POS",
        time: this.lastProcessedTime,
        y: p.nav()
      }));
    });
  }
}
