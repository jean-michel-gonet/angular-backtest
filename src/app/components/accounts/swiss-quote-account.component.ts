import { Component, Input, ContentChild } from '@angular/core';
import { Strategy } from 'src/app/model/core/strategy';
import { SwissQuoteAccount } from 'src/app/model/accounts/account.swissquote';
import { Account } from 'src/app/model/core/account';
import { StrategyComponent } from '../strategies/strategy.component';

@Component({
  selector: 'swiss-quote',
  template: ''
})
export class SwissQuoteAccountComponent {
  @Input()
  private id: string;

  @Input()
  private cash: string;

  @ContentChild(StrategyComponent, {static: true})
  private strategyComponent: StrategyComponent;

  public asAccount(): Account {
    let strategy: Strategy;
    if (this.strategyComponent) {
      strategy = this.strategyComponent.asStrategy();
    }
    return new SwissQuoteAccount({
      id: this.id,
      cash: parseFloat(this.cash),
      strategy: strategy
    });
  }
}
