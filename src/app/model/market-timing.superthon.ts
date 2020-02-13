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
    let distance:Date = instantQuotes.instant;
    let historyIndex: number;
    for (historyIndex = this.history.length - 1; historyIndex >= 0; historyIndex--) {
      if (this.history[historyIndex].instant.valueOf() > distance.valueOf()) {
        continue;
      }
      last12Quotes.push(this.history[historyIndex]);
      if (last12Quotes.length >= this.months) {
        break;
      }
      distance = new Date(distance.getFullYear(), distance.getMonth(), distance.getDate() - 30);
    }

    if (historyIndex > 0) {
      this.history.splice(0, historyIndex - 1);
    }

    let howGood = 0;
    let lastQuote = last12Quotes[0];
    for(let n: number = 1; n < last12Quotes.length; n++) {
      let quote: number = last12Quotes[n].quote;
      if (quote > lastQuote.quote) {
        howGood--;
      } else {
        howGood++;
      }
      lastQuote = last12Quotes[n];
    }

    return howGood;
  }

  public getHistoryLength():number {
    return this.history.length;
  }
}
