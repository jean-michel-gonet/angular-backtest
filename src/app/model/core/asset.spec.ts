import { Position, Quote, Candlestick, CandlestickType } from './asset';

describe('Candlestick', () => {
  it('Can be green when open price is lesser than close price', () =>{
    let candlestick: Candlestick = new Candlestick({
      open: 10,
      close: 20
    });
    expect(candlestick.type()).toBe(CandlestickType.GREEN);
  });
  it('Can be green when open and close price are equal', () =>{
    let candlestick: Candlestick = new Candlestick({
      open: 10,
      close: 10
    });
    expect(candlestick.type()).toBe(CandlestickType.GREEN);
  });
  it('Can be red when open price is greater than close price', () =>{
    let candlestick: Candlestick = new Candlestick({
      open: 20,
      close: 10
    });
    expect(candlestick.type()).toBe(CandlestickType.RED);
  });

  it('Can merge with another candlestick', () =>{
    let candlestick1 = new Candlestick({
      open: 10,
      high: 23,
      low: 9,
      close: 20
    });
    let candlestick2 = new Candlestick({
      open: 19,
      high: 25,
      low: 15,
      close: 22
    });
    let candlestick = candlestick1.merge(candlestick2);
    expect(candlestick).toEqual(new Candlestick({
      open: 10,
      high: 25,
      low: 9,
      close: 22
    }));
  });
});

describe('Position', () => {
  it('Can calculate the NAV', () => {
    let position = new Position({
      name: "XX",
      partValue: 1.5,
      parts: 3
    });
    expect(position.nav()).toBe(4.5);
  });

  it('Can update its part value', () => {
    let position = new Position({
      name: "XX",
      parts: 6
    });

    position.update(new Quote({name: "XX", close: 1.5}));
    expect(position.nav()).toBe(9);
  });
});

describe('Quote', () => {
  it('Can create a new instance', () => {
    expect(new Quote({
      name: "XX",
      close: 1.5,
      spread: 0.01,
      dividend: 0.01
    })).toBeTruthy();
  });
});
