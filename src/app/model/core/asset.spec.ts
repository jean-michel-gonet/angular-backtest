import { Asset, Position, Quote } from './asset';

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

    position.update(new Quote({name: "XX", partValue: 1.5}));
    expect(position.nav()).toBe(9);
  });
});

describe('Quote', () => {
  it('Can create a new instance', () => {
    expect(new Quote({
      name: "XX",
      partValue: 1.5,
      spread: 0.01,
      dividend: 0.01
    })).toBeTruthy();
  });
});

describe('Asset', () => {
  it('Can create a new instance', () => {
    expect(new Asset({
      name: "XX",
      partValue: 1.0})).toBeTruthy();
  });
});
