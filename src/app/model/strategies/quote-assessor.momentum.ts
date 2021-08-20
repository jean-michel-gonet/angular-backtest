import { GapIndicator } from '../calculations/indicators/gap-indicator';
import { MomentumIndicator } from '../calculations/indicators/momentum-indicator';
import { ExponentialMovingAverage } from '../calculations/moving-average/exponential-moving-average';
import { AverageTrueRange } from '../calculations/statistics/average-true-range';
import { Periodicity } from '../core/period';
import { InstantQuotes, Quote} from '../core/quotes';
import { QuoteAssessor } from './quote-assessor';

/**
 * Configuration for {@link MomentumQuoteAssessor}.
 */
interface MomentumQuoteAssessorConfig {
  /** Name of the quote to assess. */
  name: string;

  /** Number of days to assess momentum.*/
  momentumDistance?: number;

  /** Maximum acceptable gap. 0.15 means 15 percent.*/
  maximumAcceptableGap?: number;

  /** Numer of days to assess gap.*/
  gapDistance?: number;

  /** Number of days to assess average true range.*/
  averageTrueRangeDistance?: number;

  /** Maximum ATR per position, in fractions of the NAV (0.01 is 1%). */
  maximumAtrPerPosition?: number;

  /** Number of days to assess quote's moving average. */
  movingAverageDistance?: number;
}

/**
 * Implements a Quote Assessor appropriate for the momentum strategy,
 * as described in "Stocks on the Move" by Andreas Clenow.
 * Rules implemented in the assessor (quoting freely from chapter 10):
 * <ul>
 *   <li>Rank all assets based on volatility adjusted momentum. This means multiply
 *   the annualized exponential regression by the coefficient of determination.
 *   (implemented in {@link #compare}).</li>
 *   <li>Disqualify an asset if: a) trading below its 100 days moving average, b) has
 *   a recent gap of 15% or more (implemented in {@link #isEligible}).
 *   <li>Calculate position sizes based on 10 basis points: Account value, times 0.001,
 *   divided by 20 days average true range (implemented in {@link #partsToBuy}).
 * </ul>
 */
export class MomentumQuoteAssessor implements QuoteAssessor {
  public name: string;
  public quote: Quote;
  public atr: number;
  public gap: number
  public movingAverage: number;
  public momentum: number;

  maximumAcceptableGap: number;
  maximumAtrPerPosition: number;

  private momentumIndicator: MomentumIndicator;
  private exponentialMovingAverage: ExponentialMovingAverage;
  private gapIndicator: GapIndicator;
  private averageTrueRange: AverageTrueRange;

  /**
   * Class constructor
   * @param obj To configure this assessor.
   */
  public constructor(obj = {} as MomentumQuoteAssessorConfig) {
    let {
      name,
      momentumDistance = 90,
      maximumAcceptableGap = 0.15,
      gapDistance = 90,
      averageTrueRangeDistance = 20,
      maximumAtrPerPosition = 0.04,
      movingAverageDistance = 100
    } = obj;
    this.name = name;

    this.momentumIndicator = new MomentumIndicator({
      numberOfPeriods: momentumDistance,
      periodicity: Periodicity.DAILY});

    this.gapIndicator = new GapIndicator({
      numberOfPeriods: gapDistance,
      maximumGapWidth: 1,
      periodicity: Periodicity.DAILY});

    this.averageTrueRange = new AverageTrueRange(averageTrueRangeDistance);
    this.exponentialMovingAverage = new ExponentialMovingAverage(movingAverageDistance);

    this.maximumAcceptableGap = maximumAcceptableGap;
    this.maximumAtrPerPosition = maximumAtrPerPosition;
  }

  public assess(instantQuotes: InstantQuotes) {
    let instant = instantQuotes.instant;
    let quote = instantQuotes.quote(this.name);
    if (quote) {
      this.momentum = this.momentumIndicator.calculate(instant, quote);
      this.gap = this.gapIndicator.calculate(instant, quote);
      this.atr = this.averageTrueRange.atr(quote);
      this.movingAverage = this.exponentialMovingAverage.movingAverageOf(quote.close);
      this.quote = quote;
    }
  }

  isEligible(): boolean {
    // If there is a recent gap, then it is not eligible:
    if (this.gap > this.maximumAcceptableGap) {
      return false;
    }

    // If quote is below its moving average, then it is not eligible:.
    if (this.movingAverage < this.quote.close) {
      return false;
    }

    // Ok, it is eligible:
    return true;
  }

  /**
   * Average True Range of one position should not represent more
   * than X% of the nav.
   */
  partsToBuy(nav: number): number {
    return nav * this.maximumAtrPerPosition / this.atr;
  }

  /**
   * Compare this quote assesso with another by their momentums.
   */
  compare(otherQuoteAssessor: MomentumQuoteAssessor): number {
    return this.momentum - otherQuoteAssessor.momentum;
  }
}
