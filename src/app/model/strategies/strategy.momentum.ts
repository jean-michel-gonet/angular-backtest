/**
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
