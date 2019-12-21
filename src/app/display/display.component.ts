import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock/stock.service';
import { IStock } from '../model/stock';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  data: IStock[];
  constructor(private stockService:StockService) { }

  ngOnInit() {
    this.stockService.getStockData(['LU1290894820CHF4', 'CH0017810976CHF9']).subscribe(data => {
      this.data = data.asIStock();
    });
  }
}
