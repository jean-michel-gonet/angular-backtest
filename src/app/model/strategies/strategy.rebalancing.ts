import { Account } from '../core/account';
import { BearBull, MarketTiming } from '../core/market-timing';
import { Period } from '../core/period';
import { InstantQuotes } from '../core/quotes';
import { Report } from '../core/reporting';
import { Strategy } from '../core/strategy';
import { QuotesAssessor, TargetPositions } from './quotes-assessor';

/**
 * Configuration for {@link RebalancingStrategy}
 */
export interface RebalancingStrategyConfig {
  /** The quotes assessor to use for calculating target positions. */
  quotesAssessor: QuotesAssessor;

  /** When market is BEAR, then rebalancing strategy does not buy new assets. */
  marketTiming: MarketTiming;

  /**
   * Period to perform position rebalancing.
   * Position rebalance consist in selling all positions above target or not
   * in target, and buy positions in target with the freed cash.
   * Position rebalance takes precedence over portfolio rebalance.
   */
  positionRebalancePeriod: Period;

  /**
   * Period to perform portfolio rebalancing.
   * Portfolio rebalance consist in selling all positions not
   * in target (but keeping positions above target), and buy positions in
   * target with the freed cash.
   */
  portfolioRebalancePeriod?: Period;

  /** Minimum amount of cash to keep in account. */
  minimumCash?: number;

  /** Smallest operation for rebalancing. */
  smallestOperation?: number;
}

/**
 * Common base for implementing rebalancing strategies.
 * Rebalancing strategies change their positions on a regular
 * bases. They typically implement these two operations:
 * <ul>
 *    <li>{@link #rebalancePortfolio}: Clearing positions that have become
 *   undesirable according to some criteria specific to the strategy.</li>
 *    <li>{@link #rebalancePositions}: Increasing or decreasing positions
 *   according to some criteria specific to the strategy.</li>
 * </ul>
 * They also typically perform rebalance portfolio and position only on specific
 * days of the week, the month or the year.</li>
 */
export class RebalancingStrategy implements Strategy {
  public quotesAssessor: QuotesAssessor;
  public marketTiming: MarketTiming;
  public positionRebalancePeriod: Period;
  public portfolioRebalancePeriod: Period;
  public minimumCash: number;
  public smallestOperation: number;

  /**
   * Class constructor.
   * {@param obj} Configuration values.
   */
  constructor(obj = {} as RebalancingStrategyConfig) {
    let {
      quotesAssessor,
      marketTiming,
      positionRebalancePeriod,
      portfolioRebalancePeriod,
      minimumCash = 0,
      smallestOperation = 400
    } = obj;

    this.quotesAssessor = quotesAssessor;
    this.marketTiming = marketTiming;
    this.positionRebalancePeriod = positionRebalancePeriod;
    this.portfolioRebalancePeriod = portfolioRebalancePeriod ? portfolioRebalancePeriod : positionRebalancePeriod;
    this.minimumCash = minimumCash;
    this.smallestOperation = smallestOperation;
  }

  /**
   * Quotes of interest are all those from the assessor, plus the market timing.
   */
  listQuotesOfInterest(): string[] {
    let quotesOfInterest: string[] = [];

    quotesOfInterest = quotesOfInterest.concat(this.quotesAssessor.listQuotesOfInterest());
    if (this.marketTiming) {
      quotesOfInterest = quotesOfInterest.concat(this.marketTiming.listQuotesOfInterest());
    }

    return quotesOfInterest;
  }

  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    this.quotesAssessor.assessQuotes(instantQuotes);
    this.marketTiming.record(instantQuotes);

    let positionRebalancePeriod = this.positionRebalancePeriod.changeOfPeriod(instantQuotes.instant);
    let portfolioRebalancePeriod = this.portfolioRebalancePeriod.changeOfPeriod(instantQuotes.instant);

    if (positionRebalancePeriod) {
      let targetPositions = this.quotesAssessor.listTargetPositions(account.nav());
      this.rebalancePositions(account, targetPositions);
    } else if (portfolioRebalancePeriod) {
      let targetPositions = this.quotesAssessor.listTargetPositions(account.nav());
      this.rebalancePortfolio(account, targetPositions);
    }
  }

  /**
   * Sells positions either not in target or above target.
   * With obtained cash, buys more of the target positions.
   * {@param account} The account to rebalance.
   * {@param targetPositions} The target positions.
   */
  private rebalancePositions(account: Account, targetPositions: TargetPositions) {
    // Sell positions not in target:
    let freedCash = 0;
    account.positions.forEach(position => {
      let targetPosition = targetPositions.name(position.name);

      if (!targetPosition) {
        account.order(position.name, -position.parts);
        freedCash += position.nav();
      } else {
        let partsToSell = position.parts - targetPosition.parts;
        let xx = partsToSell * position.partValue;
        if (xx > this.smallestOperation) {
          account.order(position.name, - partsToSell);
          freedCash += partsToSell * position.partValue;
        }
      }
    });

    // With freed cash, buy more target positions:
    let availableCash = freedCash + account.cash - this.minimumCash;
    this.buyTargetPositions(availableCash, account, targetPositions);
  }

  /**
   * Sells positions not in target.
   * With obtained cash, buys more of the target positions.
   * {@param account} The account to rebalance.
   * {@param targetPositions} The target positions.
   */
  private rebalancePortfolio(account: Account, targetPositions: TargetPositions) {
    // Sell positions not in target:
    let freedCash = 0;
    account.positions.forEach(position => {
      if (!targetPositions.name(position.name)) {
        account.order(position.name, -position.parts);
        freedCash += position.nav();
      }
    });

    // With freed cash, buy more target positions:
    let availableCash = freedCash + account.cash - this.minimumCash;
    this.buyTargetPositions(availableCash, account, targetPositions);
  }

  /**
   * Uses the available cash to buy target positions.
   * It will buy positions specified in the target until it has used up
   * all the available cash.
   * {@param availableCash} The amount of cash to spend.
   * {@param account} The account to buy positions for.
   * {@param targetPositions} A list of target positions, sorted by desirability.
   */
  private buyTargetPositions(availableCash: number, account: Account, targetPositions: TargetPositions) {
    if (this.marketTiming.bearBull() == BearBull.BULL) {
      targetPositions.positions.forEach(targetPosition => {
        let position = account.position(targetPosition.name);
        let partsToBuy: number;
        if (position) {
          partsToBuy = targetPosition.parts - position.parts;
        } else {
          partsToBuy = targetPosition.parts;
        }
        if (partsToBuy > 0) {
          let canBuy = Math.floor(availableCash / targetPosition.partValue);
          let willBuy = Math.min(partsToBuy, canBuy);
          let willCost = targetPosition.partValue * willBuy;
          if (willCost > this.smallestOperation) {
            account.order(targetPosition.name, willBuy);
            availableCash -= targetPosition.partValue * willBuy;
          }
        }
      });
    }
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
