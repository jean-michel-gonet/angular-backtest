import { HistoricalValue, HistoricalQuotes } from './quotes';

/**
 * A utility class to enrich historical quotes with dividends.
 * @class{EnrichWithDividends}
 */
export class EnrichWithDividends {
  private dividendIndex: number;

  constructor(private name:string, private directDividends: HistoricalValue[]) {
    this.dividendIndex = 0;
  }

  public enrich(historicalQuotes: HistoricalQuotes): void {
    historicalQuotes.forEachDate(instantQuotes => {
      let dividendEntry: HistoricalValue = this.directDividends[this.dividendIndex];
      if (dividendEntry) {
        if (instantQuotes.instant.valueOf() >= dividendEntry.instant.valueOf()) {
          let quote = instantQuotes.quote(this.name);
          quote.dividend = dividendEntry.value;
          this.dividendIndex++;
        }
      }
    });
  }
}
