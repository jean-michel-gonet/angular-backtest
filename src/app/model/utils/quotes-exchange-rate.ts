import { HistoricalQuotes, Quote, HistoricalValue } from '../core/quotes';
import { ExchageRateOperation } from 'src/app/services/quotes/quotes-configuration.service';

/**
 * An utility class to enrich historical quotes with dividends based
 * on comparing the price quotes with total return quotes.
 * @class {EnrichWithTotalReturn}
 */
export class ApplyExchangeRate {
  private exchangeRate: HistoricalValue[];
  private lastExchangeRateInstant: number;
  private exchangeRateIndex: number;
  private operate: (x: number, y: number) => number;

  /**
   * Class constructor.
   * @param {string} name The name of the exchange rates source
   * @param {HistoricalQuotes} historicalQuotes Historical quotes containing
   * the exchange rates to apply.
   */
  constructor(operation: ExchageRateOperation, name: string, historicalQuotes: HistoricalQuotes) {
    this.exchangeRate = [];
    this.exchangeRateIndex = 0;
    historicalQuotes.forEachDate(instantQuotes => {
      let quote: Quote = instantQuotes.quote(name);
      if (quote) {
        this.exchangeRate.push({
          instant: instantQuotes.instant,
          value: quote.close
        });
        this.lastExchangeRateInstant = instantQuotes.instant.valueOf();
      }
    });

    switch(operation) {
      case ExchageRateOperation.DIVIDE:
        this.operate = ((x: number, y: number) => {
          return x / y;
        });
      case ExchageRateOperation.MULTIPLY:
        this.operate = ((x: number, y: number) => {
          return x * y;
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
      if ( instant.valueOf() <= this.lastExchangeRateInstant) {
        let priceQuote: Quote = priceInstantQuotes.quote(name);

        // If the quote to enrich is present:
        if (priceQuote) {
          this.applyExchangeRate(instant, priceQuote);
        }
      }
    });
  }

  private applyExchangeRate(instant: Date, priceQuote: Quote): void {

    // Looks for a matching date:
    let exchangeRateEntry: HistoricalValue = this.exchangeRate[this.exchangeRateIndex];
    while(exchangeRateEntry.instant.valueOf() < instant.valueOf()) {
      exchangeRateEntry = this.exchangeRate[this.exchangeRateIndex++]
    }

    // Make the calculation:
    priceQuote.close = this.operate(priceQuote.close, exchangeRateEntry.value);
    priceQuote.open = this.operate(priceQuote.open, exchangeRateEntry.value);
    priceQuote.high = this.operate(priceQuote.high, exchangeRateEntry.value);
    priceQuote.low = this.operate(priceQuote.low, exchangeRateEntry.value);
    if (priceQuote.dividend) {
      priceQuote.dividend = this.operate(priceQuote.dividend, exchangeRateEntry.value);
    }
  }
}
