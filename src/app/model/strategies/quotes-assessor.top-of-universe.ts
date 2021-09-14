import { Position } from '../core/account';
import { InstantQuotes } from '../core/quotes';
import { Universe } from '../core/universe';
import { QuoteAssessor, QuoteAssessorFactory } from './quote-assessor';
import { QuotesAssessor, TargetPositions } from './quotes-assessor';

/**
 * Configuration for {@link TopOfUniverseQuotesAssessor}
 */
export interface TopOfUniverseQuotesAssessorConfig {
  /** A factory of {@link QuoteAssessor}, to build new instances.*/
  quoteAssessorFactory: QuoteAssessorFactory;

  /** The investment universe.*/
  universe: Universe;

  /* After ranking all assets in the index, picks only this number from the top.*/
  topOfIndex: number;
}

/**
 * Picks a number of assessed quotes, from the top, belonging to a defined universe.
 */
export class TopOfUniverseQuotesAssessor implements QuotesAssessor {
  public quoteAssessorFactory: QuoteAssessorFactory;
  public topOfIndex: number;
  public universe: Universe;
  private quoteAssessors = new Map<String, QuoteAssessor>();
  private instant: Date;

  /**
   * Class constructor
   * @param maximumAtrPerPosition Maximum ATR per position, in fractions of the NAV (0.01 is 1%).
   * @param maximumAcceptableGap Maximum acceptable gap in the recent history of the asset,
   * in fractions of asset value (0.01 is 1%)
   * @param topOfIndex After ranking all assets in the index, picks only this number from the top.
  */
  constructor(obj = {} as TopOfUniverseQuotesAssessorConfig) {
    let {
      quoteAssessorFactory,
      universe,
      topOfIndex
    } = obj;

    this.quoteAssessorFactory = quoteAssessorFactory;
    this.universe = universe;
    this.topOfIndex = topOfIndex;
  }

  public assessQuotes(instantQuotes: InstantQuotes) {
    this.instant = instantQuotes.instant;
    instantQuotes.quotes.forEach(quote => {
      if (this.universe.isRelatedToUniverse(quote.name)) {
        let quoteAssessor:QuoteAssessor = this.obtainQuoteAssessor(quote.name);
        if (this.universe.worthAssessing(quote.name, instantQuotes.instant, quoteAssessor.minimumAssessmentDuration)) {
          quoteAssessor.assess(instantQuotes);
        }
      }
    });
  }

  private obtainQuoteAssessor(name: string): QuoteAssessor {
    let quoteAssessor:QuoteAssessor = this.quoteAssessors.get(name);
    if (!quoteAssessor) {
      quoteAssessor = this.quoteAssessorFactory(name);
      this.quoteAssessors.set(name, quoteAssessor);
    }
    return quoteAssessor;
  }

  public listTargetPositions(nav: number): TargetPositions {
    let rankedQuoteAssessments = this.rankQuoteAssessments();

    // Only consider the top ranking assets in the universe:
    let targetPositions = new TargetPositions();
    let rank = 0;
    for (var i = 0; i < this.topOfIndex; i++) {
      let rankedQuoteAssessment = rankedQuoteAssessments[i];

      // If the quote is not eligible, then skip it:
      if (!rankedQuoteAssessment.isEligible()) {
        continue;
      }

      // How many parts to buy:
      let parts = rankedQuoteAssessment.partsToBuy(nav);

      // If we cannot buy a single part, then skip it:
      if (parts < 1) {
        continue;
      }

      // Add it to the target positions:
      targetPositions.addTargetPosition(rank++, new Position({
        name: rankedQuoteAssessment.quote.name,
        parts: parts,
        // The parts will actually be bought at open value tomorrow,
        // but today's close value is the best estimation:
        partValue: rankedQuoteAssessment.quote.close
      }))
    }

    return targetPositions;
  }

  /**
   * Returns a sorted list with all quote assessment that belong
   * to the investment universe, ranked by momentum.
   */
  private rankQuoteAssessments(): QuoteAssessor[] {
    let rankedQuoteAssessments: QuoteAssessor[] = [];
    this.quoteAssessors.forEach(quoteAssessor => {
      if (this.universe.belongsToUniverse(quoteAssessor.quote.name, this.instant)) {
        rankedQuoteAssessments.push(quoteAssessor);
      }
    });
    rankedQuoteAssessments.sort((a, b) => {
      return a.compare(b);
    });
    return rankedQuoteAssessments;
  }

}
