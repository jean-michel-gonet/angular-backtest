import { Component, Input, ContentChild, ContentChildren, QueryList } from '@angular/core';
import { RegularTransferComponent } from '../transfer/regular-transfer.component';
import { FixedAllocationStrategy, IAllocation } from 'src/app/model/strategies/strategy.fixed-allocation';
import { Periodicity } from 'src/app/model/core/period';
import { RegularTransfer } from 'src/app/model/core/transfer';

@Component({
  selector: 'allocation',
  template: ''
})
export class AllocationComponent {
  @Input()
  private assetName: string;

  private _allocation: number;
  @Input()
  set allocation(value: number) {
    if (typeof value == 'string') {
      this._allocation = parseFloat(value);
    } else {
      this._allocation = value;
    }
  }
  get allocation() {
    return this._allocation;
  }

  public asAllocation(): IAllocation {
    return {assetName: this.assetName, allocation: this.allocation};
  }
}

@Component({
  selector: 'fixed-allocations',
  template: ''
})
export class FixedAllocationsStrategyComponent {
  @ContentChild(RegularTransferComponent, {static: true})
  private transfer: RegularTransferComponent;

  @ContentChildren(AllocationComponent)
  private allocationComponents: QueryList<AllocationComponent>;

  private _periodicity: Periodicity;
  @Input()
  set periodicity(value: Periodicity) {
    if (typeof value == 'string') {
      this._periodicity = Periodicity[value];
    } else {
      this._periodicity = value;
    }
  }
  get periodicity() {
    return this._periodicity;
  }

  private _threshold: number;
  @Input()
  set threshold(value: number) {
    if (typeof value == 'string') {
      this._threshold = parseFloat(value);
    } else {
      this._threshold = value;
    }
  }
  get threshold() {
    return this._threshold;
  }

  public asStrategy(): FixedAllocationStrategy {
    let fixedAllocations: IAllocation[] = [];
    this.allocationComponents.forEach(allocationComponent => {
      fixedAllocations.push(allocationComponent.asAllocation());
    })

    let transfer: RegularTransfer;
    if (this.transfer) {
      transfer = this.transfer.asRegularTransfer();
    }

    return new FixedAllocationStrategy({
      fixedAllocations: fixedAllocations,
      transfer: transfer,
      periodicity: this.periodicity,
      threshold: this.threshold
    });
  }
}
