import { Component, OnInit } from '@angular/core';
import { QuotesService } from '../services/stock/stock.service';
import { Simulation } from '../model/core/simulation';
import { SwissQuoteAccount } from '../model/account.swissquote';
import { BuyAndHoldStrategy } from '../model/strategy.buy-and-hold';
import { Ng2ChartReport, ShowDataAs, ShowDataOn } from './ng2-chart.report';
import { RegularTransfer, RegularPeriod } from '../model/core/transfer';
import { Account } from '../model/core/account';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  simulation: Simulation;
  ng2ChartReport: Ng2ChartReport;

  constructor(private quotesService:QuotesService) {
  }

  ngOnInit() {
    this.ng2ChartReport = new Ng2ChartReport([
      {
        show: "SQA01.NAV",
        as: ShowDataAs.LINE,
        on: ShowDataOn.LEFT,
        normalize: true
      },
      {
        show: "SP500.CLOSE",
        as: ShowDataAs.LINE,
        on: ShowDataOn.LEFT,
        normalize: true
      }
    ]);

    // Fetch the data:
    this.quotesService.getHistoricalQuotes(['SP500']).subscribe(historicalQuotes => {

      // Set up the simulation:
      this.simulation = new Simulation({
        account: new SwissQuoteAccount({
          id: "SQA01",
          cash: 100000,
          strategy: new BuyAndHoldStrategy({
            name: "SP500",
            transfer: new RegularTransfer({
              transfer: 0,
              to: new Account({
                id: "EXPENSES"
              }),
              every: RegularPeriod.MONTH
            })})
        }),
        historicalQuotes: historicalQuotes,
        report: this.ng2ChartReport
      });

      // Run the simulation:
      this.simulation.run(new Date(1996, 1, 1), new Date (2020, 12, 31));
    });
  }
}
