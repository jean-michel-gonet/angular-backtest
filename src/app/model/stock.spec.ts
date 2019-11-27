import { Stock } from './stock';
import { AssetOfInterest } from './asset';

describe('Stock', () => {
  it('should create an instance', () => {
    expect(new Stock({
      time: new Date(),
      assetsOfInterest: [
        new AssetOfInterest(),
        new AssetOfInterest()
      ]})).toBeTruthy();
  });
});
