import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock/stock.service';
import { Simulation } from '../model/core/simulation';
import { SwissQuoteAccount } from '../model/account.swissquote';
import { BuyAndHoldStrategy } from '../model/strategy.buy-and-hold';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  simulation: Simulation;
  lineChartData: ChartDataSets[] = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Crude oil prices' },
  ];

  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  constructor(private stockService:StockService) {
  }

  ngOnInit() {
    /*
    // Fetch the data:
    this.stockService.getStockData(['LU1290894820CHF4', 'CH0017810976CHF9']).subscribe(data => {

      // Set up the simulation:
      this.simulation = new Simulation({
        account: new SwissQuoteAccount({
          cash: 100000,
          strategy: new BuyAndHoldStrategy("LU1290894820")
        }),
        stockData: data
      });

      // Run the simulation:
      this.simulation.run(new Date(2010, 1, 1), new Date (2020, 1, 1));
    });
    */
  }
}
