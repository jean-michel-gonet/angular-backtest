import { HistoricalQuotes, Quote, HistoricalValue } from '../../model/core/quotes';
import { ExchangeRateOperation } from './quote-configuration';

/**
 * An utility class to enrich historical quotes with dividends based
 * on comparing the price quotes with total return quotes.
 * @class {EnrichWithTotalReturn}
 */
export class ApplyExchangeRate {
  private exchangeRates: HistoricalValue[];
  private exchangeRateIndex: number;
  private operate: (x: number, y: number) => number;

  /**
   * Class constructor.
   * @param {string} name The name of the exchange rates source
   * @param {HistoricalQuotes} historicalQuotes Historical quotes containing
   * the exchange rates to apply.
   */
  constructor(operation: ExchangeRateOperation, name: string, historicalQuotes: HistoricalQuotes) {
    this.exchangeRates = [];
    this.exchangeRateIndex = 0;
    historicalQuotes.forEachDate(instantQuotes => {
      let quote: Quote = instantQuotes.quote(name);
      if (quote) {
        this.exchangeRates.push({
          instant: instantQuotes.instant,
          value: quote.close
        });
      }
    });
    this.operate = this.makeOperation(operation);
  }

  private makeOperation(operation: ExchangeRateOperation): ((x: number, y: number) => number) {
    switch(operation) {
      case ExchangeRateOperation.DIVIDE:
        return ((x: number, y: number) => {
          if (x) {
            return x / y;
          } else {
            return x;
          }
        });
      case ExchangeRateOperation.MULTIPLY:
        return ((x: number, y: number) => {
          if (x) {
            return x * y;
          } else {
            return x;
          }
        });
      default:
        throw new Error("ApplyExchangeRate: Operation " + operation + " is not supported.");
    }
  }

  /**
   * Enrich the provided historical quotes with the dividends.
   * @param {string} name The name of the instrument to enrich.
   * @param {HistoricalQuotes} priceHistoricalQuotes The quotes containing
   * the instrument to apply exchange rate.
   */
  public applyTo(name: string, priceHistoricalQuotes: HistoricalQuotes): void  {
    priceHistoricalQuotes.forEachDate(priceInstantQuotes => {
      let instant:Date = priceInstantQuotes.instant;

      // If current instant is within total return available data:
      let priceQuote: Quote = priceInstantQuotes.quote(name);

        // If the quote to enrich is present:
      if (priceQuote) {
        this.applyExchangeRate(instant, priceQuote);
      }
    });
  }

  private applyExchangeRate(instant: Date, priceQuote: Quote): void {
    let exchangeRate: HistoricalValue = this.exchangeRates[this.exchangeRateIndex];

    // Looks for a matching date:
    while(exchangeRate.instant.valueOf() < instant.valueOf()
            && this.exchangeRateIndex < this.exchangeRates.length - 1) {
        exchangeRate = this.exchangeRates[++this.exchangeRateIndex];
    }

    // Oops, we went too far:
    if (exchangeRate.instant.valueOf() > instant.valueOf()
            && this.exchangeRateIndex > 0) {
        exchangeRate = this.exchangeRates[--this.exchangeRateIndex];
    }

    // Make the calculation:
    priceQuote.close = this.operate(priceQuote.close, exchangeRate.value);
    priceQuote.open = this.operate(priceQuote.open, exchangeRate.value);
    priceQuote.high = this.operate(priceQuote.high, exchangeRate.value);
    priceQuote.low = this.operate(priceQuote.low, exchangeRate.value);
    priceQuote.dividend = this.operate(priceQuote.dividend, exchangeRate.value);
  }
}
