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

    let stock = new Stock({
      time: new Date(),
      assetsOfInterest: [
        new AssetOfInterest({isin: "XX", partValue: 1.5}),
        new AssetOfInterest({isin: "YY", partValue: 3.0})
      ]
    });
    position.update(stock);
    expect(position.nav()).toBe(9);
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
