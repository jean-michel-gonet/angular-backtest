import { Component, OnInit } from '@angular/core';
import { QuotesService } from '../services/quotes/quotes.service';
import { Simulation } from '../model/core/simulation';
import { SwissQuoteAccount } from '../model/account.swissquote';
import { Ng2ChartReport, ShowDataAs, ShowDataOn } from '../display/ng2-chart.report';
import { BuyAndHoldStrategy } from '../model/strategies/strategy.buy-and-hold';
import { SuperthonMarketTiming } from '../model/market-timing.superthon';
import { RegularPeriod, RegularTransfer } from '../model/core/transfer';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {
  simulation: Simulation;
  ng2ChartReport: Ng2ChartReport;

  constructor(private quotesService:QuotesService) {
  }

  ngOnInit() {
    this.ng2ChartReport = new Ng2ChartReport([
      {
        show: "SP500.CLOSE",
        as: ShowDataAs.LINE,
        on: ShowDataOn.LEFT,
        normalize: true
      },
      {
        show: "AGG.CLOSE",
        as: ShowDataAs.LINE,
        on: ShowDataOn.LEFT,
        normalize: false
      },
      {
        show: "PORTFOLIO.NAV",
        as: ShowDataAs.LINE,
        on: ShowDataOn.LEFT,
        normalize: true
      },
      {
        show: "LIFESTYLE.CASH",
        as: ShowDataAs.LINE,
        on: ShowDataOn.RIGHT
      }
    ]);

    // Fetch the data:
    this.quotesService.getQuotes(['SP500', 'AGG'])
      .subscribe(historicalQuotes => {
        // Set up the simulation:
        this.simulation = new Simulation({
          accounts: [
            new SwissQuoteAccount({
              id: "PORTFOLIO",
              cash: 100000,
              strategy: new BuyAndHoldStrategy({
                assetName: "SP500",
                assetNameDuringBear: "AGG",
                marketTiming: new SuperthonMarketTiming(),
                transfer: new RegularTransfer({
                  transfer: 660,
                  every: RegularPeriod.MONTH,
                  to: new SwissQuoteAccount({
                    id: "LIFESTYLE"
                  })
                })
              })
            }),
          ],
          historicalQuotes: historicalQuotes,
          report: this.ng2ChartReport
        });
        // Run the simulation:
        this.simulation
          .run(new Date(1996, 0, 0), new Date (2020, 0, 1));
    });
  }
}
