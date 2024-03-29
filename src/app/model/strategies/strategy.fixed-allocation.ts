import { Strategy } from '../core/strategy';
import { InstantQuotes } from '../core/quotes';
import { Account, Position } from '../core/account';
import { RegularTransfer } from '../core/transfer';
import { Report } from '../core/reporting';
import { Period, Periodicity } from '../core/period';
import { BackTestingError } from '../utils/back-testing-error';

/**
 * Describes the fixed allocation for one asset.
 * @class{IFixedAllocation}
 */
export class IAllocation {
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

  /**
   * Periodicity for rebalancing.
   * Strategy only rebalances in the specified period. Default value is daily.
   */
  periodicity?: Periodicity;

  /**
   * Strategy doesn't rebalance if dirft is below threshold.
   * Value is expressed in percentage of allocation.
   * For example, if target allocation is 20%, and threshold is 10%,
   * then it will rebalance only if actual allocation goes
   * over 22% or under 18% (because 10% of 20% is 2%)
   */
  threshold?: number;

  /** Optional transfer of funds.*/
  transfer?: RegularTransfer;
}

export class FixedAllocationStrategyError extends BackTestingError {
  constructor(message: string) {
    super(message);
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
  public fixedAllocations: IAllocation[];
  public period: Period;
  public pendingReallocation: IAllocation[];
  public threshold: number;
  public transfer: RegularTransfer;

  constructor(obj = {} as IFixedAllocationStrategy) {
    let {
      fixedAllocations = [],
      periodicity = Periodicity.DAILY,
      threshold = 5,
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
    this.period = new Period(periodicity);
    this.fixedAllocations = fixedAllocations;
    this.pendingReallocation = [];
    this.threshold = threshold;
    this.transfer = transfer;
  }
  /**
   * Liats all fixed allocations as quotes of interest.
   */
  listQuotesOfInterest(): string[] {
    let quotesOfInterest: string[] = [];
    this.fixedAllocations.forEach(f => {
      quotesOfInterest.push(f.assetName);
    });
    return quotesOfInterest;
  }

  /**
   * Applies the strategy.
   * Measures the dirft in respect of the target allocations.
   * If there are assets to sell, sells them.
   * If there are assets to buy, buys them.
   */
  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    // At each change or period, mark all fixed allocations as pending:
    if (this.period.changeOfPeriod(instantQuotes.instant)) {
      this.pendingReallocation = [];
      this.fixedAllocations.forEach(allocation => {
        this.pendingReallocation.push(allocation);
      });
    }

    // Try to rebalance each pending reallocations:
    let rebalancingOrders: IAllocation[] = [];
    this.pendingReallocation = this.pendingReallocation.filter(reallocation => {
      let rebalancingOrder =
          this.calculateRebalancingOrder(reallocation, account, instantQuotes);
      if (rebalancingOrder) {
        rebalancingOrders.push(rebalancingOrder);
        return false;
      }
      return true;
    });

    // Execute all rebalancing:
    rebalancingOrders.forEach(rebalancingOrder => {
        account.order(rebalancingOrder.assetName, rebalancingOrder.allocation);
    });
  }

  private calculateRebalancingOrder(fixedAllocation: IAllocation, account: Account, instantQuotes: InstantQuotes): IAllocation {
    let quote = instantQuotes.quote(fixedAllocation.assetName);
    if (quote) {
      let position = account.position(fixedAllocation.assetName);
      if (!position) {
        position = new Position({
          name: fixedAllocation.assetName,
          parts: 0,
          partValue: quote.close
        });
      }
      let targetAllocation = fixedAllocation.allocation * account.nav() / 100;
      let actualAllocation = position.nav();
      let allowedDrift = targetAllocation * this.threshold / 100;
      let drift = targetAllocation - actualAllocation;
      if (Math.abs(drift) > allowedDrift) {
        let driftInNumberOfParts = Math.round(drift / position.partValue);
        if (driftInNumberOfParts) {
          return {
            assetName: fixedAllocation.assetName,
            allocation: driftInNumberOfParts};
        }
      }
    }
    return null;
  }

  // ********************************************************************
  // **                        Report interface.                       **
  // ********************************************************************
  /**
   * This strategy has nothing to report, but maybe some of the dependencies
   * have?
   * @param {Report} report The data processor.
   */
  doRegister(report: Report): void {
    if (this.transfer.to) {
      this.transfer.to.doRegister(report);
    }
  }

  startReportingCycle(instant: Date): void {
    // Don't care.
  }

  reportTo(report: Report): void {
    // Nothing to report.
  }
}
