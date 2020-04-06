import { Input, Component, ContentChild } from '@angular/core';
import { RegularPeriod, RegularTransfer } from 'src/app/model/core/transfer';
import { TransferToComponent } from '../accounts/transfer-to.component';

@Component({
  selector: 'regular-transfer',
  template: '<ng-content></ng-content>'
})
export class RegularTransferComponent {
  @Input()
  private transfer: string;

  @Input()
  private every: RegularPeriod;

  @ContentChild(TransferToComponent, {static: true})
  private toAccountComponent: TransferToComponent

  public asRegularTransfer(): RegularTransfer {
    return new RegularTransfer({
      transfer: parseFloat(this.transfer),
      every: this.every,
      to: this.toAccountComponent.asAccount()
    })
  }
}
