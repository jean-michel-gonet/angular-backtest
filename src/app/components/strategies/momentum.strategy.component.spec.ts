import { Component, ViewChild, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
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
  @ViewChild(StrategyComponent, {static: true})
  public strategyComponent: StrategyComponent;
}

describe('MomentumStrategyComponent', () => {
  let component: StrategyComponent;

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
              <momentum id = "ID100"
                        momentumDistance = "100"
                        maximumAcceptableGap = "0.15"
                        gapDistance = "100"
                        averageTrueRangeDistance = "20"
                        maximumAtrPerPosition = "0.04"
                        movingAverageDistance = "200"
                        topOfIndex = "20"
                        tradingDayOfTheWeek = "3"
                        smallestOperation = "400"
                        universeName = "SP500_UNIVERSE"
                        minimumCash = "10000">
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

      let momentumStrategy = component.asStrategy();
      expect(momentumStrategy).toBeTruthy();
  });
});
