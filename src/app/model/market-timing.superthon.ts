import { MarketTiming } from './core/market-timing';
import { InstantQuotes } from './core/quotes';

class ISuperthonMarketTiming {
  name: string;
  months?: number;
}

class History {
  instant: Date;
  quote: number;
}

export class SuperthonMarketTiming implements MarketTiming {
  private name: string;
  private months: number;

  private history: History[] = [];

  constructor(obj = {} as ISuperthonMarketTiming){
    let {
      name = "",
      months = 10
    } = obj;
    this.name = name;
    this.months = months;
  }

  timeIsGood(instantQuotes: InstantQuotes): number {
    this.history.push({
      instant: instantQuotes.instant,
      quote: instantQuotes.quote(this.name).partValue
    });

    let last12Quotes: History[] = [];
    let distance:number = instantQuotes.instant.valueOf();
    for (let n:number = this.history.length - 1; n >= 0; n--) {
      if (this.history[n].instant.valueOf() > distance) {
        continue;
      }
      last12Quotes.push(this.history[n]);
      if (last12Quotes.length >= this.months) {
        break;
      }
      distance -= 30;
    }

    let howGood = 0;
    let lastQuote = last12Quotes[0];
    for(let n: number = 1; n < last12Quotes.length; n++) {
      let quote: number = last12Quotes[n].quote;
      if (quote > lastQuote.quote) {
        howGood++;
      } else {
        howGood--;
      }
      lastQuote = last12Quotes[n];
    }

    return howGood;
  }
}
