import { Component, ViewChild, NO_ERRORS_SCHEMA } from "@angular/core";
import { BuyAndHoldStrategyComponent } from './b-a-h.strategy.component';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TransferToComponent } from '../accounts/transfer-to.component';
import { MarketTimingComponent } from '../markettiming/market-timing.component';
import { EMAMarketTimingComponent } from '../markettiming/market-timing.ema.component';
import { SuperthonMarketTimingComponent } from '../markettiming/market-timing.superthon.component';
import { MACDMarketTimingComponent } from '../markettiming/market-timing.macd.component';

@Component({
  selector: 'parent',
  template: 'to-be-defined'
})
class TestWrapperComponent {
  @ViewChild(BuyAndHoldStrategyComponent, {static: true})
  public buyAndHoldStrategyComponent: BuyAndHoldStrategyComponent;
}

describe('BuyAndHoldStrategyComponent', () => {
  let component: BuyAndHoldStrategyComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        TestWrapperComponent,
        BuyAndHoldStrategyComponent,
        MarketTimingComponent,
        EMAMarketTimingComponent,
        SuperthonMarketTimingComponent,
        MACDMarketTimingComponent,
        TransferToComponent
      ]
    });
  }));

  it('Can instantiate a Buy and Hold strategy with market timing and transfer', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <buy-and-hold assetName="AN" assetNameDuringBear="ANDB">
            <market-timing>
              <candle-filter></candle-filter>
            </market-timing>
          </buy-and-hold>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.buyAndHoldStrategyComponent;
      let buyAndHoldStrategy = component.asBuyAndHoldStrategyComponent();

      expect(buyAndHoldStrategy.marketTiming).toBeDefined();
      expect(buyAndHoldStrategy.transfer).toBeDefined();
      expect(buyAndHoldStrategy.assetName).toBe("AN")
      expect(buyAndHoldStrategy.assetNameDuringBear).toBe("ANDB");
  });

  it('Can instantiate a pure Buy and Hold strategy', () => {
    TestBed.overrideComponent(TestWrapperComponent, {
        set: {
          template: `
          <buy-and-hold assetName="AN" assetNameDuringBear="ANDB">
          </buy-and-hold>`
        }
      }).compileComponents();
      const fixture: ComponentFixture<TestWrapperComponent>
        = TestBed.createComponent(TestWrapperComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.buyAndHoldStrategyComponent;
      let buyAndHoldStrategy = component.asBuyAndHoldStrategyComponent();

      expect(buyAndHoldStrategy.assetName).toBe("AN")
      expect(buyAndHoldStrategy.assetNameDuringBear).toBe("ANDB");
  });

});
