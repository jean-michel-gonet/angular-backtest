import { Component, Input, ContentChild } from '@angular/core';
import { AccountsComponent } from '../accounts/accounts.component';
import { QuotesServiceImpl } from 'src/app/services/quotes/quotes.service';
import { Simulation } from 'src/app/model/core/simulation';
import { ReportsComponent } from '../reports/reports.component';

export enum SimulationStatus {
  WAITING,
  RUNNING,
  COMPLETED
}

@Component({
  selector: 'simulation',
  templateUrl: './simulation.component.html',
})
export class SimulationComponent {
  private status: SimulationStatus = SimulationStatus.WAITING;

  private _start: Date;
  private _end: Date;

  @Input()
  set start(value: Date) {
    if (typeof value == 'string') {
      this._start = this.convertToDate(value);
    }
  }
  get start(): Date {
    return this._start;
  }

  @Input()
  set end(value: Date) {
    if (typeof value == 'string') {
      this._end = this.convertToDate(value);
    }
  }
  get end(): Date {
    return this._end;
  }

  @ContentChild(ReportsComponent, {static: true})
  public reportComponent: ReportsComponent;

  @ContentChild(AccountsComponent, {static: true})
  public accountsComponent: AccountsComponent;

  constructor(private quotesService:QuotesServiceImpl) {
  }

  displayRunButton(): boolean  {
    return this.status == SimulationStatus.WAITING;
  }

  run(): void {
    console.log("Simulation starting at '" + this.start +
                "', ending at '" + this.end + "'");

    // Set up the simulation:
    let simulation: Simulation = new Simulation({
      accounts: this.accountsComponent.asAccounts(),
      quoteService: this.quotesService,
      report: this.reportComponent.asReports()
    });

    // Run the simulation:
    simulation
      .run(this.start, this.end)
      .subscribe(() => {
        this.status = SimulationStatus.COMPLETED;
      });

    // Simulation is running until further notification:
    this.status = SimulationStatus.RUNNING;
  }

  private convertToDate(s: string) {
    if (s) {
      let tokens = s.split(new RegExp("[.-]"));
      if (tokens.length == 3) {
        let year = parseInt(tokens[0]);
        let month = parseInt(tokens[1]) - 1;
        let day = parseInt(tokens[2]);
        return new Date(year, month, day);
      }
    }
    return undefined;
  }
}
