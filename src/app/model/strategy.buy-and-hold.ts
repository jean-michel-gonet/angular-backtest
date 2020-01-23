import { Strategy } from './core/strategy';
import { Stock } from './core/stock';
import { Account } from './core/account';
import { AssetOfInterest } from './core/asset';

class IBuyAndHoldStrategy {
  isin?: string;
  monthlyOutput?: number;
}

/**
 * Implements the buy and hold strategy with specified ISIN over the
 * the whole simulation.
 * @class {BuyAndHoldStrategy}
 */
export class BuyAndHoldStrategy extends Strategy {
  isin: string;
  monthlyOutput: number;

  constructor(obj = {} as IBuyAndHoldStrategy) {
    super();
    let {
      isin = "",
      monthlyOutput = 0
    } = obj;
    this.isin = isin;
    this.monthlyOutput = monthlyOutput;
  }

  /**
   * Applies the Buy And Hold strategy.
   */
  applyStrategy(account: Account, stock: Stock): void {
    if (!account.position(this.isin)) {
      this.executeInitialOrder(account, stock);
    }
    if (stock.time.getDay() == 1) {
      this.performMonthlyOutput(account, stock);
    }
  }

  /**
   * Initial order consists in investing the whole
   * capital into one single ISIN.
   */
  private executeInitialOrder(account: Account, stock: Stock): void {
    let assetOfInterest: AssetOfInterest = stock.assetOfInterest(this.isin);
    if (assetOfInterest) {
      let numberOfParts: number = account.cash / assetOfInterest.partValue;
      account.order(assetOfInterest, numberOfParts);
    }
  }

  /**
   * Periodically withdraw the cash amount required for
   * living.
   */
  private performMonthlyOutput(account: Account, stock: Stock): void {
    let assetOfInterest: AssetOfInterest = stock.assetOfInterest(this.isin);
    if (assetOfInterest) {
      let numberOfParts: number = this.monthlyOutput / assetOfInterest.partValue;
      account.order(assetOfInterest, -numberOfParts);
    }
  }
}
