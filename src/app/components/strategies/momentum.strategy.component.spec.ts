import { Component, ViewChild, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { Periodicity } from 'src/app/model/core/period';
import { MomentumQuoteAssessor } from 'src/app/model/strategies/quote-assessor.momentum';
import { TopOfUniverseQuotesAssessor } from 'src/app/model/strategies/quotes-assessor.top-of-universe';
import { RebalancingStrategy } from 'src/app/model/strategies/strategy.rebalancing';
import { TransferToComponent } from '../accounts/transfer-to.component';
import { MarketTimingComponent } from '../markettiming/market-timing.component';
import { RegularTransferComponent } from '../transfer/regular-transfer.component';
import { MomentumStrategyComponent } from './momentum.strategy.component';
import { StrategyComponent } from './strategy.component';

@Component({
  selector: 'parent',
  template: 'to-be-defined'
})
class TestWrapperComponent {
  @ViewChild(MomentumStrategyComponent, {static: true})
  public strategyComponent: MomentumStrategyComponent;
}

describe('MomentumStrategyComponent', () => {
  let component: MomentumStrategyComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        TestWrapperComponent,
        MomentumStrategyComponent,
        MarketTimingComponent,
        RegularTransferComponent,
        StrategyComponent,
        TransferToComponent,
      ]
    });
  }));

  it('Can instantiate a Fixed Allocation Strategy without transfer', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
            <strategy>
              <momentum momentumDistance = "100"
                        maximumAcceptableGap = "0.15"
                        gapDistance = "100"
                        averageTrueRangeDistance = "20"
                        maximumAtrPerPosition = "0.04"
                        movingAverageDistance = "200"
                        topOfIndex = "20"
                        tradingDayOfTheWeek = "3"
                        smallestOperation = "400"
                        universeName = "SP500_UNIVERSE"
                        minimumCash = "11000">
                <market-timing>
                  <candle-filter></candle-filter>
                </market-timing>
              </momentum>
            </strategy>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.strategyComponent;
      expect(component).toBeTruthy();

      let rebalancingStrategy: RebalancingStrategy = component.asStrategy();
      expect(rebalancingStrategy).toBeTruthy();

      expect(rebalancingStrategy.minimumCash).withContext("minimumCash").toBe(11000);
      expect(rebalancingStrategy.smallestOperation).withContext("smallestOperation").toBe(400);

      expect(rebalancingStrategy.portfolioRebalancePeriod.day)
        .withContext("portfolioRebalancePeriod.day").toBe(3);
      expect(rebalancingStrategy.portfolioRebalancePeriod.periodicity)
        .withContext("portfolioRebalancePeriod.periodicity").toBe(Periodicity.WEEKLY);
      expect(rebalancingStrategy.portfolioRebalancePeriod.skip)
        .withContext("portfolioRebalancePeriod.skip").toBe(1);

      expect(rebalancingStrategy.positionRebalancePeriod.day)
        .withContext("positionRebalancePeriod.day").toBe(3);
      expect(rebalancingStrategy.positionRebalancePeriod.periodicity)
        .withContext("positionRebalancePeriod.periodicity").toBe(Periodicity.WEEKLY);
      expect(rebalancingStrategy.positionRebalancePeriod.skip)
        .withContext("positionRebalancePeriod.skip").toBe(2);

      expect(rebalancingStrategy.marketTiming).withContext("marketTiming").toBeTruthy();

      let quotesAssessor = <TopOfUniverseQuotesAssessor>rebalancingStrategy.quotesAssessor
      expect(quotesAssessor.universe).withContext("universe").toBeTruthy();
      expect(quotesAssessor.topOfIndex).withContext("topOfIndex").toBe(20);

      let quoteAssessor = <MomentumQuoteAssessor>quotesAssessor.quoteAssessorFactory("xx");
      expect(quoteAssessor.name).toBe("xx");
      expect(quoteAssessor.momentumDistance).withContext("momentumDistance").toBe(100);
      expect(quoteAssessor.maximumAcceptableGap).withContext("maximumAcceptableGap").toBe(0.15);
      expect(quoteAssessor.gapDistance).withContext("gapDistance").toBe(100);
      expect(quoteAssessor.averageTrueRangeDistance).withContext("averageTrueRangeDistance").toBe(20);
      expect(quoteAssessor.maximumAtrPerPosition).withContext("maximumAtrPerPosition").toBe(0.04);
      expect(quoteAssessor.movingAverageDistance).withContext("movingAverageDistance").toBe(200);
  });
});
