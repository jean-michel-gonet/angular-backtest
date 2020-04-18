import { Component, Input, ContentChild } from '@angular/core';
import { ChartReportComponent } from '../reports/chart-report.component';
import { AccountsComponent } from '../accounts/accounts.component';
import { QuotesService } from 'src/app/services/quotes/quotes.service';
import { Simulation } from 'src/app/model/core/simulation';

enum SimulationStatus {
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
  private _quotes: string[];

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

  @Input()
  set quotes(value: string[]) {
    if (typeof value == 'string') {
      this._quotes = this.convertToArray(value);
    } else {
      this._quotes = value;
    }
  }
  get quotes() {
    return this._quotes;
  }


  @ContentChild(ChartReportComponent, {static: true})
  public reportComponent: ChartReportComponent;

  @ContentChild(AccountsComponent, {static: true})
  public accountsComponent: AccountsComponent;

  constructor(private quotesService:QuotesService) {
  }

  displayRunButton(): boolean  {
    return this.status == SimulationStatus.WAITING;
  }

  run(): void {
    console.log("Simulation starting at '" + this.start +
                "', ending at '" + this.end +
                "' based on [" + this.quotes + "]");

    // Fetch the data:
    this.quotesService.getQuotes(this.quotes)
      .subscribe(historicalQuotes => {
        // Set up the simulation:
        let simulation: Simulation = new Simulation({
          accounts: this.accountsComponent.asAccounts(),
          historicalQuotes: historicalQuotes,
          report: this.reportComponent
        });

        // Run the simulation:
        simulation
          .run(this.start, this.end);

        this.status = SimulationStatus.COMPLETED;
    });
    this.status = SimulationStatus.RUNNING;
  }

  private convertToArray(s: string): string[] {
    let array: string[] = [];
    if (s) {
      let tokens = s.split(/[,.]/);
      tokens.forEach(element => {
        array.push(element.trim());
      });
    }
    return array;
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
