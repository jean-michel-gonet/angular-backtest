import { SuperthonMarketTiming } from "./market-timing.superthon";
import { InstantQuotes } from './core/quotes';
import { Quote } from './core/asset'

describe('SuperthonMarketTiming', () => {
  it('Can create a new instance', () => {
    expect(new SuperthonMarketTiming({
      name: "ISIN1",
      months: 12
    })).toBeTruthy();
  });

  it('Can keep a reasonable history length', () => {
    let superthon = new SuperthonMarketTiming({
      name: "ISIN1",
      months: 12
    });

    for(let n: number = 4000; n > 1; n--) {
      superthon.timeIsGood(new InstantQuotes({
        instant: new Date(today.getFullYear(), today.getMonth(), today.getDate() - n),
        quotes: [
          new Quote({name: "ISIN1", partValue: n})
        ]
      }));
    }
    let todayQuotes = new InstantQuotes({
      instant: today,
      quotes: [
        new Quote({name: "ISIN1", partValue: 0})
      ]
    });
    superthon.timeIsGood(todayQuotes);
    expect(superthon.getHistoryLength()).toBeLessThan(30 * 12);
  });

  let today = new Date();

  it('Can detect a bad timing', () => {
    let superthon = new SuperthonMarketTiming({
      name: "ISIN1",
      months: 12
    });

    for(let n: number = 400; n > 1; n--) {
      superthon.timeIsGood(new InstantQuotes({
        instant: new Date(today.getFullYear(), today.getMonth(), today.getDate() - n),
        quotes: [
          new Quote({name: "ISIN1", partValue: n})
        ]
      }));
    }
    let todayQuotes = new InstantQuotes({
      instant: today,
      quotes: [
        new Quote({name: "ISIN1", partValue: 0})
      ]
    });
    let timeIsGood: number = superthon.timeIsGood(todayQuotes);
    expect(timeIsGood).toBe(-11);
  });

  it('Can detect a good timing', () => {
    let superthon = new SuperthonMarketTiming({
      name: "ISIN1",
      months: 12
    });

    for(let n: number = 400; n > 1; n--) {
      superthon.timeIsGood(new InstantQuotes({
        instant: new Date(today.getFullYear(), today.getMonth(), today.getDate() - n),
        quotes: [
          new Quote({name: "ISIN1", partValue: 400 - n})
        ]
      }));
    }
    let todayQuotes = new InstantQuotes({
      instant: today,
      quotes: [
        new Quote({name: "ISIN1", partValue: 400})
      ]
    });
    let timeIsGood: number = superthon.timeIsGood(todayQuotes);
    expect(timeIsGood).toBe(11);
  });

  it('Can detect a good timing even with missing dates', () => {
    let superthon = new SuperthonMarketTiming({
      name: "ISIN1",
      months: 12
    });

    let days: number = 400;
    while(days > 1) {
      superthon.timeIsGood(new InstantQuotes({
        instant: new Date(today.getFullYear(), today.getMonth(), today.getDate() - days),
        quotes: [
          new Quote({name: "ISIN1", partValue: 400 - days})
        ]}));
      days -= 3 + Math.floor(Math.random() * 4);
    }

    let todayQuotes = new InstantQuotes({
      instant: today,
      quotes: [
        new Quote({name: "ISIN1", partValue: 400})
      ]
    });
    let timeIsGood: number = superthon.timeIsGood(todayQuotes);
    expect(timeIsGood).toBe(11);
  });
});
