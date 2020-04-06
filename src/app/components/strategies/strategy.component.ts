import { Component, Input, ContentChild } from '@angular/core';
import { RegularTransferComponent } from '../transfer/regular-transfer.component';
import { BuyAndHoldStrategy } from 'src/app/model/strategies/strategy.buy-and-hold';
import { MarketTimingComponent } from '../markettiming/market-timing.component';
import { Strategy } from 'src/app/model/core/strategy';


@Component({
  selector: 'buy-and-hold',
  template: ''
})
export class BuyAndHoldStrategyComponent {
  @Input()
  private assetName: string;

  @Input()
  private assetNameDuringBear: string;

  @ContentChild(MarketTimingComponent, {static: true})
  private marketTiming: MarketTimingComponent;

  @ContentChild(RegularTransferComponent, {static: true})
  private transfer: RegularTransferComponent;

  public asBuyAndHoldStrategyComponent(): BuyAndHoldStrategy {
    return new BuyAndHoldStrategy({
      assetName: this.assetName,
      assetNameDuringBear: this.assetNameDuringBear,
      marketTiming: this.marketTiming.asMarketTiming(),
      transfer: this.transfer.asRegularTransfer()
    });
  }
}

@Component({
  selector: 'strategy',
  template: '<ng-content></ng-content>'
})
export class StrategyComponent {
    @ContentChild(BuyAndHoldStrategyComponent, {static: true})
    private buyAndHoldStrategyComponent: BuyAndHoldStrategyComponent;

    public asStrategy(): Strategy {
      if (this.buyAndHoldStrategyComponent) {
        let b: BuyAndHoldStrategy = this.buyAndHoldStrategyComponent.asBuyAndHoldStrategyComponent();
        return b;
      }
      throw new Error("Expected one of <buy-and-hold>");
    }
}
