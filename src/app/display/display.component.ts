import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock/stock.service';
import { Simulation } from '../model/core/simulation';
import { SwissQuoteAccount } from '../model/account.swissquote';
import { BuyAndHoldStrategy } from '../model/strategy.buy-and-hold';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  simulation: Simulation;
  dataSets: ChartDataSets[] = [
    {
      data: [0, 30, 20, 40, 35, 45, 33, 0, 0],
      label: "Bar 1",
      yAxisID: "y-axis-right"
    },
    {
      data: [0, 500, 600, 550, 590, 300, 400, 0, 0],
      label: "Bar 2",
      yAxisID: "y-axis-left"
    },
    {
      data: [15, 55, 25, 35, 45, 55, 75, 85, 55],
      label: "Line",
      type: "line"
    }
  ];
  labels: Label[] = [
    "FirstPlaceholder",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "LastPlaceholder"
  ];
  options: ChartOptions = {
      legend: {
        display: true
      },
      scales: {
        yAxes: [
          {
            id: "y-axis-left",
            position: 'left',
            ticks: {
              beginAtZero: true
            }
          }, {
            id: "y-axis-right",
            position: 'right',
            ticks: {
              beginAtZero: true
            }
          }],
        xAxes: [{
          ticks: {
            min: "Monday",
            max: "Sunday",
          }
        }],
      }
    };

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
