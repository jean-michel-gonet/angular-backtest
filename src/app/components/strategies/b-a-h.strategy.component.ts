import { Component, Input, ContentChild } from '@angular/core';
import { MarketTimingComponent } from '../markettiming/market-timing.component';
import { RegularTransferComponent } from '../transfer/regular-transfer.component';
import { BuyAndHoldStrategy } from 'src/app/model/strategies/strategy.buy-and-hold';

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
      marketTiming: this.marketTiming? this.marketTiming.asMarketTiming() : undefined,
      transfer: this.transfer? this.transfer.asRegularTransfer() : undefined
    });
  }
}
