import { Position, PositionConfiguration } from '../core/account';
import { InstantQuotes, QuotesOfInterest } from '../core/quotes';

interface RankedPositionConfiguration extends PositionConfiguration {
  rank: number;
}

export class RankedPosition extends Position {
  public rank: number;

  constructor(obj: RankedPositionConfiguration = {} as RankedPositionConfiguration) {
    super(obj);
    let {
      rank
    } = obj;
    this.rank = rank;
  }
}

/**
 * Holds a list of target positions both by rank and by name.
 */
export class TargetPositions {
  private positionsMap = new Map<string, RankedPosition>();
  public positions: RankedPosition[] = [];

  /**
   * Adds a new entry to the list of target positions.
   * @param rankedPosition A position with rank.
   * At very least, its name, its rank and its close price have to be set.
   * If a position already exists with the same rank, it will be replaced.
   *
   */
  public addTargetPosition(rankedPosition: RankedPosition) {
    this.positions[rankedPosition.rank] = rankedPosition;
    this.positionsMap.set(rankedPosition.name, rankedPosition);
  }

  /**
   * Returns the target position for the specified instrument name.
   * @param name The instrument name.
   * @return The target position, or {@code null}
   */
  public name(name: string): RankedPosition {
    return this.positionsMap.get(name);
  }
}

/**
 * Receives instant quotes to assess, and can build a list of
 * target positions useful to rebalance a portfolio.
 */
export interface QuotesAssessor extends QuotesOfInterest {
  /**
   * Assess all provided quotes.
   * @param instantQuotes The quotes to assess.
   */
  assessQuotes(instantQuotes: InstantQuotes): void;

  /**
   * Builds a list of target positions based on the quotes assessed
   * so far.
   * @param nav The net asset value of the portfolio.
   * @return A list of target positions.
   */
  listTargetPositions(nav: number): TargetPositions;
}
