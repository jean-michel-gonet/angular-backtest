import { Position } from '../core/account';
import { InstantQuotes } from '../core/quotes';

/**
 * Holds a list of target positions both by rank and by name.
 */
export class TargetPositions {
  private positionsMap = new Map<string, Position>();
  public positions: Position[] = [];

  /**
   * Adds a new entry to the list of target positions.
   * @param rank The position in the list. If a target position
   * already exists with the same rank, it will be replaced.
   * @param position The position. At very least, its name
   * and its close price have to be set.
   */
  public addTargetPosition(rank: number, position: Position) {
    this.positions[rank] = position;
    this.positionsMap.set(position.name, position);
  }

  /**
   * Returns the target position for the specified instrument name.
   * @param name The instrument name.
   * @return The target position, or {@code null}
   */
  public name(name: string): Position {
    return this.positionsMap.get(name);
  }
}

/**
 * Receives instant quotes to assess, and can build a list of
 * target positions useful to rebalance a portfolio.
 */
export interface QuotesAssessor {
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
