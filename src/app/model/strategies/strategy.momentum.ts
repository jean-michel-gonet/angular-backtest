import { GapIndicator } from '../calculations/indicators/gap-indicator';
import { MomentumIndicator } from '../calculations/indicators/momentum-indicator';
import { ExponentialMovingAverage } from '../calculations/moving-average/exponential-moving-average';
import { AverageTrueRange } from '../calculations/statistics/average-true-range';
import { Account } from '../core/account';
import { Periodicity } from '../core/period';
import { InstantQuotes, Quote} from '../core/quotes';
import { Report } from '../core/reporting';
import { Strategy } from '../core/strategy';

/**
 * Assess a quote in a convenient way for Momentum Strategy.
 */
export class QuoteMomentumAssessment {
  public quote: Quote;
  public atr: number;
  public gap: number
  public movingAverage: number;
  public momentum: number;

  private momentumIndicator: MomentumIndicator;
  private exponentialMovingAverage: ExponentialMovingAverage;
  private gapIndicator: GapIndicator;
  private averageTrueRange: AverageTrueRange;

  public constructor(momentumLength: number, averageTrueRangeLength: number, movingAverageLength: number) {
    this.momentumIndicator = new MomentumIndicator({
      numberOfPeriods: momentumLength,
      periodicity: Periodicity.DAILY});
    this.gapIndicator = new GapIndicator({
      numberOfPeriods: momentumLength,
      maximumGapWidth: 1,
      periodicity: Periodicity.DAILY});
    this.averageTrueRange = new AverageTrueRange(averageTrueRangeLength);
    this.exponentialMovingAverage = new ExponentialMovingAverage(movingAverageLength);
  }

  public assess(instant: Date, quote: Quote) {
    this.quote = quote;
    this.momentum = this.momentumIndicator.calculate(instant, quote);
    this.gap = this.gapIndicator.calculate(instant, quote);
    this.atr = this.averageTrueRange.atr(quote);
    this.movingAverage = this.exponentialMovingAverage.movingAverageOf(quote.close);
  }
}

class IMomentumStrategy {
  universe: string;
  index: string;
  tradingDayOfWeek?: number;
}

/**
 * Implements the momentum strategy, as described in "Stocks on the Move"
 * by Andreas Clenow.
 * Rules (quoting freely from chapter 10):
 * - Trade only on wednesdays - Strategy is a long term method to beat the
 *   index. Part of the strategy is to avoid acting too fast. If stock plunges
 *   20%, we don't do a thing unless it's wednesday.
 * - Rank all assets based on volatility adjusted momentum. This means multiply
 *   the annualized exponential regression by the coefficient of determination.
 * - Disqualify an asset if: a) trading below its 100 days moving average, b) has
 *   a recent gap of 15% or more, c) it is not in the 20% top of the ranked list.
 * - Calculate position sizes based on 10 basis points: Account value, times 0.001,
 *   divided by 20 days average true range.
 * - Check index: only open new positions if the index is over its 200 days moving average.
 * - Construct initial portfolio: Start at the top of the list, buying non disqualified
 *   assets until out of cash.
 * - Rebalance portfolio every wednesday: sell any disqualified asset. Buy new assets
 *   with the cash.
 * - Rebalance positions every second wednesday: Reconstruct the initial portfolio,
 *   compare with current, and adjust any non-minor difference.
 */
export class MomentumStrategy implements Strategy {
  public tradingDayOfWeek: number;
  public everyOtherWeek: number;
  private quoteAssessments = new Map<String, QuoteMomentumAssessment>();
  private positions: QuoteMomentumAssessment[] = [];

  constructor(obj = {} as IMomentumStrategy) {
    let {
      universe,
      index,
      tradingDayOfWeek = 3
    } = obj;
    this.tradingDayOfWeek = tradingDayOfWeek;
    this.everyOtherWeek = 0;
  }

  applyStrategy(account: Account, instantQuotes: InstantQuotes): void {
    this.assessQuotes(instantQuotes);
    if (instantQuotes.instant.getDay() == this.tradingDayOfWeek) {
      let rankedQuoteAssessments = this.rankQuoteAssessments();
      if (this.everyOtherWeek > 0) {
        this.rebalancePortfolio(account, rankedQuoteAssessments);
      }
      if (this.everyOtherWeek % 2 == 0) {
        this.rebalancePositions(account, rankedQuoteAssessments);
      }
      this.everyOtherWeek++;
    }
  }

  private assessQuotes(instantQuotes: InstantQuotes) {
    instantQuotes.quotes.forEach(quote => {
      this.assessQuote(instantQuotes.instant, quote);
    });
  }

  private assessQuote(instant: Date, quote: Quote): QuoteMomentumAssessment {
    let quoteAssessment:QuoteMomentumAssessment = this.quoteAssessments.get(quote.name);
    if (!quoteAssessment) {
      quoteAssessment = new QuoteMomentumAssessment(90, 20, 100);
      this.quoteAssessments.set(quote.name, quoteAssessment);
    }
    quoteAssessment.assess(instant, quote);
    return quoteAssessment;
  }

  private rankQuoteAssessments(): QuoteMomentumAssessment[] {
    let rankedQuoteAssessments: QuoteMomentumAssessment[] = [];
    this.quoteAssessments.forEach(quoteAssessment => {
      if (this.belongsToUniverse(quoteAssessment)) {
        rankedQuoteAssessments.push(quoteAssessment);
      }
    });
    rankedQuoteAssessments.sort((a, b) => {
      return a.momentum - b.momentum;
    });
    return rankedQuoteAssessments;
  }

  private belongsToUniverse(quoteAssessment: QuoteMomentumAssessment): boolean {
    return true;
  }


  private rebalancePortfolio(account: Account, rankedQuoteAssessments: QuoteMomentumAssessment[]) {

  }

  private rebalancePositions(account: Account, rankedQuoteAssessments: QuoteMomentumAssessment[]) {

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
