import { Component, Input } from '@angular/core';
import { Account } from 'src/app/model/core/account';

@Component({
  selector: 'to-account',
  template: ''
})
export class TransferToComponent {
  @Input()
  private id: string;

  @Input()
  private cash: string;

  public asAccount(): Account {
    return new Account({
      id: this.id,
      cash: parseFloat(this.cash)
    });
  }
}
