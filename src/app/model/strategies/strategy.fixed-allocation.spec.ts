import { Account, Position } from '../core/account';
import { Periodicity } from '../core/period';
import { InstantQuotes, Quote } from '../core/quotes';
import { FixedAllocationStrategy, FixedAllocationStrategyErrorDuplicatedAssetName, FixedAllocationStrategyErrorInvalidAllocation, FixedAllocationStrategyErrorInvalidAssetName, FixedAllocationStrategyErrorTotalAllocation } from './strategy.fixed-allocation';


describe('FixedAllocationStrategy', () => {
  it('Can create a new instance', () => {
    let strategy = new FixedAllocationStrategy({fixedAllocations:[
      {assetName: "ASS1", allocation: 20},
      {assetName: "ASS2", allocation: 10}]});

    expect(strategy).toBeTruthy();
    expect(strategy.listQuotesOfInterest()).toEqual(["ASS1", "ASS2"]);
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

  it('Can perform rebalancing', () => {
    let fixedAllocationStrategy: FixedAllocationStrategy =
      new FixedAllocationStrategy({
        fixedAllocations:[
          {assetName: "ASS1", allocation: 20},
          {assetName: "ASS2", allocation: 30},
          {assetName: "ASS3", allocation: 20}]});

    let account: Account = new Account({
      strategy: fixedAllocationStrategy,
      positions: [
        new Position({name: "ASS1", parts: 20}),
        new Position({name: "ASS2", parts: 30}),
        new Position({name: "ASS3", parts: 20}),
      ],
      cash:3000
    });

    let instantQuotes = [
      new Quote({name: "ASS1", close: 120}),
      new Quote({name: "ASS2", close: 80}),
      new Quote({name: "ASS3", close: 100}),
    ];
    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 10),
      quotes: instantQuotes
    }));
    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 11),
      quotes: instantQuotes
    }));
    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 12),
      quotes: instantQuotes
    }));

    expect(account.position("ASS1").parts).toBe(16);
    expect(account.position("ASS2").parts).toBe(37);
    expect(account.position("ASS3").parts).toBe(20);
  });

  it('Can perform rebalancing periodically', () => {
    let fixedAllocationStrategy: FixedAllocationStrategy =
      new FixedAllocationStrategy({
        fixedAllocations:[
          {assetName: "ASS1", allocation: 20},
          {assetName: "ASS2", allocation: 30},
          {assetName: "ASS3", allocation: 20}],
        periodicity: Periodicity.MONTHLY});

    let account: Account = new Account({
      strategy: fixedAllocationStrategy,
      cash:10000
    });

    // Immediately performs the first investment:
    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 1),
      quotes: [
        new Quote({name: "ASS1", close: 100}),
        new Quote({name: "ASS2", close: 100}),
        new Quote({name: "ASS3", close: 100})]
    }));

    // No rebalance before the next month:
    let instantQuotes = [
      new Quote({name: "ASS1", close: 120}),
      new Quote({name: "ASS2", close: 80}),
      new Quote({name: "ASS3", close: 100}),
    ];
    for (var n = 2; n <= 30; n++) {
      account.process(new InstantQuotes({
        instant: new Date(2010, 10, n),
        quotes: instantQuotes
      }));
      expect(account.position("ASS1").parts).toBe(20);
      expect(account.position("ASS2").parts).toBe(30);
      expect(account.position("ASS3").parts).toBe(20);
    }

    // Rebalance the first day of the next month:
    account.process(new InstantQuotes({
      instant: new Date(2010, 11, 1),
      quotes: instantQuotes
    }));
    account.process(new InstantQuotes({
      instant: new Date(2010, 11, 2),
      quotes: instantQuotes
    }));
    expect(account.position("ASS1").parts).toBe(17);
    expect(account.position("ASS2").parts).toBe(38);
    expect(account.position("ASS3").parts).toBe(20);
  });

  it('Can differ due rebalancing when quotes are not available', () => {
    let fixedAllocationStrategy: FixedAllocationStrategy =
      new FixedAllocationStrategy({
        fixedAllocations:[
          {assetName: "ASS1", allocation: 20},
          {assetName: "ASS2", allocation: 30},
          {assetName: "ASS3", allocation: 20}],
        periodicity: Periodicity.MONTHLY});

    let account: Account = new Account({
      strategy: fixedAllocationStrategy,
      cash:10000
    });

    // Immediately performs the first investment of ASS1 and ASS3:
    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 1),
      quotes: [
        new Quote({name: "ASS1", close: 100}),
        new Quote({name: "ASS3", close: 100})]
    }));

    // Next day, performs the initial investment of ASS2:
    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 2),
      quotes: [
        new Quote({name: "ASS1", close: 120}),
        new Quote({name: "ASS2", close: 100}),
        new Quote({name: "ASS3", close: 100})]
    }));

    expect(account.position("ASS1").parts).toBe(20);
    expect(account.position("ASS2")).toBeFalsy();
    expect(account.position("ASS3").parts).toBe(20);

    // No rebalance before the next month:
    for (var n = 3; n <= 30; n++) {
      account.process(new InstantQuotes({
        instant: new Date(2010, 10, n),
        quotes: [
          new Quote({name: "ASS1", close: 120}),
          new Quote({name: "ASS2", close: 80}),
          new Quote({name: "ASS3", close: 100})]
      }));
      expect(account.position("ASS1").parts).toBe(20);
      expect(account.position("ASS2").parts).toBe(30);
      expect(account.position("ASS3").parts).toBe(20);
    }
  });

  it('Can perform rebalancing only if drifting is above threshold', () => {
    let fixedAllocationStrategy: FixedAllocationStrategy =
      new FixedAllocationStrategy({
        fixedAllocations:[
          {assetName: "ASS1", allocation: 20},
          {assetName: "ASS2", allocation: 30},
          {assetName: "ASS3", allocation: 20}],
        threshold: 20});

    let account: Account = new Account({
      strategy: fixedAllocationStrategy,
      cash:10000
    });

    // Immediately performs the first investment:
    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 1),
      quotes: [
        new Quote({name: "ASS1", close: 100}),
        new Quote({name: "ASS2", close: 100}),
        new Quote({name: "ASS3", close: 100})]
    }));

    // No rebalance until drifting goes above threshold:
    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 2),
      quotes: [
        new Quote({name: "ASS1", close: 110}),
        new Quote({name: "ASS2", close: 90}),
        new Quote({name: "ASS3", close: 100})]
    }));
    expect(account.position("ASS1").parts).toBe(20);
    expect(account.position("ASS2").parts).toBe(30);
    expect(account.position("ASS3").parts).toBe(20);

    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 3),
      quotes: [
        new Quote({name: "ASS1", close: 118}),
        new Quote({name: "ASS2", close: 81}),
        new Quote({name: "ASS3", close: 100})]
    }));
    expect(account.position("ASS1").parts).toBe(20);
    expect(account.position("ASS2").parts).toBe(30);
    expect(account.position("ASS3").parts).toBe(20);

    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 4),
      quotes: [
        new Quote({name: "ASS1", close: 120}),
        new Quote({name: "ASS2", close: 78}),
        new Quote({name: "ASS3", close: 100})]
    }));
    expect(account.position("ASS1").parts).toBe(20);
    expect(account.position("ASS2").parts).toBe(30);
    expect(account.position("ASS3").parts).toBe(20);

    account.process(new InstantQuotes({
      instant: new Date(2010, 10, 5),
      quotes: [
        new Quote({name: "ASS1", close: 120}),
        new Quote({name: "ASS2", close: 78}),
        new Quote({name: "ASS3", close: 100})]
    }));
    expect(account.position("ASS1").parts).toBe(16);
    expect(account.position("ASS2").parts).toBe(38);
    expect(account.position("ASS3").parts).toBe(20);

  });

});
