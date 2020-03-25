import { HistoricalValue, HistoricalQuotes, Quote } from '../model/core/quotes';

/**
 * A utility class to enrich historical quotes with dividends.
 * @class{EnrichWithDividends}
 */
export class EnrichWithDividends {
  private dividendIndex: number;

  /**
   * Class constructor.
   * @param {HistoricalValue[]} directDividends The dividend data.
   */
  constructor(private directDividends: HistoricalValue[]) {
    this.dividendIndex = 0;
  }

  /**
   * Enrich the provided historical quotes with the dividends.
   * @param {string} name The name of the instrument to enrich.
   * @param {HistoricalQuotes} historicalQuotes The quotes containing
   * the instrument to enrich.
   */
  public enrich(name:string, historicalQuotes: HistoricalQuotes): void {
    historicalQuotes.forEachDate(instantQuotes => {
      let dividendEntry: HistoricalValue = this.directDividends[this.dividendIndex];
      if (dividendEntry) {
        if (instantQuotes.instant.valueOf() >= dividendEntry.instant.valueOf()) {
          let quote = instantQuotes.quote(name);
          quote.dividend = dividendEntry.value;
          this.dividendIndex++;
        }
      }
    });
  }
}

/**
 * An utility class to enrich historical quotes with dividends based
 * on comparing the price quotes with total return quotes.
 * @class {EnrichWithTotalReturn}
 */
export class EnrichWithTotalReturn {
  private totalReturn: HistoricalValue[];
  private initialPriceValue: number;
  private initialTotalReturnValue: number;
  private distributedDividends: number;

  /**
   * Class constructor.
   * @param {string} name The name of the total return instrument.
   * @param {HistoricalQuotes} historicalQuotes Historical quotes containing
   * the total return of the specified instrument.
   */
  constructor(totalReturnName: string, totalReturnHistoricalQuotes: HistoricalQuotes) {
    this.totalReturn = [];
    totalReturnHistoricalQuotes.forEachDate(instantQuotes => {
      let quote: Quote = instantQuotes.quote(totalReturnName);
      if (quote) {
        this.totalReturn.push({
          instant: instantQuotes.instant,
          value: quote.close
        });
      }
    });
  }

  /**
   * Enrich the provided historical quotes with the dividends.
   * @param {string} name The name of the instrument to enrich.
   * @param {HistoricalQuotes} priceHistoricalQuotes The quotes containing
   * the instrument to enrich.
   */
  public enrich(name: string, priceHistoricalQuotes: HistoricalQuotes): void  {
    let totalReturnIndex: number = 0;
    priceHistoricalQuotes.forEachDate(priceInstantQuotes => {
        let priceQuote: Quote = priceInstantQuotes.quote(name);
        if (priceQuote) {

          // Find the corresponding entry in the total return values:
          let totalReturnEntry: HistoricalValue;
          do {
            totalReturnEntry = this.totalReturn[totalReturnIndex++];
          } while (priceInstantQuotes.instant.valueOf() < totalReturnEntry.instant.valueOf());

          // If we've found matching dates, we can make a calculation:
          if (priceInstantQuotes.instant.valueOf() == totalReturnEntry.instant.valueOf()) {
            priceQuote.dividend = this.computeDividend(priceQuote.close, totalReturnEntry.value);
          }
        }
    });
  }

  /**
   * Calculates the dividend by comparing the increase of the
   * total return index with the increase of the price index.
   * Uses the following formula:
   * <pre>
   * (TR(n) - TR(n-1)) / TR(n)  = (PR(n) - PR(n-1) + D(n)) / PR(n-1)
   * </pre>
   */
  private computeDividend(priceValue: number, totalReturnValue: number): number {
    let dividends:number = 0;

    if (this.initialPriceValue) {
      // To avoid accumulating rounding error at each dividend distribution,
      // calculates the total dividends since inception date:
      let tr = Math.round(10000 * (totalReturnValue  - this.initialTotalReturnValue) / totalReturnValue);
      let pr = Math.round(10000 * (priceValue - this.initialPriceValue) / priceValue);
      let totalDividends = (tr - pr) / 100;

      // And compares the total dividends with the distributed dividends:
      dividends = totalDividends - this.distributedDividends;
      this.distributedDividends = totalDividends;
    }
    else {
      this.initialPriceValue = priceValue;
      this.initialTotalReturnValue = totalReturnValue;
      this.distributedDividends = 0;
    }

    return dividends;
  }
}
