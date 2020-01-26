import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock/stock.service';
import { Simulation } from '../model/core/simulation';
import { SwissQuoteAccount } from '../model/account.swissquote';
import { BuyAndHoldStrategy } from '../model/strategy.buy-and-hold';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { Show, ShowDataAs, ShowDataOn, Ng2ChartDataProcessor } from './graphic-data';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  simulation: Simulation;
  ng2ChartDataProcessor: Ng2ChartDataProcessor;

  dataSets: ChartDataSets[] = [
    {
      data: [0,
        30, 20, 40, 35, 45, 33, 0,
        30, 20, 40, 35, 45, 33, 0,
        30, 20, 40, 35, 45, 33, 0,
        30, 20, 40, 35, 45, 33, 0,
      0],
      label: "Bar 1",
      yAxisID: "y-axis-right",
    },
    {
      data: [0,
        500, 600, 550, 590, 300, 400, 0,
        500, 600, 550, 590, 300, 400, 0,
        500, 600, 550, 590, 300, 400, 0,
        500, 600, 550, 590, 300, 400, 0,
      0],
      label: "Bar 2",
      yAxisID: "y-axis-left"
    },
    {
      data: [
        15, 55, 25, 35, 45, 55, 75, 85, 55,
        15, 55, 25, 35, 45, 55, 75, 85, 55,
        15, 55, 25, 35, 45, 55, 75, 85, 55,
        15, 55, 25, 35, 45, 55, 75, 85, 55,
      ],
      label: "Line",
      type: "line",
    }
  ];
  labels: Label[] = [
    "FirstPlaceholder",

    "1Monday",
    "1Tuesday",
    "1Wednesday",
    "1Thursday",
    "1Friday",
    "1Saturday",
    "1Sunday",

    "2Monday",
    "2Tuesday",
    "2Wednesday",
    "2Thursday",
    "2Friday",
    "2Saturday",
    "2Sunday",

    "3Monday",
    "3Tuesday",
    "3Wednesday",
    "3Thursday",
    "3Friday",
    "3Saturday",
    "3Sunday",

    "4Monday",
    "4Tuesday",
    "4Wednesday",
    "4Thursday",
    "4Friday",
    "4Saturday",
    "4Sunday",

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
            display: true,
          }
        }],
      }
    };

  constructor(private stockService:StockService) {
  }

  ngOnInit() {
    this.ng2ChartDataProcessor = new Ng2ChartDataProcessor([
      {
        show: "SQA01.NAV",
        as: ShowDataAs.LINE,
        on: ShowDataOn.LEFT
      },
      {
        show: "LU1290894820.CLOSE",
        as: ShowDataAs.LINE,
        on: ShowDataOn.LEFT
      },
      {
        show: "SQA01.COSTS",
        as: ShowDataAs.BAR,
        on: ShowDataOn.RIGHT
      }
    ]);

    // Fetch the data:
    this.stockService.getStockData(['LU1290894820CHF4', 'CH0017810976CHF9']).subscribe(data => {

      // Set up the simulation:
      this.simulation = new Simulation({
        account: new SwissQuoteAccount({
          id: "SQA01",
          cash: 100000,
          strategy: new BuyAndHoldStrategy({
            isin: "LU1290894820",
            monthlyOutput: 100})
        }),
        stockData: data,
        dataProcessor: this.ng2ChartDataProcessor
      });

      // Run the simulation:
      this.simulation.run(new Date(2010, 1, 1), new Date (2020, 1, 1));
    });
  }
}
