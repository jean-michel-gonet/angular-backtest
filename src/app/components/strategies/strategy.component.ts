import { Component, ContentChild } from '@angular/core';
import { Strategy } from 'src/app/model/core/strategy';
import { BuyAndHoldStrategyComponent } from './b-a-h.strategy.component';
import { FixedAllocationsStrategyComponent } from './fixed-allocation.strategy.component';

@Component({
  selector: 'strategy',
  template: '<ng-content></ng-content>'
})
export class StrategyComponent {
    @ContentChild(BuyAndHoldStrategyComponent, {static: true})
    private buyAndHoldStrategyComponent: BuyAndHoldStrategyComponent;
    @ContentChild(FixedAllocationsStrategyComponent, {static: true})
    private fixedAllocationsStrategyComponent: FixedAllocationsStrategyComponent;

    public asStrategy(): Strategy {
      if (this.buyAndHoldStrategyComponent) {
        return this.buyAndHoldStrategyComponent.asBuyAndHoldStrategyComponent();
      }
      if (this.fixedAllocationsStrategyComponent) {
        return this.fixedAllocationsStrategyComponent.asStrategy();
      }
      throw new Error("Expected one of <buy-and-hold>");
    }
}
