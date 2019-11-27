import { Asset, Position, AssetOfInterest } from './asset';
import { Stock } from './stock';

describe('Position', () => {
  it('Can calculate the NAV', () => {
    let position = new Position({
      isin: "XX",
      name: "name",
      partValue: 1.5,
      parts: 3
    });
    expect(position.nav()).toBe(4.5);
  });

  it('Can update its part value', () => {
    let position = new Position({
      isin: "XX",
      parts: 6
    });

    position.update(new AssetOfInterest({isin: "XX", partValue: 1.5}));
    expect(position.nav()).toBe(9);
  });
});

describe('AssetOfInterest', () => {
  it('Can create a new instance', () => {
    expect(new AssetOfInterest({
      isin: "XX",
      name: "name",
      partValue: 1.5,
      spread: 0.01,
      dividend: 0.01
    })).toBeTruthy();
  });
});

describe('Asset', () => {
  it('Can create a new instance', () => {
    expect(new Asset({
      isin: "XX",
      name:"name",
      partValue: 1.0})).toBeTruthy();
  });
});
