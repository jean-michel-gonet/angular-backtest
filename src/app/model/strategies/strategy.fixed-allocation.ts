import { Strategy } from '../core/strategy';
import { InstantQuotes, Quote } from '../core/quotes';
import { Account, Position } from '../core/account';
import { RegularTransfer } from '../core/transfer';
import { Report } from '../core/reporting';

/**
 * Describes the fixed allocation for one asset.
 * @class{IFixedAllocation}
 */
class IAllocation {
  assetName: string;
  allocation: number;
}

/**
 * Initialization interface for a fixed allocation strategy.
 * @class{IFixedAllocationStrategy}
 */
class IFixedAllocationStrategy {
  /** Lists all allocations.*/
  fixedAllocations: IAllocation[];

  /** Optional transfer of funds.*/
  transfer?: RegularTransfer;
}

export class FixedAllocationStrategyError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name;
  }
}

export class FixedAllocationStrategyErrorInvalidAllocation extends FixedAllocationStrategyError {
  constructor(public allocation: IAllocation ) {
    super("Fixed allocation " + allocation.assetName +
          " has invalid allocation value: " + allocation.allocation);
  }
}

export class FixedAllocationStrategyErrorInvalidAssetName extends FixedAllocationStrategyError {
  constructor(public allocation: IAllocation ) {
    super("Fixed allocations need to have a non null asset name");
  }
}

export class FixedAllocationStrategyErrorTotalAllocation extends FixedAllocationStrategyError {
  constructor(totalAllocation: number) {
    super("Total allocation should not be greater than 100: " + totalAllocation);
  }
}

export class FixedAllocationStrategyErrorDuplicatedAssetName extends FixedAllocationStrategyError {
  constructor(assetName: String) {
    super("Don't specify twice the allocations for the same asset name: " + assetName);
  }
}

/**
 * Implements the buy and hold strategy with specified ISIN over the
 * the whole simulation.
 * @class {BuyAndHoldStrategy}
 */
export class FixedAllocationStrategy implements Strategy {
  private fixedAllocations: IAllocation[];
  private transfer: RegularTransfer;

  constructor(obj = {} as IFixedAllocationStrategy) {
    let {
      fixedAllocations = [],
      transfer = new RegularTransfer()
    } = obj;

    // Check that allocations are not over 100%:
    let totalAllocation: number = 0;
    fixedAllocations.forEach(fixedAllocation => {
      if (!fixedAllocation.allocation) {
        throw new FixedAllocationStrategyErrorInvalidAllocation(fixedAllocation);
      }
      totalAllocation += fixedAllocation.allocation;
      if (!fixedAllocation.assetName) {
        throw new FixedAllocationStrategyErrorInvalidAssetName(fixedAllocation);
      }
    });
    if (totalAllocation > 100) {
      throw new FixedAllocationStrategyErrorTotalAllocation(totalAllocation);
    }

    // Check that there are no repeated assets:
    let n: number;
    for(n = 0; n < fixedAllocations.length; n++) {
      let m: number;
      for (m = n + 1; m < fixedAllocations.length; m++) {
        let assetName1 = fixedAllocations[n].assetName;
        let assetName2 = fixedAllocations[m].assetName;
        if (assetName1 == assetName2) {
          throw new FixedAllocationStrategyErrorDuplicatedAssetName(assetName1);
        }
      }
    }

    // All good:
    this.fixedAllocations = fixedAllocations;
    this.transfer = transfer;
  }

  /**
   * Applies the strategy.
   * Measures the dirft in respect of the target allocations.
   * If there are assets to sell, sells them.
   * If there are assets to buy, buys them.
   */
  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    let rebalancingOrders = this.calculateRebalancingOrders(account, instantQuotes);

    // Executes all selling:
    let waitForSelling: boolean = false;
    rebalancingOrders.forEach(rebalancingOrder => {
      if (rebalancingOrder.allocation < 0) {
        account.order(rebalancingOrder.assetName, rebalancingOrder.allocation);
        waitForSelling = true;
      }
    });

    // Executes all buying:
    if (!waitForSelling) {
      rebalancingOrders.forEach(rebalancingOrder => {
        account.order(rebalancingOrder.assetName, rebalancingOrder.allocation);
        waitForSelling = true;
      });
    }
  }

  private calculateRebalancingOrders(account: Account, instantQuotes: InstantQuotes): IAllocation[] {
    let nav = account.nav();
    let rebalancingOrders: IAllocation[] = [];

    this.fixedAllocations.forEach(fixedAllocation => {
      let position = account.position(fixedAllocation.assetName);
      if (!position) {
        position = new Position({
          name: fixedAllocation.assetName,
          parts: 0,
          partValue: instantQuotes.quote(fixedAllocation.assetName).close
        });
      }
      let targetAllocation = fixedAllocation.allocation * nav / 100;
      let actualAllocation = position.nav();
      let drift = targetAllocation - actualAllocation;
      let driftInNumberOfParts = Math.round(drift / position.partValue);
      if (driftInNumberOfParts) {
        rebalancingOrders.push({
          assetName: fixedAllocation.assetName,
          allocation: driftInNumberOfParts});
      }
    });
    return rebalancingOrders;
  }

  doRegister(report: Report): void {
    throw new Error('Method not implemented.');
  }

  startReportingCycle(instant: Date): void {
    throw new Error('Method not implemented.');
  }

  reportTo(report: Report): void {
    throw new Error('Method not implemented.');
  }
}
