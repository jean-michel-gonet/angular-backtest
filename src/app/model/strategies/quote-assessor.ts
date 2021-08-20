import { InstantQuotes, Quote} from '../core/quotes';

/**
 * A quote assessor is able to assess several characteristics of one single
 * quote to help in strategies that apply regular rebalance.
 */
export interface QuoteAssessor {
  /**
   * The latest quote of the assessed instrument.
   */
  quote: Quote;

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
 * A factory of {@link QuoteAssessor}.
 */
export interface QuoteAssessorFactory {
  /**
   * @param name The name of the quote to assess.
   */
  (name: string): QuoteAssessor;
}