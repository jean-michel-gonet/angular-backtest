import { Component, ContentChildren, QueryList, ContentChild } from '@angular/core';
import { Account } from 'src/app/model/core/account';
import { SwissQuoteAccountComponent } from './swiss-quote-account.component';


@Component({
  selector: 'accounts',
  template: '<ng-content></ng-content>'
})
export class AccountsComponent {
  @ContentChildren(SwissQuoteAccountComponent)
  private swissQuoteAccountComponent: QueryList<SwissQuoteAccountComponent>;

  public asAccounts(): Account[] {
    let accounts: Account[] = [];
    this.swissQuoteAccountComponent.forEach(swissQuoteAccountComponent =>  {
      accounts.push(swissQuoteAccountComponent.asAccount());
    });
    return accounts;
  }
}

@Component({
  selector: 'account',
  template: '<ng-content></ng-content>'
})
export class AccountComponent {
  @ContentChild(SwissQuoteAccountComponent, {static: true})
  private swissQuoteAccountComponent: SwissQuoteAccountComponent;

  public asAccount(): Account {
    return this.swissQuoteAccountComponent.asAccount();
  }
}
