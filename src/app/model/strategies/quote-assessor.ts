import { InstantQuotes, Quote} from '../core/quotes';
import { Reporter } from '../core/reporting';
import { BackTestingError } from '../utils/back-testing-error';

/**
 * A quote assessor is able to assess several characteristics of one single
 * quote to help in strategies that apply regular rebalance.
 */
export interface QuoteAssessor extends Reporter {
  /**
   * The name of the quote being assessed.
   */
  name: string;

  /**
   * The latest quote of the assessed instrument.
   */
  quote: Quote;

  /**
   * Number of days a quote has to be assessed before assessment can be meaningful.
   * Implementing classes are probably using a mix of moving averages and the like.
   * They use this property to ensure that a quote is fully assessed before it enters
   * in the investment universe.
   */
  minimumAssessmentDuration: number;

  /**
   * Provides data to assess the instrument.
   * @param instantQuotes All available quotes at a particular instant. The
   * quote of the instrument to assess should be among them.
   */
  assess(instantQuotes: InstantQuotes): void;

  /**
   * Compares this assessor to another assessor of the same type.
   * This method is used to rank quote assessors in a list, from the most
   * attractive to the least attractive.
   * @param otherQuoteAssessor Another instance of the same type of quote assessor.
   * @return A number representing the comparison.
   */
  compare(otherQuoteAssessor: QuoteAssessor): number;

  /**
   * Is the assessed quote eligible for investment, at this moment?
   * The moment is the instant specified at the last call to {@link assess}.
   * @return {code true} If the quote is eligible.
   */
  isEligible(): boolean;

  /**
   * Number of parts to buy, given the portfolio's nav.
   * @param nav Portfolio's nav.
   * @return The number of parts to buy.
   */
  partsToBuy(nav: number): number;
}

/**
 * Common ancestor for errors related to quote assessors.
 */
export class QuoteAssessorError extends BackTestingError  {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Quote name is crucial element of quote assessor.
 */
export class NoNameSuppliedQuoteAssessorError extends QuoteAssessorError {
  constructor() {
    super("No name supplied to assessor");
  }
}

/**
 * A factory of {@link QuoteAssessor}.
 */
export interface QuoteAssessorFactory {
  /**
   * @param name The name of the quote to assess.
   */
  (name: string): QuoteAssessor;
}
