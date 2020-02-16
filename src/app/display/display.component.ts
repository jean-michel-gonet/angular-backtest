import { Component, OnInit } from '@angular/core';
import { QuotesService } from '../services/quotes/quotes.service';
import { Simulation } from '../model/core/simulation';
import { SwissQuoteAccount } from '../model/account.swissquote';
import { Ng2ChartReport, ShowDataAs, ShowDataOn } from './ng2-chart.report';
import { BuyAndHoldStrategyWithTiming } from '../model/strategy.buy-and-hold.with-timing';
import { SuperthonMarketTiming } from '../model/market-timing.superthon';
import { MACDMarketTiming } from '../model/market-timing.macd';
import { BearBull } from '../model/core/market-timing';
import { EMAMarketTiming } from '../model/market-timing.ema';

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
        show: "SQ01.NAV",
        as: ShowDataAs.LINE,
        on: ShowDataOn.LEFT,
        normalize: true
      },
      {
        show: "EMA.SEMA",
        as: ShowDataAs.LINE,
        on: ShowDataOn.LEFT,
        normalize: true
      },
      {
        show: "EMA.LEMA",
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
        accounts: [
          new SwissQuoteAccount({
            id: "SQ01",
            cash: 100000,
            strategy: new BuyAndHoldStrategyWithTiming({
              name: "SP500",
              reinvestDividends: false,
              marketTiming: new EMAMarketTiming({
                name: "EMA",
                status: BearBull.BULL
              })
            })
          })],
        historicalQuotes: historicalQuotes,
        report: this.ng2ChartReport
      });

      // Run the simulation:
      this.simulation.run(new Date(1996, 0, 0), new Date (2017, 0, 0));
    });
  }
}
