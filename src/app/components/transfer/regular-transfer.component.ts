import { Input, Component, ContentChild } from '@angular/core';
import { RegularPeriod, RegularTransfer } from 'src/app/model/core/transfer';
import { TransferToComponent } from '../accounts/transfer-to.component';

@Component({
  selector: 'regular-transfer',
  template: '<ng-content></ng-content>'
})
export class RegularTransferComponent {
  private _transfer: number;
  @Input()
  set transfer(value: number) {
    if (typeof value == 'string') {
      this._transfer = parseFloat(value);
    } else {
      this._transfer = value;
    }
  }
  get transfer() {
    return this._transfer;
  }

  private _every: RegularPeriod;
  @Input()
  set every(value: RegularPeriod) {
    if (typeof value == 'string') {
      this._every = RegularPeriod[value];
    } else {
      this._every = value;
    }
  }
  get every() {
    return this._every;
  }

  @ContentChild(TransferToComponent, {static: true})
  private toAccountComponent: TransferToComponent

  public asRegularTransfer(): RegularTransfer {
    return new RegularTransfer({
      transfer: this.transfer,
      every: this.every,
      to: this.toAccountComponent.asAccount()
    })
  }
}
