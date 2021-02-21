import { Account } from '../core/account';
import { InstantQuotes, Quote } from '../core/quotes';
import { FixedAllocationStrategy, FixedAllocationStrategyErrorDuplicatedAssetName, FixedAllocationStrategyErrorInvalidAllocation, FixedAllocationStrategyErrorInvalidAssetName, FixedAllocationStrategyErrorTotalAllocation } from './strategy.fixed-allocation';


describe('FixedAllocationStrategy', () => {
  it('Can create a new instance', () => {
    expect(
      new FixedAllocationStrategy({fixedAllocations:[
        {assetName: "ASS1", allocation: 20},
        {assetName: "ASS2", allocation: 10}]}))
    .toBeTruthy();
  });

  it('Does not accept null allocations', () => {
    expect(() => {
      new FixedAllocationStrategy({fixedAllocations:[
          {assetName: "ASS1", allocation: null},
          {assetName: "ASS2", allocation: 10},
        ]});
      }).toThrow(new FixedAllocationStrategyErrorInvalidAllocation(
        {assetName: "ASS1", allocation: null}
      ));
  });

  it('Does not accept nameless allocations', () => {
    expect(() => {
      new FixedAllocationStrategy({fixedAllocations:[
          {assetName: "ASS1", allocation: 10},
          {assetName: null, allocation: 10},
        ]});
      }).toThrow(new FixedAllocationStrategyErrorInvalidAssetName(
        {assetName: null, allocation: 10}
      ));
  });

  it('Does not accept allocations over 100', () => {
    expect(() => {
      new FixedAllocationStrategy({fixedAllocations:[
          {assetName: "ASS1", allocation: 50},
          {assetName: "ASS2", allocation: 51},
        ]});
      }).toThrow(new FixedAllocationStrategyErrorTotalAllocation(101));
  });

  it('Does not accept duplicated asset names', () => {
    expect(() => {
      new FixedAllocationStrategy({fixedAllocations:[
          {assetName: "ASS1", allocation: 20},
          {assetName: "ASS2", allocation: 21},
          {assetName: "ASS1", allocation: 23},
        ]});
      }).toThrow(new FixedAllocationStrategyErrorDuplicatedAssetName("ASS1"));
  });

  it('Can perform the initial investment', () => {
    let fixedAllocationStrategy: FixedAllocationStrategy =
      new FixedAllocationStrategy({fixedAllocations:[
        {assetName: "ASS1", allocation: 40},
        {assetName: "ASS2", allocation: 40}]});

    let account: Account = new Account({
      strategy: fixedAllocationStrategy,
      cash:100000
    });

    let instantQuotes = [
      new Quote({name: "ASS1", close: 10}),
      new Quote({name: "ASS2", close: 100}),
    ];
    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 10),
      quotes: instantQuotes
    }));
    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 11),
      quotes: instantQuotes
    }));

    expect(account.cash).toBe(20000);
    expect(account.position("ASS1").parts).toBe(4000);
    expect(account.position("ASS2").parts).toBe(400);
    expect(account.nav()).toBe(100000);
  });
});
