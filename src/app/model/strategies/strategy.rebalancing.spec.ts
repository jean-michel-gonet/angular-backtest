import { BearBull, MarketTiming } from "../core/market-timing";
import { InstantQuotes, Quote } from '../core/quotes';
import { Report } from '../core/reporting';
import { QuotesAssessor, TargetPositions } from './quotes-assessor';
import { RebalancingStrategy } from './strategy.rebalancing';
import { Period, Periodicity } from '../core/period';
import { Account, Position } from '../core/account';

describe("RebalancingStrategy", () => {
  class MockMarketTiming implements MarketTiming {

    public id: string = "id";

    constructor(public _bearBull: BearBull) {}

    public set(bearBull: BearBull) {
      this._bearBull = bearBull;
    }

    bearBull(): BearBull {
      return this._bearBull;
    }

    record(instantQuotes: InstantQuotes): void {}

    doRegister(report: Report): void {}

    startReportingCycle(instant: Date): void {}

    reportTo(report: Report): void {}
  }

  class MockQuotesAssessor implements QuotesAssessor {
    private targetPositions: TargetPositions;

    constructor(targetPositions: TargetPositions = new TargetPositions()) {
      this.targetPositions = targetPositions;
    }
    assessQuotes(instantQuotes: InstantQuotes): void {
      instantQuotes.quotes.forEach(q => {
        let position = this.targetPositions.name(q.name);
        if (position) {
          position.partValue = q.close;
        }
      });
    }

    listTargetPositions(nav: number): TargetPositions {
      return this.targetPositions;
    }

    setTargetPositions(targetPositions: TargetPositions): void {
      this.targetPositions = targetPositions;
    }
  }

  let MON1 = new Date(2021, 8 - 1,  9);
  let TUE1 = new Date(2021, 8 - 1, 10);
  let WED1 = new Date(2021, 8 - 1, 11);  // Position Balance
  let THU1 = new Date(2021, 8 - 1, 12);
  let FRI1 = new Date(2021, 8 - 1, 13);

  let MON2 = new Date(2021, 8 - 1, 16);
  let TUE2 = new Date(2021, 8 - 1, 17);
  let WED2 = new Date(2021, 8 - 1, 18);  // Portfolio rebalance
  let THU2 = new Date(2021, 8 - 1, 19);

  let MON3 = new Date(2021, 8 - 1, 23);
  let TUE3 = new Date(2021, 8 - 1, 24);
  let WED3 = new Date(2021, 8 - 1, 25);  // Position rebalance

  it("Can send quotes to quotes assessor", () => {

  });

  it("Can buy initial investment, and then alternate rebalancing portfolio and positions", () => {
    let targetPositions: TargetPositions;

    let quotesAssessor = new MockQuotesAssessor();

    let strategy = new RebalancingStrategy({
      quotesAssessor: quotesAssessor,
      marketTiming: new MockMarketTiming(BearBull.BULL),
      minimumCash: 1000,
      smallestOperation: 100,
      positionRebalancePeriod: new Period(Periodicity.WEEKLY, 3, 2),
      portfolioRebalancePeriod: new Period(Periodicity.WEEKLY, 3)
    });

    let account = new Account({id:"ACC", cash: 10000, strategy: strategy, positions: []});

    // First aquisition ( and positions rebalance):
    targetPositions = new TargetPositions();
    targetPositions.addTargetPosition(0, new Position({name: "A", parts: 30}));
    targetPositions.addTargetPosition(1, new Position({name: "C", parts: 40}));
    targetPositions.addTargetPosition(2, new Position({name: "D", parts: 50}));
    quotesAssessor.setTargetPositions(targetPositions);

    account.process(new InstantQuotes({instant: MON1, quotes: []}));
    account.process(new InstantQuotes({instant: TUE1, quotes: []}));
    account.process(new InstantQuotes({instant: WED1, quotes: [
      new Quote({name: "A", close: 100}),
      new Quote({name: "B", close: 100}),
      new Quote({name: "C", close: 100}),
      new Quote({name: "D", close: 100}),
      new Quote({name: "E", close: 100}),
    ]}));
    account.process(new InstantQuotes({instant: THU1, quotes: [
      new Quote({name: "A", open: 100, close: 100}),
      new Quote({name: "B", open: 100, close: 100}),
      new Quote({name: "C", open: 100, close: 100}),
      new Quote({name: "D", open: 100, close: 100}),
      new Quote({name: "E", open: 100, close: 100}),
    ]}));

    expect(account.position("A").parts).withContext("Buy all target positions of A").toBe(30);
    expect(account.position("C").parts).withContext("Buy all target positions of C").toBe(40);
    expect(account.position("D").parts).withContext("Not enough money to buy target positions of D").toBe(20);
    expect(account.cash).withContext("Keep cash").toBe(1000);

    // Portfolio rebalance (and change of target):
    targetPositions = new TargetPositions();
    targetPositions.addTargetPosition(0, new Position({name: "B", parts: 70}));
    targetPositions.addTargetPosition(1, new Position({name: "C", parts: 10}));
    targetPositions.addTargetPosition(2, new Position({name: "D", parts: 10}));
    quotesAssessor.setTargetPositions(targetPositions);

    account.process(new InstantQuotes({instant: MON2, quotes: []}));
    account.process(new InstantQuotes({instant: TUE2, quotes: []}));
    account.process(new InstantQuotes({instant: WED2, quotes: [  // Positions rebalance
      new Quote({name: "A", close: 100}),
      new Quote({name: "B", close: 100}),
      new Quote({name: "C", close: 100}),
      new Quote({name: "D", close: 100}),
      new Quote({name: "E", close: 100}),
    ]}));
    account.process(new InstantQuotes({instant: THU2, quotes: [
      new Quote({name: "A", open: 100, close: 100}),
      new Quote({name: "B", open: 100, close: 100}),
      new Quote({name: "C", open: 100, close: 100}),
      new Quote({name: "D", open: 100, close: 100}),
      new Quote({name: "E", open: 100, close: 100}),
    ]}));

    expect(account.position("A").parts).withContext("Sold all positions of A").toBe(0);
    expect(account.position("B").parts).withContext("Was able to buy some positions in B.").toBe(30);
    expect(account.position("C").parts).withContext("Didn't change positions of C").toBe(40);
    expect(account.position("D").parts).withContext("Didn't change positions of D.").toBe(20);
    expect(account.cash).toBe(1000);

    // Position rebalance:
    account.process(new InstantQuotes({instant: MON3, quotes: []}));
    account.process(new InstantQuotes({instant: TUE3, quotes: []}));
    account.process(new InstantQuotes({instant: WED3, quotes: [  // Positions rebalance
      new Quote({name: "A", close: 100}),
      new Quote({name: "B", close: 100}),
      new Quote({name: "C", close: 100}),
      new Quote({name: "D", close: 100}),
      new Quote({name: "E", close: 100}),
    ]}));
    account.process(new InstantQuotes({instant: THU2, quotes: [
      new Quote({name: "A", open: 100, close: 100}),
      new Quote({name: "B", open: 100, close: 100}),
      new Quote({name: "C", open: 100, close: 100}),
      new Quote({name: "D", open: 100, close: 100}),
      new Quote({name: "E", open: 100, close: 100}),
    ]}));

    expect(account.position("A").parts).withContext("Still no positions of A").toBe(0);
    expect(account.position("B").parts).withContext("Was able to buy missing positions of B.").toBe(70);
    expect(account.position("C").parts).withContext("Sold excess positions of C").toBe(10);
    expect(account.position("D").parts).withContext("Sold excess positions of D.").toBe(10);
    expect(account.cash).toBe(1000);

  });

  it("Can keep selling but stop buying when market timing is bearish", () => {
    let targetPositions = new TargetPositions();
    targetPositions.addTargetPosition(0, new Position({name: "A", parts: 10}));
    targetPositions.addTargetPosition(1, new Position({name: "B", parts: 20}));
    targetPositions.addTargetPosition(2, new Position({name: "C", parts: 50}));

    let strategy = new RebalancingStrategy({
      quotesAssessor: new MockQuotesAssessor(targetPositions),
      marketTiming: new MockMarketTiming(BearBull.BEAR),
      minimumCash: 1000,
      smallestOperation: 100,
      positionRebalancePeriod: new Period(Periodicity.WEEKLY, 3)
    });

    let account = new Account({id:"ACC", cash: 10000, strategy: strategy, positions: [
      new Position({name: "A", parts: 30}),
      new Position({name: "C", parts: 30}),
      new Position({name: "D", parts: 30})
    ]});

    // Position rebalance:
    account.process(new InstantQuotes({instant: WED1, quotes: [
      new Quote({name: "A", close: 100}),
      new Quote({name: "B", close: 100}),
      new Quote({name: "C", close: 100}),
      new Quote({name: "D", close: 100}),
    ]}));
    account.process(new InstantQuotes({instant: THU1, quotes: [
      new Quote({name: "A", open: 100, close: 100}),
      new Quote({name: "B", open: 100, close: 100}),
      new Quote({name: "C", open: 100, close: 100}),
      new Quote({name: "D", open: 100, close: 100}),
    ]}));

    expect(account.position("A").parts).withContext("Sells excess of A").toBe(10);
    expect(account.position("B")      ).withContext("Does not buy any B").toBeUndefined();
    expect(account.position("C").parts).withContext("Does not buy more of C").toBe(30);
    expect(account.position("D").parts).withContext("Sells all of D").toBe(0);
  });

  it("Can create buy orders through the settlement days", () => {
    let targetPositions = new TargetPositions();
    targetPositions.addTargetPosition(0, new Position({name: "C", parts: 50}));
    targetPositions.addTargetPosition(1, new Position({name: "D", parts: 50}));

    let strategy = new RebalancingStrategy({
      quotesAssessor: new MockQuotesAssessor(targetPositions),
      marketTiming: new MockMarketTiming(BearBull.BULL),
      minimumCash: 1000,
      smallestOperation: 100,
      positionRebalancePeriod: new Period(Periodicity.WEEKLY, 3)
    });

    let account = new Account({id:"ACC", settlementDays: 1, cash: 0, strategy: strategy, positions: [
      new Position({name: "A", parts: 50}),
      new Position({name: "B", parts: 50})
    ]});

    // Position rebalance:
    account.process(new InstantQuotes({instant: WED1, quotes: [
      new Quote({name: "A", close: 100}),
      new Quote({name: "B", close: 100}),
      new Quote({name: "C", close: 100}),
      new Quote({name: "D", close: 100}),
    ]}));
    account.process(new InstantQuotes({instant: THU1, quotes: [
      new Quote({name: "A", open: 100, close: 100}),
      new Quote({name: "B", open: 100, close: 100}),
      new Quote({name: "C", open: 100, close: 100}),
      new Quote({name: "D", open: 100, close: 100}),
    ]}));
    expect(account.position("A").parts).withContext("Sells all of A").toBe(0);
    expect(account.position("B").parts).withContext("Sells all of B").toBe(0);
    expect(account.position("C")      ).withContext("No C because of settlement time").toBeUndefined();
    expect(account.position("D")      ).withContext("No D because of settlement time").toBeUndefined();
    expect(account.cash).withContext("Cash not yet available because of settlement").toBe(0)

    account.process(new InstantQuotes({instant: FRI1, quotes: [
      new Quote({name: "A", open: 100, close: 100}),
      new Quote({name: "B", open: 100, close: 100}),
      new Quote({name: "C", open: 100, close: 100}),
      new Quote({name: "D", open: 100, close: 100}),
    ]}));
    expect(account.position("A").parts).withContext("No A").toBe(0);
    expect(account.position("B").parts).withContext("No B").toBe(0);
    expect(account.position("C").parts).withContext("Still no C because of settlement time").toBe(0);
    expect(account.position("D").parts).withContext("Still no D because of settlement time").toBe(0);
    expect(account.cash).withContext("Cash has arrived").toBe(1000)

    account.process(new InstantQuotes({instant: MON2, quotes: [
      new Quote({name: "A", open: 100, close: 100}),
      new Quote({name: "B", open: 100, close: 100}),
      new Quote({name: "C", open: 100, close: 100}),
      new Quote({name: "D", open: 100, close: 100}),
    ]}));
    expect(account.position("A").parts).withContext("No A").toBe(0);
    expect(account.position("B").parts).withContext("No B").toBe(0);
    expect(account.position("C").parts).withContext("Bought all of C").toBe(50);
    expect(account.position("D").parts).withContext("Some of D").toBe(40);
    expect(account.cash).withContext("Keep the minimum cash").toBe(1000)
  })
});
