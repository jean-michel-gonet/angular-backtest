import { Component, ContentChild } from '@angular/core';
import { BuyAndHoldStrategy } from 'src/app/model/strategies/strategy.buy-and-hold';
import { Strategy } from 'src/app/model/core/strategy';
import { BuyAndHoldStrategyComponent } from './b-a-h.strategy.component';

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
